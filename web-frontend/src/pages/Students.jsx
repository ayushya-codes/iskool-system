import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import PageHeader from '../components/PageHeader';

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

  // Load filter options
  useEffect(() => {
    Promise.all([
      api.get('/academic/batches').catch(() => ({ data: [] })),
      api.get('/academic/classes').catch(() => ({ data: [] })),
    ]).then(([batchRes, classRes]) => {
      setBatches(batchRes.data || []);
      setClasses(classRes.data || []);
    });
  }, []);

  // Load divisions when class changes
  useEffect(() => {
    if (!selectedClass) {
      setDivisions([]);
      return;
    }
    api.get(`/academic/divisions/class/${selectedClass}`)
      .then((res) => setDivisions(res.data || []))
      .catch(() => setDivisions([]));
  }, [selectedClass]);

  // Load students with filters
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedBatch) params.append('batchId', selectedBatch);
    if (selectedClass) params.append('classId', selectedClass);
    if (selectedDivision) params.append('divisionId', selectedDivision);

    const url = params.toString() ? `/students?${params.toString()}` : '/students';
    api.get(url)
      .then((res) => setStudents(res.data || []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, [selectedBatch, selectedClass, selectedDivision]);

  const handleRowClick = (student) => {
    navigate(`/students/${student.id}`);
  };

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'PRINCIPAL';

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle="View and manage student records"
        action={
          isAdmin ? (
            <button
              onClick={() => alert('Add Student modal would open here')}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Add Student
            </button>
          ) : null
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Academic Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => {
                setSelectedBatch(e.target.value);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Batches</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedDivision('');
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Division</label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              disabled={!selectedClass}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">All Divisions</option>
              {divisions.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500 bg-gray-50">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Date of Birth</th>
              <th className="px-4 py-3 font-medium">Gender</th>
              <th className="px-4 py-3 font-medium">Admission Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">No students found matching the selected filters.</td></tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.id}
                  onClick={() => handleRowClick(student)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {`${student.firstName || ''} ${student.lastName || ''}`.trim()}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{student.dateOfBirth || '—'}</td>
                  <td className="px-4 py-3 text-gray-700">{student.gender || '—'}</td>
                  <td className="px-4 py-3 text-gray-700">{student.admissionDate || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
