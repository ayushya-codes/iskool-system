import { useState, useEffect, useCallback } from 'react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { academicApi } from '../api/academic';
import { almanacApi } from '../api/almanac';
import { studentApi } from '../api/student';
import { BookMarked, BookOpen, MessageSquare, Filter } from 'lucide-react';

export default function Almanac() {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [students, setStudents] = useState([]);
  const [remarks, setRemarks] = useState([]);
  const [prayers, setPrayers] = useState([]);

  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  const loadClasses = useCallback(() => {
    academicApi.getAllClasses().then((res) => setClasses(res.data)).catch(() => setClasses([]));
  }, []);

  const loadPrayers = useCallback(() => {
    almanacApi.getAllPrayers().then((res) => setPrayers(res.data)).catch(() => setPrayers([]));
  }, []);

  useEffect(() => {
    loadClasses();
    loadPrayers();
    academicApi.getAllBatches().then((res) => {
      setBatches(res.data);
      const active = res.data.find((b) => b.isActive);
      if (active) setSelectedBatch(active.id);
    }).catch(() => setBatches([]));
  }, [loadClasses, loadPrayers]);

  useEffect(() => {
    if (selectedClass) {
      academicApi.getDivisionsByClass(selectedClass).then((res) => setDivisions(res.data)).catch(() => setDivisions([]));
      setSelectedDivision('');
    } else {
      setDivisions([]);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedDivision && selectedBatch) {
      studentApi.getAll({ batchId: selectedBatch, divisionId: selectedDivision })
        .then((res) => setStudents(res.data))
        .catch(() => setStudents([]));
    } else {
      setStudents([]);
    }
  }, [selectedDivision, selectedBatch]);

  useEffect(() => {
    if (selectedStudent) {
      almanacApi.getRemarksByStudent(selectedStudent).then((res) => setRemarks(res.data)).catch(() => setRemarks([]));
    } else {
      setRemarks([]);
    }
  }, [selectedStudent]);

  return (
    <div>
      <PageHeader title="Almanac" subtitle="Student almanac remarks and prayers" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl p-4 flex items-center gap-3 theme-card">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs theme-text-muted">Remarks</p>
            <p className="text-xl font-bold theme-text">{remarks.length}</p>
          </div>
        </div>
        <div className="rounded-xl p-4 flex items-center gap-3 theme-card">
          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs theme-text-muted">Prayers</p>
            <p className="text-xl font-bold theme-text">{prayers.length}</p>
          </div>
        </div>
        <div className="rounded-xl p-4 flex items-center gap-3 theme-card">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
            <BookMarked className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs theme-text-muted">Filtered Students</p>
            <p className="text-xl font-bold theme-text">{students.length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl p-5 mb-6 theme-card">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 theme-text-muted" />
          <h2 className="text-sm font-semibold theme-text">Filters</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium theme-text-muted mb-1">Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm theme-input"
            >
              <option value="">All Batches</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium theme-text-muted mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm theme-input"
            >
              <option value="">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium theme-text-muted mb-1">Division</label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              disabled={!selectedClass}
              className="w-full rounded-lg px-3 py-2 text-sm theme-input disabled:opacity-50"
            >
              <option value="">All Divisions</option>
              {divisions.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium theme-text-muted mb-1">Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              disabled={!selectedDivision}
              className="w-full rounded-lg px-3 py-2 text-sm theme-input disabled:opacity-50"
            >
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Remarks Section */}
      <div className="rounded-xl p-6 mb-6 theme-card">
        <h2 className="text-lg font-semibold theme-text mb-4">Remarks</h2>
        {!selectedStudent ? (
          <p className="text-sm theme-text-muted py-4 text-center">Select a student to view their remarks.</p>
        ) : remarks.length === 0 ? (
          <p className="text-sm theme-text-muted py-4 text-center">No remarks found for this student.</p>
        ) : (
          <div className="space-y-3">
            {remarks.map((r) => (
              <div key={r.id} className="p-4 rounded-lg" style={{ border: '1px solid color-mix(in srgb, var(--text-muted) 15%, transparent)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium theme-text">{r.remarkType || 'General'}</span>
                  <span className="text-xs theme-text-muted">{r.date || r.createdAt}</span>
                </div>
                <p className="text-sm theme-text-muted">{r.content || r.remark}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prayers Section */}
      <div className="rounded-xl p-6 theme-card">
        <h2 className="text-lg font-semibold theme-text mb-4">Prayers</h2>
        {prayers.length === 0 ? (
          <p className="text-sm theme-text-muted py-4 text-center">No prayers configured.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prayers.map((p) => (
              <div key={p.id} className="p-4 rounded-lg" style={{ border: '1px solid color-mix(in srgb, var(--text-muted) 15%, transparent)' }}>
                <p className="text-sm font-medium theme-text mb-1">{p.title || 'Prayer'}</p>
                <p className="text-xs theme-text-muted line-clamp-2">{p.content || p.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
