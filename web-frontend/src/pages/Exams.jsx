import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { examApi } from '../api/exam';
import { academicApi } from '../api/academic';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { ClipboardList, Award, FileText, TrendingUp, Plus, Trash2, Calendar } from 'lucide-react';

const CAN_MANAGE = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'];
const CAN_DELETE = ['SUPER_ADMIN'];
const CAN_ENTER_RESULTS = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'SUPERVISOR', 'FACULTY'];

const TABS = [
  { key: 'exams', label: 'Exams' },
  { key: 'schedule', label: 'Exam Schedule' },
  { key: 'grading', label: 'Grading Schemes' },
  { key: 'results', label: 'Results' },
  { key: 'reportCards', label: 'Report Cards' },
];

export default function Exams() {
  const { user } = useAuth();
  const isParent = user?.role === 'PARENT';
  const [activeTab, setActiveTab] = useState('exams');
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const canManage = CAN_MANAGE.includes(user?.role);
  const canDelete = CAN_DELETE.includes(user?.role);
  const canEnterResults = CAN_ENTER_RESULTS.includes(user?.role);

  useEffect(() => {
    academicApi.getAllBatches().then((res) => {
      setBatches(res.data || []);
      const active = (res.data || []).find((b) => b.isActive);
      if (active) setSelectedBatch(active.id);
    }).catch(() => setBatches([]));
  }, []);

  const loadData = useCallback(() => {
    if (!selectedBatch) { setData([]); setLoading(false); return; }
    setLoading(true);
    let promise;
    if (activeTab === 'exams') promise = examApi.getByBatch(selectedBatch);
    else if (activeTab === 'schedule') {
      if (!selectedBatch) { setData([]); setLoading(false); return; }
      promise = examApi.getByBatch(selectedBatch).then(async (examRes) => {
        const exams = examRes.data || [];
        const allPortions = [];
        for (const exam of exams) {
          try {
            const pRes = await examApi.getPortions(exam.id);
            allPortions.push(...(pRes.data || []));
          } catch {}
        }
        return { data: allPortions };
      });
    }
    else if (activeTab === 'grading') promise = examApi.getAllGradingSchemes();
    else if (activeTab === 'reportCards') promise = examApi.getReportCardsByBatch(selectedBatch);
    else { setData([]); setLoading(false); return; }
    promise.then((res) => setData(res.data || [])).catch(() => setData([])).finally(() => setLoading(false));
  }, [activeTab, selectedBatch]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleOpenCreate = () => {
    if (activeTab === 'exams') setForm({ batchId: selectedBatch, divisionId: '', name: '', examType: 'UNIT', examDate: '' });
    else if (activeTab === 'schedule') setForm({ examId: '', subjectId: '', portions: '', maxMarks: '100', examDate: '' });
    else if (activeTab === 'grading') setForm({ name: '', gradeLabel: '', minPercentage: '', maxPercentage: '' });
    else if (activeTab === 'results') setForm({ examId: '', studentId: '', subjectId: '', marksObtained: '', maxMarks: '100', uploadedByUserId: user?.id || '' });
    else if (activeTab === 'reportCards') setForm({ studentId: '', batchId: selectedBatch, fileUrl: '' });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (activeTab === 'exams') await examApi.create({ ...form, divisionId: form.divisionId ? parseInt(form.divisionId) : null });
      else if (activeTab === 'schedule') await examApi.setPortion({ ...form, examId: parseInt(form.examId), subjectId: parseInt(form.subjectId), maxMarks: parseFloat(form.maxMarks) || 100 });
      else if (activeTab === 'grading') await examApi.createGradingScheme({ ...form, minPercentage: parseFloat(form.minPercentage), maxPercentage: parseFloat(form.maxPercentage) });
      else if (activeTab === 'results') await examApi.enterResult({ ...form, examId: parseInt(form.examId), studentId: parseInt(form.studentId), subjectId: form.subjectId ? parseInt(form.subjectId) : null, marksObtained: parseFloat(form.marksObtained), maxMarks: parseFloat(form.maxMarks) || 100 });
      else if (activeTab === 'reportCards') await examApi.generateReportCard({ ...form, studentId: parseInt(form.studentId), fileUrl: form.fileUrl || 'pending' });
      setShowModal(false);
      loadData();
    } catch (err) { alert('Failed: ' + (err.response?.data?.message || err.message)); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item? It will be marked inactive.')) return;
    try {
      if (activeTab === 'exams') await examApi.delete(id);
      else if (activeTab === 'grading') await examApi.deleteGradingScheme(id);
      loadData();
    } catch (err) { alert('Failed to delete: ' + (err.response?.data?.message || err.message)); }
  };

  const columns = {
    exams: [
      { key: 'name', label: 'Exam Name' },
      { key: 'examType', label: 'Type' },
      { key: 'examDate', label: 'Date' },
    ],
    schedule: [
      { key: 'examId', label: 'Exam ID' },
      { key: 'subjectId', label: 'Subject ID' },
      { key: 'examDate', label: 'Date' },
      { key: 'maxMarks', label: 'Max Marks' },
      { key: 'portions', label: 'Portions' },
    ],
    grading: [
      { key: 'name', label: 'Scheme Name' },
      { key: 'gradeLabel', label: 'Grade' },
      { key: 'minPercentage', label: 'Min %' },
      { key: 'maxPercentage', label: 'Max %' },
    ],
    results: [
      { key: 'id', label: 'ID' },
      { key: 'examName', label: 'Exam' },
      { key: 'studentName', label: 'Student' },
      { key: 'marksObtained', label: 'Marks' },
    ],
    reportCards: [
      { key: 'id', label: 'ID' },
      { key: 'studentName', label: 'Student' },
      { key: 'status', label: 'Status' },
      { key: 'generatedAt', label: 'Generated' },
    ],
  };

  const cards = [
    { label: 'Exams', value: activeTab === 'exams' ? data.length : '—', icon: ClipboardList, color: 'bg-red-500' },
    { label: 'Schedule', value: activeTab === 'schedule' ? data.length : '—', icon: Calendar, color: 'bg-orange-500' },
    { label: 'Grading Schemes', value: activeTab === 'grading' ? data.length : '—', icon: Award, color: 'bg-purple-500' },
    { label: 'Results', value: activeTab === 'results' ? data.length : '—', icon: TrendingUp, color: 'bg-green-500' },
  ];

  if (isParent) {
    return (
      <div>
        <PageHeader title="Exams" subtitle="Exam scheduling, results, grading, and report cards" />
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">You can view your child's exam results on the <strong>My Child</strong> page.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Exams" subtitle="Exam scheduling, results, grading, and report cards" />

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
        <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Select Batch</option>
          {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        {canManage && activeTab !== 'results' && activeTab !== 'reportCards' && (
          <button onClick={handleOpenCreate} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" /> Add {TABS.find((t) => t.key === activeTab)?.label.slice(0, -1)}
          </button>
        )}
        {canManage && activeTab === 'reportCards' && (
          <button onClick={handleOpenCreate} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" /> Generate Report Card
          </button>
        )}
        {canEnterResults && activeTab === 'results' && (
          <button onClick={handleOpenCreate} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" /> Enter Result
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500 bg-gray-50">
              {columns[activeTab].map((col) => <th key={col.key} className="px-4 py-3 font-medium">{col.label}</th>)}
              {canDelete && (activeTab === 'exams' || activeTab === 'grading') && <th className="px-4 py-3 font-medium text-right">Actions</th>}
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
                  {canDelete && (activeTab === 'exams' || activeTab === 'grading') && (
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
          {activeTab === 'exams' && (
            <>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Exam Name</label><input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Exam Type</label><select required value={form.examType} onChange={(e) => setForm({ ...form, examType: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"><option value="UNIT">Unit</option><option value="TERMINAL">Terminal</option></select></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Exam Date</label><input type="date" required value={form.examDate} onChange={(e) => setForm({ ...form, examDate: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Division ID (optional)</label><input type="number" value={form.divisionId} onChange={(e) => setForm({ ...form, divisionId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            </>
          )}
          {activeTab === 'schedule' && (
            <>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Exam ID</label><input type="number" required value={form.examId} onChange={(e) => setForm({ ...form, examId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Subject ID</label><input type="number" required value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Exam Date</label><input type="date" value={form.examDate} onChange={(e) => setForm({ ...form, examDate: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Max Marks</label><input type="number" step="0.01" required value={form.maxMarks} onChange={(e) => setForm({ ...form, maxMarks: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Portions / Syllabus</label><textarea value={form.portions} onChange={(e) => setForm({ ...form, portions: e.target.value })} rows={3} placeholder="e.g. Chapters 1-5, Algebra, etc." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            </>
          )}
          {activeTab === 'grading' && (
            <>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Scheme Name</label><input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Grade Label</label><input type="text" required placeholder="e.g. A, B, C" value={form.gradeLabel} onChange={(e) => setForm({ ...form, gradeLabel: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Min Percentage</label><input type="number" step="0.01" required value={form.minPercentage} onChange={(e) => setForm({ ...form, minPercentage: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Max Percentage</label><input type="number" step="0.01" required value={form.maxPercentage} onChange={(e) => setForm({ ...form, maxPercentage: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            </>
          )}
          {activeTab === 'results' && (
            <>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Exam ID</label><input type="number" required value={form.examId} onChange={(e) => setForm({ ...form, examId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Student ID</label><input type="number" required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Subject ID</label><input type="number" value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Marks Obtained</label><input type="number" step="0.01" required value={form.marksObtained} onChange={(e) => setForm({ ...form, marksObtained: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Max Marks</label><input type="number" step="0.01" required value={form.maxMarks} onChange={(e) => setForm({ ...form, maxMarks: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            </>
          )}
          {activeTab === 'reportCards' && (
            <>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Student ID</label><input type="number" required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">File URL</label><input type="text" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} placeholder="Will be generated" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
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
