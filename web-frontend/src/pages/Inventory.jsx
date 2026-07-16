import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { inventoryApi } from '../api/inventory';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { Package, ClipboardList, AlertTriangle, Boxes, Plus, Pencil, Trash2 } from 'lucide-react';
import { FormField, FormActions, LoadingText } from '../components/ui';

const CATEGORIES = ['STATIONERY', 'LAB_EQUIPMENT', 'ACADEMICS', 'SPORTS', 'IT_EQUIPMENT', 'FURNITURE', 'LIBRARY', 'GENERAL'];
const CAN_MANAGE = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'];
const CAN_DELETE = ['SUPER_ADMIN'];
const CAN_INDENT = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'SUPERVISOR', 'FACULTY'];

const EMPTY_FORM = { name: '', category: 'STATIONERY', quantity: '', unit: '', lowStockThreshold: '', description: '' };

export default function Inventory() {
  const { user } = useAuth();
  const isAdmin = CAN_MANAGE.includes(user?.role);
  const isFaculty = user?.role === 'FACULTY';
  const canDelete = CAN_DELETE.includes(user?.role);
  const canIndent = CAN_INDENT.includes(user?.role);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [assignedCategories, setAssignedCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [showIndentModal, setShowIndentModal] = useState(false);
  const [indentForm, setIndentForm] = useState({ itemId: '', quantity: '', reason: '' });

  const load = useCallback(() => {
    setLoading(true);
    if (isAdmin) {
      const params = selectedCategory ? { category: selectedCategory } : {};
      inventoryApi.getAllItems(params)
        .then((res) => setItems(res.data || []))
        .catch(() => setItems([]))
        .finally(() => setLoading(false));
    } else if (isFaculty && user?.id) {
      Promise.all([
        inventoryApi.getMyAssignedItems(user.id).catch(() => ({ data: [] })),
        inventoryApi.getMyCategories(user.id).catch(() => ({ data: [] })),
      ]).then(([itemsRes, catRes]) => {
        setItems(itemsRes.data || []);
        setAssignedCategories(catRes.data || []);
      }).finally(() => setLoading(false));
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [isAdmin, isFaculty, user?.id, selectedCategory]);

  useEffect(() => { load(); }, [load]);

  const handleOpenCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setShowModal(true); };
  const handleOpenEdit = (item) => {
    setForm({ name: item.name || '', category: item.category || 'STATIONERY', quantity: item.quantity || '', unit: item.unit || '', lowStockThreshold: item.lowStockThreshold || '', description: item.description || '' });
    setEditingId(item.id); setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, quantity: parseInt(form.quantity) || 0, lowStockThreshold: parseInt(form.lowStockThreshold) || 0 };
      if (editingId) await inventoryApi.updateItem(editingId, payload);
      else await inventoryApi.createItem(payload);
      setShowModal(false); load();
    } catch (err) { alert('Failed to save: ' + (err.response?.data?.message || err.message)); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item? It will be marked inactive.')) return;
    try { await inventoryApi.deleteItem(id); load(); }
    catch (err) { alert('Failed to delete: ' + (err.response?.data?.message || err.message)); }
  };

  const handleIndentSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await inventoryApi.createIndent({ ...indentForm, itemId: parseInt(indentForm.itemId), quantity: parseInt(indentForm.quantity), facultyUserId: user.id });
      setShowIndentModal(false);
      setIndentForm({ itemId: '', quantity: '', reason: '' });
    } catch (err) { alert('Failed to submit indent: ' + (err.response?.data?.message || err.message)); }
    finally { setSaving(false); }
  };

  const lowStock = items.filter(i => i.lowStockThreshold && i.quantity <= i.lowStockThreshold);
  const categories = [...new Set(items.map(i => i.category))];

  const cards = [
    { label: 'Total Items', value: items.length, icon: Package, color: 'gradient-bg' },
    { label: 'Low Stock', value: lowStock.length, icon: AlertTriangle, color: '[color-mix(in_srgb,var(--danger)_10%,transparent)]0' },
    { label: 'Categories', value: categories.length, icon: Boxes, color: '[color-mix(in_srgb,var(--info)_10%,transparent)]0' },
    { label: 'Pending Indents', value: '—', icon: ClipboardList, color: '[color-mix(in_srgb,var(--warning)_10%,transparent)]0' },
  ];

  return (
    <div>
      <PageHeader
        title="Inventory"
        subtitle={isFaculty ? 'Inventory items under your management' : 'Manage stock items and indent requests'}
        action={isAdmin && (
          <button onClick={handleOpenCreate} className="inline-flex items-center gap-2 rounded-lg gradient-bg px-4 py-2 text-sm font-semibold text-white gradient-bg-hover transition-colors">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        )}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl theme-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs theme-text-muted">{label}</p>
              <p className="text-xl font-bold theme-text">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        {isAdmin && (
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="rounded-lg theme-input px-3 py-2 text-sm focus-ring">
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
          </select>
        )}
        {canIndent && (
          <button onClick={() => setShowIndentModal(true)} className="inline-flex items-center gap-2 rounded-lg theme-input px-4 py-2 text-sm font-medium theme-text hover:[var(--sidebar-hover-bg)] transition-colors">
            <ClipboardList className="w-4 h-4" /> Submit Indent
          </button>
        )}
      </div>

      {isFaculty && assignedCategories.length > 0 && (
        <div className="mb-4">
          <p className="text-sm theme-text-muted">
            <span className="font-medium">Your assigned categories:</span>{' '}
            {assignedCategories.map(c => c.replace(/_/g, ' ')).join(', ')}
          </p>
        </div>
      )}

      <div className="rounded-xl theme-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b [var(--divider)] text-left theme-text-muted [var(--sidebar-hover-bg)]">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Quantity</th>
              <th className="px-4 py-3 font-medium">Low Stock Threshold</th>
              {isAdmin && <th className="px-4 py-3 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y theme-divider">
            {loading ? (
              <tr><td colSpan={isAdmin ? 5 : 4} className="px-4 py-6"><LoadingText /></td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={isAdmin ? 5 : 4} className="px-4 py-6 text-center theme-text-faint">
                {isFaculty ? 'No inventory items assigned to you yet.' : 'No inventory items found.'}
              </td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:[var(--sidebar-hover-bg)]">
                  <td className="px-4 py-3 font-medium theme-text">{item.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full [var(--sidebar-hover-bg)] theme-text text-xs font-medium">
                      {item.category?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 theme-text">{item.quantity}</td>
                  <td className="px-4 py-3 theme-text">{item.lowStockThreshold ?? '—'}</td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleOpenEdit(item)} className="p-1.5 theme-text-faint hover:[color:var(--info)] transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        {canDelete && (
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 theme-text-faint hover:[color:var(--danger)] transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Item' : 'Add Item'}>
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Name">
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" />
          </FormField>
          <FormField label="Category">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Quantity">
              <input type="number" required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" />
            </FormField>
            <FormField label="Unit">
              <input type="text" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="e.g. pcs, boxes" className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" />
            </FormField>
          </div>
          <FormField label="Low Stock Threshold">
            <input type="number" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" />
          </FormField>
          <FormField label="Description">
            <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" />
          </FormField>
          <FormActions onSubmit={handleSave} onCancel={() => setShowModal(false)} submitLabel={editingId ? 'Update' : 'Create'} submitting={saving} />
        </form>
      </Modal>

      <Modal open={showIndentModal} onClose={() => setShowIndentModal(false)} title="Submit Indent Request">
        <form onSubmit={handleIndentSubmit} className="space-y-4">
          <FormField label="Item">
            <select required value={indentForm.itemId} onChange={(e) => setIndentForm({ ...indentForm, itemId: e.target.value })} className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring">
              <option value="">Select Item</option>
              {items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </FormField>
          <FormField label="Quantity">
            <input type="number" required value={indentForm.quantity} onChange={(e) => setIndentForm({ ...indentForm, quantity: e.target.value })} className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" />
          </FormField>
          <FormField label="Reason">
            <input type="text" required value={indentForm.reason} onChange={(e) => setIndentForm({ ...indentForm, reason: e.target.value })} className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" />
          </FormField>
          <FormActions onSubmit={handleIndentSubmit} onCancel={() => setShowIndentModal(false)} submitLabel="Submit" submitting={saving} />
        </form>
      </Modal>
    </div>
  );
}
