import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { facultyApi } from '../api/faculty';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const CAN_MANAGE = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'];
const CAN_DELETE = ['SUPER_ADMIN'];

const EMPTY_FORM = { userId: '', employeeId: '', certifications: '', maxWeeklyLectures: '' };

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
    setForm({ userId: f.userId || '', employeeId: f.employeeId || '', certifications: f.certifications || '', maxWeeklyLectures: f.maxWeeklyLectures || '' });
    setEditingId(f.id); setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, userId: form.userId ? parseInt(form.userId) : null, maxWeeklyLectures: form.maxWeeklyLectures ? parseInt(form.maxWeeklyLectures) : null };
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
          <button onClick={handleOpenCreate} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" /> Add Faculty
          </button>
        )}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500 bg-gray-50">
              {columns.map((col) => <th key={col.key} className="px-4 py-3 font-medium">{col.label}</th>)}
              {canManage && <th className="px-4 py-3 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={canManage ? columns.length + 1 : columns.length} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>
            ) : faculty.length === 0 ? (
              <tr><td colSpan={canManage ? columns.length + 1 : columns.length} className="px-4 py-6 text-center text-gray-400">No faculty found.</td></tr>
            ) : (
              faculty.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => <td key={col.key} className="px-4 py-3 text-gray-700">{f[col.key] || '—'}</td>)}
                  {canManage && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleOpenEdit(f)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        {canDelete && (
                          <button onClick={() => handleDelete(f.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
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

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Faculty' : 'Add Faculty'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">User ID (linked user account)</label>
            <input type="number" value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} placeholder="User ID" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Employee ID</label>
            <input type="text" required value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Certifications</label>
            <input type="text" value={form.certifications} onChange={(e) => setForm({ ...form, certifications: e.target.value })} placeholder="e.g. B.Ed, M.Sc" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Max Weekly Lectures</label>
            <input type="number" value={form.maxWeeklyLectures} onChange={(e) => setForm({ ...form, maxWeeklyLectures: e.target.value })} placeholder="e.g. 25" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
