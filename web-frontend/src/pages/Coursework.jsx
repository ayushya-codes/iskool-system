import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { courseworkApi } from '../api/coursework';
import { academicApi } from '../api/academic';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { BookOpen, Calendar, ClipboardList, FileText, Plus, Trash2, Wand2 } from 'lucide-react';

const CAN_MANAGE = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'SUPERVISOR', 'FACULTY'];
const CAN_DELETE = ['SUPER_ADMIN', 'PRINCIPAL'];

const TABS = [
  { key: 'assignments', label: 'Assignments' },
  { key: 'syllabus', label: 'Syllabus Logs' },
  { key: 'rooms', label: 'Rooms' },
  { key: 'timetables', label: 'Timetables' },
];

export default function Coursework() {
  const { user } = useAuth();
  const isParent = user?.role === 'PARENT';
  const [activeTab, setActiveTab] = useState('assignments');
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const canManage = CAN_MANAGE.includes(user?.role);
  const canDelete = CAN_DELETE.includes(user?.role);

  useEffect(() => {
    academicApi.getAllClasses().then((res) => setClasses(res.data || [])).catch(() => setClasses([]));
    academicApi.getAllSubjects().then((res) => setSubjects(res.data || [])).catch(() => setSubjects([]));
  }, []);

  useEffect(() => {
    if (!selectedClass) { setDivisions([]); return; }
    academicApi.getDivisionsByClass(selectedClass)
      .then((res) => setDivisions(res.data || []))
      .catch(() => setDivisions([]));
  }, [selectedClass]);

  const loadData = useCallback(() => {
    if (activeTab === 'rooms') {
      setLoading(true);
      courseworkApi.getAllRooms()
        .then((res) => setData(res.data || []))
        .catch(() => setData([]))
        .finally(() => setLoading(false));
      return;
    }
    if (!selectedDivision) { setData([]); setLoading(false); return; }
    setLoading(true);
    let promise;
    if (activeTab === 'assignments') promise = courseworkApi.getAssignmentsByDivision(selectedDivision);
    else if (activeTab === 'syllabus') {
      if (!selectedDivision || !selectedSubject) { setData([]); setLoading(false); return; }
      promise = courseworkApi.getSyllabusLogs(selectedDivision, selectedSubject);
    }
    else if (activeTab === 'timetables') {
      promise = academicApi.getAllBatches().then(async (batchRes) => {
        const activeBatch = (batchRes.data || []).find((b) => b.isActive);
        if (!activeBatch) return { data: [] };
        return courseworkApi.getTimetablesByBatch(activeBatch.id);
      });
    }
    promise.then((res) => setData(res.data || [])).catch(() => setData([])).finally(() => setLoading(false));
  }, [activeTab, selectedDivision, selectedSubject]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleOpenCreate = () => {
    if (activeTab === 'assignments') setForm({ divisionId: selectedDivision, subjectId: '', title: '', description: '', dueDate: '', createdByFacultyId: user?.id || '' });
    else if (activeTab === 'syllabus') setForm({ divisionId: selectedDivision, subjectId: '', content: '', date: new Date().toISOString().split('T')[0], loggedByFacultyId: user?.id || '' });
    else if (activeTab === 'rooms') setForm({ name: '', capacity: '', building: '', floor: '' });
    else if (activeTab === 'timetables') setForm({ batchId: '', divisionId: selectedDivision, effectiveDate: new Date().toISOString().split('T')[0] });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (activeTab === 'assignments') await courseworkApi.createAssignment({ ...form, subjectId: parseInt(form.subjectId) });
      else if (activeTab === 'syllabus') await courseworkApi.createSyllabusLog({ ...form, subjectId: parseInt(form.subjectId) });
      else if (activeTab === 'rooms') await courseworkApi.createRoom({ ...form, capacity: form.capacity ? parseInt(form.capacity) : null });
      else if (activeTab === 'timetables') await courseworkApi.createTimetable({ ...form, batchId: parseInt(form.batchId) });
      setShowModal(false);
      loadData();
    } catch (err) { alert('Failed: ' + (err.response?.data?.message || err.message)); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      if (activeTab === 'assignments') await courseworkApi.deleteAssignment(id);
      // syllabus delete not supported by backend; skip
      else if (activeTab === 'rooms') await courseworkApi.deleteRoom(id);
      loadData();
    } catch (err) { alert('Failed to delete: ' + (err.response?.data?.message || err.message)); }
  };

  const columns = {
    assignments: [
      { key: 'title', label: 'Title' },
      { key: 'dueDate', label: 'Due Date' },
      { key: 'subjectId', label: 'Subject ID' },
    ],
    syllabus: [
      { key: 'content', label: 'Content' },
      { key: 'date', label: 'Date' },
      { key: 'subjectId', label: 'Subject ID' },
    ],
    rooms: [
      { key: 'name', label: 'Room' },
      { key: 'capacity', label: 'Capacity' },
      { key: 'building', label: 'Building' },
      { key: 'floor', label: 'Floor' },
    ],
    timetables: [
      { key: 'id', label: 'ID' },
      { key: 'effectiveDate', label: 'Effective Date' },
      { key: 'status', label: 'Status' },
    ],
  };

  const cards = [
    { label: 'Assignments', value: activeTab === 'assignments' ? data.length : '—', icon: ClipboardList, color: 'bg-purple-500' },
    { label: 'Syllabus Logs', value: activeTab === 'syllabus' ? data.length : '—', icon: FileText, color: 'bg-green-500' },
    { label: 'Rooms', value: activeTab === 'rooms' ? data.length : '—', icon: BookOpen, color: 'bg-indigo-500' },
    { label: 'Timetables', value: activeTab === 'timetables' ? data.length : '—', icon: Calendar, color: 'bg-blue-500' },
  ];

  if (isParent) {
    return (
      <div>
        <PageHeader title="Coursework" subtitle="Timetables, syllabus, assignments, and submissions" />
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Coursework information for your child is available on the <strong>My Child</strong> page.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Coursework" subtitle="Timetables, syllabus, assignments, and submissions" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1 mb-4 bg-white rounded-xl border border-gray-200 p-1">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.key ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        {activeTab !== 'rooms' && (
          <div className="flex items-center gap-2">
            <select value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setSelectedDivision(''); }} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select Class</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)} disabled={!selectedClass} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100">
              <option value="">Select Division</option>
              {divisions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            {activeTab === 'syllabus' && (
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} disabled={!selectedDivision} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100">
                <option value="">Select Subject</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            )}
          </div>
        )}
        {canManage && (
          <div className="flex items-center gap-2">
            {activeTab === 'timetables' && (
              <button onClick={() => alert('Auto-generate timetable functionality coming soon!')} className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors">
                <Wand2 className="w-4 h-4" /> Auto-Generate
              </button>
            )}
            <button onClick={handleOpenCreate} disabled={activeTab !== 'rooms' && !selectedDivision} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50">
              <Plus className="w-4 h-4" /> Add {TABS.find((t) => t.key === activeTab)?.label.slice(0, -1)}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500 bg-gray-50">
              {columns[activeTab].map((col) => <th key={col.key} className="px-4 py-3 font-medium">{col.label}</th>)}
              {canDelete && <th className="px-4 py-3 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={columns[activeTab].length + 1} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={columns[activeTab].length + 1} className="px-4 py-6 text-center text-gray-400">No {activeTab} found.</td></tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {columns[activeTab].map((col) => <td key={col.key} className="px-4 py-3 text-gray-700">{row[col.key] || '—'}</td>)}
                  {canDelete && (
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(row.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={`Add ${TABS.find((t) => t.key === activeTab)?.label.slice(0, -1)}`}>
        <form onSubmit={handleSave} className="space-y-4">
          {activeTab === 'assignments' && (
            <>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Title</label><input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Due Date</label><input type="date" required value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Subject</label>
                {subjects.length === 0 ? (
                  <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">No subjects available. Please create subjects first in the Academic section.</p>
                ) : (
                  <select required value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select Subject</option>
                    {subjects.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                  </select>
                )}
              </div>
            </>
          )}
          {activeTab === 'syllabus' && (
            <>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Content / Topic Covered</label><input type="text" required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Date</label><input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Subject</label>
                {subjects.length === 0 ? (
                  <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">No subjects available. Please create subjects first in the Academic section.</p>
                ) : (
                  <select required value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select Subject</option>
                    {subjects.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                  </select>
                )}
              </div>
            </>
          )}
          {activeTab === 'rooms' && (
            <>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Room Name</label><input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Capacity</label><input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Floor</label><input type="text" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              </div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Building</label><input type="text" value={form.building} onChange={(e) => setForm({ ...form, building: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            </>
          )}
          {activeTab === 'timetables' && (
            <>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Batch ID</label><input type="number" required value={form.batchId} onChange={(e) => setForm({ ...form, batchId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Effective Date</label><input type="date" required value={form.effectiveDate} onChange={(e) => setForm({ ...form, effectiveDate: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            </>
          )}
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">{saving ? 'Saving...' : 'Create'}</button>
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
