import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentApi } from '../api/student';
import { academicApi } from '../api/academic';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { FormField, FormActions, FilterBar, FilterSelect, LoadingText } from '../components/ui';

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
          <button onClick={handleOpenCreate} className="inline-flex items-center gap-2 rounded-lg gradient-bg-hover px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] focus-ring shadow-glow">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        )}
      />

      <FilterBar>
        <FilterSelect label="Academic Batch" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
          <option value="">All Batches</option>
          {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </FilterSelect>
        <FilterSelect label="Class" value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setSelectedDivision(''); }}>
          <option value="">All Classes</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </FilterSelect>
        <FilterSelect label="Division" value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)} disabled={!selectedClass}>
          <option value="">All Divisions</option>
          {divisions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </FilterSelect>
      </FilterBar>

      <div className="rounded-xl overflow-hidden theme-card animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-bottom-divider">
                <th className="px-4 py-3.5 text-left font-semibold theme-text-muted text-xs uppercase tracking-wider bg-sidebar-hover">Name</th>
                <th className="px-4 py-3.5 text-left font-semibold theme-text-muted text-xs uppercase tracking-wider bg-sidebar-hover">Date of Birth</th>
                <th className="px-4 py-3.5 text-left font-semibold theme-text-muted text-xs uppercase tracking-wider bg-sidebar-hover">Gender</th>
                <th className="px-4 py-3.5 text-left font-semibold theme-text-muted text-xs uppercase tracking-wider bg-sidebar-hover">Admission Date</th>
                {canCreate && <th className="px-4 py-3.5 text-right font-semibold theme-text-muted text-xs uppercase tracking-wider bg-sidebar-hover">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={canCreate ? 5 : 4} className="px-4 py-8"><LoadingText /></td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={canCreate ? 5 : 4} className="px-4 py-8 text-center theme-text-muted">No students found matching the selected filters.</td></tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="theme-table-row border-bottom-divider">
                    <td className="px-4 py-3.5 font-medium theme-text cursor-pointer" onClick={() => navigate(`/students/${student.id}`)}>
                      {`${student.firstName || ''} ${student.lastName || ''}`.trim()}
                    </td>
                    <td className="px-4 py-3.5 theme-text-muted">{student.dateOfBirth || '—'}</td>
                    <td className="px-4 py-3.5 theme-text-muted">{student.gender || '—'}</td>
                    <td className="px-4 py-3.5 theme-text-muted">{student.admissionDate || '—'}</td>
                    {canCreate && (
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => navigate(`/students/${student.id}`)} className="p-1.5 rounded-lg theme-text-faint hover:theme-accent transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleOpenEdit(student)} className="p-1.5 rounded-lg theme-text-faint hover:theme-accent transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          {canDelete && (
                            <button onClick={() => handleDelete(student.id)} className="p-1.5 rounded-lg theme-text-faint hover-danger transition-colors" title="Delete">
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

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Student' : 'Add Student'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First Name">
              <input type="text" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm theme-input" />
            </FormField>
            <FormField label="Last Name">
              <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm theme-input" />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date of Birth">
              <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm theme-input" />
            </FormField>
            <FormField label="Gender">
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm theme-input cursor-pointer">
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Admission Date">
              <input type="date" value={form.admissionDate} onChange={(e) => setForm({ ...form, admissionDate: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm theme-input" />
            </FormField>
            <FormField label="Parent Email">
              <input type="email" value={form.parentEmail} onChange={(e) => setForm({ ...form, parentEmail: e.target.value })} placeholder="parent@example.com" className="w-full rounded-lg px-3 py-2 text-sm theme-input" />
            </FormField>
          </div>
          <FormField label="Avatar URL">
            <input type="text" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} placeholder="https://..." className="w-full rounded-lg px-3 py-2 text-sm theme-input" />
          </FormField>
          <FormActions onSubmit={handleSave} onCancel={() => setShowModal(false)} submitLabel={editingId ? 'Update' : 'Create'} submitting={saving} />
        </form>
      </Modal>
    </div>
  );
}
