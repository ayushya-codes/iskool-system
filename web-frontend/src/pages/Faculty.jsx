import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { facultyApi } from '../api/faculty';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { LoadingText, FormField, FormActions } from '../components/ui';

const CAN_MANAGE = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'];
const CAN_DELETE = ['SUPER_ADMIN'];

const EMPTY_FORM = { fullName: '', email: '', mobileNumber: '', password: '', employeeId: '', certifications: '', maxWeeklyLectures: '' };

export default function Faculty() {
  const { user } = useAuth();
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const canManage = user && CAN_MANAGE.includes(user.role);
  const canDelete = user && CAN_DELETE.includes(user.role);

  const load = useCallback(() => {
    setLoading(true);
    facultyApi.getAll()
      .then((res) => setFaculty(res.data || []))
      .catch(() => setFaculty([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleOpenCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setShowModal(true); };
  const handleOpenEdit = (f) => {
    setForm({ fullName: f.fullName || '', email: f.email || '', mobileNumber: f.mobileNumber || '', password: '', employeeId: f.employeeId || '', certifications: f.certifications || '', maxWeeklyLectures: f.maxWeeklyLectures || '' });
    setEditingId(f.id); setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, maxWeeklyLectures: form.maxWeeklyLectures ? parseInt(form.maxWeeklyLectures) : null };
      if (editingId) await facultyApi.update(editingId, payload);
      else await facultyApi.create(payload);
      setShowModal(false); load();
    } catch (err) { alert('Failed to save: ' + (err.response?.data?.message || err.message)); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this faculty member?')) return;
    try { await facultyApi.delete(id); load(); }
    catch (err) { alert('Failed to delete: ' + (err.response?.data?.message || err.message)); }
  };

  const columns = [
    { key: 'fullName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'mobileNumber', label: 'Mobile' },
    { key: 'employeeId', label: 'Employee ID' },
    { key: 'certifications', label: 'Certifications' },
    { key: 'maxWeeklyLectures', label: 'Max Lectures/Week' },
  ];

  return (
    <div>
      <PageHeader
        title="Faculty"
        subtitle="Manage faculty members and assignments"
        action={canManage && (
          <button onClick={handleOpenCreate} className="inline-flex items-center gap-2 rounded-lg gradient-bg-hover px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] focus-ring shadow-glow">
            <Plus className="w-4 h-4" /> Add Faculty
          </button>
        )}
      />

      <div className="rounded-xl overflow-hidden theme-card animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-bottom-divider">
                {columns.map((col) => <th key={col.key} className="px-4 py-3.5 text-left font-semibold theme-text-muted text-xs uppercase tracking-wider bg-sidebar-hover">{col.label}</th>)}
                {canManage && <th className="px-4 py-3.5 text-right font-semibold theme-text-muted text-xs uppercase tracking-wider bg-sidebar-hover">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={canManage ? columns.length + 1 : columns.length} className="px-4 py-8"><LoadingText /></td></tr>
              ) : faculty.length === 0 ? (
                <tr><td colSpan={canManage ? columns.length + 1 : columns.length} className="px-4 py-8 text-center theme-text-muted">No faculty found.</td></tr>
              ) : (
                faculty.map((f) => (
                  <tr key={f.id} className="theme-table-row border-bottom-divider">
                    {columns.map((col) => <td key={col.key} className={col.key === 'fullName' ? 'px-4 py-3.5 font-medium theme-text' : 'px-4 py-3.5 theme-text-muted'}>{f[col.key] || '—'}</td>)}
                    {canManage && (
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleOpenEdit(f)} className="p-1.5 rounded-lg theme-text-faint hover:theme-accent transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          {canDelete && (
                            <button onClick={() => handleDelete(f.id)} className="p-1.5 rounded-lg theme-text-faint hover-danger transition-colors" title="Delete">
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
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Faculty' : 'Add Faculty'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Full Name">
              <input type="text" autoComplete="off" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="e.g. John Doe" className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" />
            </FormField>
            <FormField label="Employee ID">
              <input type="text" autoComplete="off" required value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} placeholder="e.g. EMP-001" className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" />
            </FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Email">
              <input type="email" autoComplete="off" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="faculty@school.com" className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" />
            </FormField>
            <FormField label="Mobile Number">
              <input type="tel" autoComplete="off" value={form.mobileNumber} onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })} placeholder="e.g. +91 98765 43210" className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" />
            </FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label={editingId ? 'Password (leave blank to keep current)' : 'Password (optional)'}>
              <input type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editingId ? '••••••••' : 'Auto-generated if blank'} className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" />
            </FormField>
            <FormField label="Certifications">
              <input type="text" autoComplete="off" value={form.certifications} onChange={(e) => setForm({ ...form, certifications: e.target.value })} placeholder="e.g. B.Ed, M.Sc" className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" />
            </FormField>
          </div>
          <FormField label="Max Weekly Lectures">
            <input type="number" autoComplete="off" value={form.maxWeeklyLectures} onChange={(e) => setForm({ ...form, maxWeeklyLectures: e.target.value })} placeholder="e.g. 25" className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" />
          </FormField>
          <FormActions onSubmit={handleSave} onCancel={() => setShowModal(false)} submitLabel={editingId ? 'Update' : 'Create'} submitting={saving} />
        </form>
      </Modal>
    </div>
  );
}
