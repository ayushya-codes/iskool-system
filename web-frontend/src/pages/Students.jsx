import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentApi } from '../api/student';
import { academicApi } from '../api/academic';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';

const CAN_CREATE = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'CLERK'];
const CAN_DELETE = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'];

const EMPTY_FORM = {
  firstName: '', lastName: '', dateOfBirth: '', gender: '', avatarUrl: '', admissionDate: '', parentEmail: '',
};

export default function Students() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const canCreate = user && CAN_CREATE.includes(user.role);
  const canDelete = user && CAN_DELETE.includes(user.role);

  const loadStudents = useCallback(() => {
    setLoading(true);
    const params = {};
    if (selectedBatch) params.batchId = selectedBatch;
    if (selectedClass) params.classId = selectedClass;
    if (selectedDivision) params.divisionId = selectedDivision;
    studentApi.getAll(params)
      .then((res) => setStudents(res.data || []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, [selectedBatch, selectedClass, selectedDivision]);

  useEffect(() => {
    Promise.all([
      academicApi.getAllBatches().catch(() => ({ data: [] })),
      academicApi.getAllClasses().catch(() => ({ data: [] })),
    ]).then(([batchRes, classRes]) => {
      setBatches(batchRes.data || []);
      setClasses(classRes.data || []);
    });
  }, []);

  useEffect(() => {
    if (!selectedClass) { setDivisions([]); return; }
    academicApi.getDivisionsByClass(selectedClass)
      .then((res) => setDivisions(res.data || []))
      .catch(() => setDivisions([]));
  }, [selectedClass]);

  useEffect(() => { loadStudents(); }, [loadStudents]);

  const handleOpenCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true);
  };

  const handleOpenEdit = (student) => {
    setForm({
      firstName: student.firstName || '', lastName: student.lastName || '',
      dateOfBirth: student.dateOfBirth || '', gender: student.gender || '',
      avatarUrl: student.avatarUrl || '', admissionDate: student.admissionDate || '',
      parentEmail: '',
    });
    setEditingId(student.id);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await studentApi.update(editingId, form);
      } else {
        await studentApi.create(form);
      }
      setShowModal(false);
      loadStudents();
    } catch (err) {
      alert('Failed to save student: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this student? This will mark the student as inactive.')) return;
    try {
      await studentApi.delete(id);
      loadStudents();
    } catch (err) {
      alert('Failed to delete student: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle="View and manage student records"
        action={canCreate && (
          <button onClick={handleOpenCreate} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        )}
      />

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Academic Batch</label>
            <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">All Batches</option>
              {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Class</label>
            <select value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setSelectedDivision(''); }} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">All Classes</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Division</label>
            <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)} disabled={!selectedClass} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-400">
              <option value="">All Divisions</option>
              {divisions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500 bg-gray-50">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Date of Birth</th>
              <th className="px-4 py-3 font-medium">Gender</th>
              <th className="px-4 py-3 font-medium">Admission Date</th>
              {canCreate && <th className="px-4 py-3 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={canCreate ? 5 : 4} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan={canCreate ? 5 : 4} className="px-4 py-6 text-center text-gray-400">No students found matching the selected filters.</td></tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 cursor-pointer" onClick={() => navigate(`/students/${student.id}`)}>
                    {`${student.firstName || ''} ${student.lastName || ''}`.trim()}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{student.dateOfBirth || '—'}</td>
                  <td className="px-4 py-3 text-gray-700">{student.gender || '—'}</td>
                  <td className="px-4 py-3 text-gray-700">{student.admissionDate || '—'}</td>
                  {canCreate && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => navigate(`/students/${student.id}`)} className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleOpenEdit(student)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        {canDelete && (
                          <button onClick={() => handleDelete(student.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
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

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Student' : 'Add Student'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">First Name</label>
              <input type="text" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Last Name</label>
              <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Date of Birth</label>
              <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Gender</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Admission Date</label>
              <input type="date" value={form.admissionDate} onChange={(e) => setForm({ ...form, admissionDate: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Parent Email</label>
              <input type="email" value={form.parentEmail} onChange={(e) => setForm({ ...form, parentEmail: e.target.value })} placeholder="parent@example.com" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Avatar URL</label>
            <input type="text" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} placeholder="https://..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
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
