import { useEffect, useState, useCallback } from 'react';
import { holidayApi } from '../api/holiday';
import { attendanceApi } from '../api/attendance';
import { academicApi } from '../api/academic';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { CalendarCheck, FileText, UserX, UserCheck, CalendarDays, Plus, Trash2 } from 'lucide-react';

const HOLIDAY_TYPE_COLORS = {
  PUBLIC: 'bg-blue-100 text-blue-700',
  SCHOOL: 'bg-purple-100 text-purple-700',
  RELIGIOUS: 'bg-amber-100 text-amber-700',
  NATIONAL: 'bg-green-100 text-green-700',
  BREAK: 'bg-rose-100 text-rose-700',
};

const CAN_MANAGE_HOLIDAYS = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'SUPERVISOR'];
const CAN_MARK_ATTENDANCE = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'SUPERVISOR', 'FACULTY'];

export default function Attendance() {
  const { user } = useAuth();
  const [holidays, setHolidays] = useState([]);
  const [holidayLoading, setHolidayLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ name: '', holidayDate: '', type: 'SCHOOL', description: '' });

  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [markForm, setMarkForm] = useState({ studentId: '', date: new Date().toISOString().split('T')[0], status: 'PRESENT', remarks: '' });
  const [saving, setSaving] = useState(false);

  const canManage = user && CAN_MANAGE_HOLIDAYS.includes(user.role);
  const canMark = user && CAN_MARK_ATTENDANCE.includes(user.role);

  useEffect(() => {
    holidayApi.getAll()
      .then((res) => setHolidays(res.data))
      .catch(() => setHolidays([]))
      .finally(() => setHolidayLoading(false));

    academicApi.getAllClasses().then((res) => setClasses(res.data || [])).catch(() => setClasses([]));
  }, []);

  useEffect(() => {
    if (!selectedClass) { setDivisions([]); return; }
    academicApi.getDivisionsByClass(selectedClass)
      .then((res) => setDivisions(res.data || []))
      .catch(() => setDivisions([]));
  }, [selectedClass]);

  const loadAttendance = useCallback(() => {
    if (!selectedDivision) { setAttendanceRecords([]); return; }
    setAttendanceLoading(true);
    const today = new Date().toISOString().split('T')[0];
    attendanceApi.getByDivisionAndDate(selectedDivision, today)
      .then((res) => setAttendanceRecords(res.data || []))
      .catch(() => setAttendanceRecords([]))
      .finally(() => setAttendanceLoading(false));
  }, [selectedDivision]);

  useEffect(() => { loadAttendance(); }, [loadAttendance]);

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await attendanceApi.markSingle({ ...markForm, studentId: parseInt(markForm.studentId), markedByUserId: user?.id });
      setShowMarkModal(false);
      setMarkForm({ studentId: '', date: new Date().toISOString().split('T')[0], status: 'PRESENT', remarks: '' });
      loadAttendance();
    } catch (err) { alert('Failed to mark attendance: ' + (err.response?.data?.message || err.message)); }
    finally { setSaving(false); }
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    try {
      const res = await holidayApi.create(newHoliday);
      setHolidays([...holidays, res.data].sort((a, b) => new Date(a.holidayDate) - new Date(b.holidayDate)));
      setNewHoliday({ name: '', holidayDate: '', type: 'SCHOOL', description: '' });
      setShowAddForm(false);
    } catch (err) {
      alert('Failed to add holiday');
    }
  };

  const handleDeleteHoliday = async (id) => {
    try {
      await holidayApi.delete(id);
      setHolidays(holidays.filter((h) => h.id !== id));
    } catch (err) {
      alert('Failed to delete holiday');
    }
  };

  const presentCount = attendanceRecords.filter(r => r.status === 'PRESENT').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'ABSENT').length;
  const onLeaveCount = attendanceRecords.filter(r => r.status === 'ON_LEAVE').length;
  const attendanceRate = attendanceRecords.length > 0 ? Math.round((presentCount / attendanceRecords.length) * 100) + '%' : '—';

  const cards = [
    { label: 'Present Today', value: presentCount, icon: UserCheck, color: 'bg-green-500' },
    { label: 'Absent Today', value: absentCount, icon: UserX, color: 'bg-red-500' },
    { label: 'On Leave', value: onLeaveCount, icon: FileText, color: 'bg-amber-500' },
    { label: 'Attendance Rate', value: attendanceRate, icon: CalendarCheck, color: 'bg-blue-500' },
  ];

  return (
    <div>
      <PageHeader title="Attendance" subtitle="Track and manage student attendance" />
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

      {/* Holiday Calendar Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-gray-500" />
            Holiday Calendar
          </h2>
          {canManage && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Holiday
            </button>
          )}
        </div>

        {showAddForm && canManage && (
          <form onSubmit={handleAddHoliday} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              <input
                type="text"
                placeholder="Holiday Name"
                value={newHoliday.name}
                onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={newHoliday.holidayDate}
                onChange={(e) => setNewHoliday({ ...newHoliday, holidayDate: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newHoliday.type}
                onChange={(e) => setNewHoliday({ ...newHoliday, type: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="SCHOOL">School</option>
                <option value="PUBLIC">Public</option>
                <option value="RELIGIOUS">Religious</option>
                <option value="NATIONAL">National</option>
                <option value="BREAK">Break</option>
              </select>
              <input
                type="text"
                placeholder="Description (optional)"
                value={newHoliday.description}
                onChange={(e) => setNewHoliday({ ...newHoliday, description: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                Save
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}

        {holidayLoading ? (
          <p className="text-sm text-gray-400">Loading holidays...</p>
        ) : holidays.length === 0 ? (
          <p className="text-sm text-gray-400">No holidays defined yet.</p>
        ) : (
          <div className="space-y-2">
            {holidays.map((h) => (
              <div key={h.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="text-center min-w-[3rem]">
                    <p className="text-xs text-gray-400">
                      {new Date(h.holidayDate).toLocaleDateString('en-US', { month: 'short' })}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(h.holidayDate).getDate()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{h.name}</p>
                    {h.description && <p className="text-xs text-gray-500">{h.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${HOLIDAY_TYPE_COLORS[h.type] || 'bg-gray-100 text-gray-700'}`}>
                    {h.type}
                  </span>
                  {canManage && (
                    <button
                      onClick={() => handleDeleteHoliday(h.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Attendance Marking Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-gray-500" />
            Today's Attendance
          </h2>
          {canMark && (
            <button onClick={() => setShowMarkModal(true)} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
              <Plus className="w-4 h-4" />
              Mark Attendance
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <select value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setSelectedDivision(''); }} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Select Class</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)} disabled={!selectedClass} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100">
            <option value="">Select Division</option>
            {divisions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        {attendanceLoading ? (
          <p className="text-sm text-gray-400">Loading attendance...</p>
        ) : !selectedDivision ? (
          <p className="text-sm text-gray-400">Select a class and division to view attendance.</p>
        ) : attendanceRecords.length === 0 ? (
          <p className="text-sm text-gray-400">No attendance records for today.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500 bg-gray-50">
                  <th className="px-4 py-2 font-medium">Student</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attendanceRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-900">{r.studentName || `Student #${r.studentId}`}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.status === 'PRESENT' ? 'bg-green-100 text-green-700' : r.status === 'ABSENT' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-500">{r.remarks || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showMarkModal} onClose={() => setShowMarkModal(false)} title="Mark Attendance">
        <form onSubmit={handleMarkAttendance} className="space-y-4">
          <div><label className="block text-xs font-medium text-gray-500 mb-1">Student ID</label><input type="number" required value={markForm.studentId} onChange={(e) => setMarkForm({ ...markForm, studentId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
          <div><label className="block text-xs font-medium text-gray-500 mb-1">Date</label><input type="date" required value={markForm.date} onChange={(e) => setMarkForm({ ...markForm, date: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
          <div><label className="block text-xs font-medium text-gray-500 mb-1">Status</label><select value={markForm.status} onChange={(e) => setMarkForm({ ...markForm, status: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"><option value="PRESENT">Present</option><option value="ABSENT">Absent</option><option value="ON_LEAVE">On Leave</option></select></div>
          <div><label className="block text-xs font-medium text-gray-500 mb-1">Remarks (optional)</label><input type="text" value={markForm.remarks} onChange={(e) => setMarkForm({ ...markForm, remarks: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">{saving ? 'Saving...' : 'Mark'}</button>
            <button type="button" onClick={() => setShowMarkModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
