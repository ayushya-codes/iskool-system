import { useEffect, useState, useCallback, useMemo } from 'react';
import { holidayApi } from '../api/holiday';
import { attendanceApi } from '../api/attendance';
import { academicApi } from '../api/academic';
import { studentApi } from '../api/student';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { CalendarCheck, FileText, UserX, UserCheck, CalendarDays, Plus, Trash2, User } from 'lucide-react';
import { EmptyState, LoadingText } from '../components/ui';

const HOLIDAY_TYPE_COLORS = {
  PUBLIC: '[color-mix(in_srgb,var(--info)_15%,transparent)] text-blue-700',
  SCHOOL: '[color-mix(in_srgb,var(--accent-secondary)_15%,transparent)] text-purple-700',
  RELIGIOUS: '[color-mix(in_srgb,var(--warning)_15%,transparent)] [color:var(--warning)]',
  NATIONAL: 'theme-badge-success',
  BREAK: 'bg-rose-100 text-rose-700',
};

const STATUS_COLORS = {
  PRESENT: 'theme-badge-success border-green-200',
  ABSENT: 'bg-red-100 text-red-700 border-red-200',
  ON_LEAVE: '[color-mix(in_srgb,var(--warning)_15%,transparent)] [color:var(--warning)] border-amber-200',
};

const STATUS_LABELS = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  ON_LEAVE: 'On Leave',
};

const STATUS_CYCLE = ['PRESENT', 'ABSENT', 'ON_LEAVE'];

const CAN_MANAGE_HOLIDAYS = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'SUPERVISOR'];
const CAN_MARK_ATTENDANCE = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'SUPERVISOR', 'FACULTY'];

function sortByRollNumber(a, b) {
  const aNum = parseInt(a.rollNumber, 10);
  const bNum = parseInt(b.rollNumber, 10);
  if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
  return (a.rollNumber || '').localeCompare(b.rollNumber || '');
}

export default function Attendance() {
  const { user } = useAuth();
  const [holidays, setHolidays] = useState([]);
  const [holidayLoading, setHolidayLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ name: '', holidayDate: '', type: 'SCHOOL', description: '' });

  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [savingStudentId, setSavingStudentId] = useState(null);
  const [gridColumns, setGridColumns] = useState(7);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const canManage = user && CAN_MANAGE_HOLIDAYS.includes(user.role);
  const canMark = user && CAN_MARK_ATTENDANCE.includes(user.role);

  useEffect(() => {
    holidayApi.getAll()
      .then((res) => setHolidays(res.data))
      .catch(() => setHolidays([]))
      .finally(() => setHolidayLoading(false));

    academicApi.getAllClasses().then((res) => setClasses(res.data || [])).catch(() => setClasses([]));
    academicApi.getAllBatches().then((res) => {
      const batchList = res.data || [];
      setBatches(batchList);
      const active = batchList.find((b) => b.isActive);
      if (active) setSelectedBatch(String(active.id));
    }).catch(() => setBatches([]));
  }, []);

  useEffect(() => {
    if (!selectedClass) { setDivisions([]); return; }
    academicApi.getDivisionsByClass(selectedClass)
      .then((res) => setDivisions(res.data || []))
      .catch(() => setDivisions([]));
  }, [selectedClass]);

  const loadStudents = useCallback(() => {
    if (!selectedBatch || !selectedClass || !selectedDivision) {
      setStudents([]);
      return;
    }
    setStudentsLoading(true);
    studentApi.getAll({ batchId: selectedBatch, classId: selectedClass, divisionId: selectedDivision })
      .then((res) => setStudents(res.data || []))
      .catch(() => setStudents([]))
      .finally(() => setStudentsLoading(false));
  }, [selectedBatch, selectedClass, selectedDivision]);

  useEffect(() => { loadStudents(); }, [loadStudents]);

  const loadAttendance = useCallback(() => {
    if (!selectedDivision) { setAttendanceRecords([]); return; }
    setAttendanceLoading(true);
    attendanceApi.getByDivisionAndDate(selectedDivision, selectedDate)
      .then((res) => setAttendanceRecords(res.data || []))
      .catch(() => setAttendanceRecords([]))
      .finally(() => setAttendanceLoading(false));
  }, [selectedDivision, selectedDate]);

  useEffect(() => { loadAttendance(); }, [loadAttendance]);

  const attendanceMap = useMemo(() => {
    const map = {};
    attendanceRecords.forEach((r) => { map[r.studentId] = r; });
    return map;
  }, [attendanceRecords]);

  const sortedStudents = useMemo(() => [...students].sort(sortByRollNumber), [students]);

  const pageSize = gridColumns * rowsPerPage;
  const totalPages = Math.max(1, Math.ceil(sortedStudents.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedStudents = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedStudents.slice(start, start + pageSize);
  }, [sortedStudents, safePage, pageSize]);

  useEffect(() => { setPage(1); }, [selectedBatch, selectedClass, selectedDivision, gridColumns, rowsPerPage]);

  const selectedClassName = useMemo(() => {
    const cls = classes.find((c) => String(c.id) === selectedClass);
    return cls ? cls.name : '';
  }, [classes, selectedClass]);

  const divisionName = useMemo(() => {
    const div = divisions.find((d) => String(d.id) === selectedDivision);
    return div ? div.name : '';
  }, [divisions, selectedDivision]);

  const handleTileClick = async (student) => {
    if (!canMark) return;
    const current = attendanceMap[student.id]?.status;
    const currentIndex = STATUS_CYCLE.indexOf(current);
    const nextStatus = currentIndex === -1 ? STATUS_CYCLE[0] : STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];

    setSavingStudentId(student.id);
    try {
      const res = await attendanceApi.markSingle({
        studentId: student.id,
        divisionId: selectedDivision ? parseInt(selectedDivision, 10) : undefined,
        date: selectedDate,
        status: nextStatus,
        markedByFacultyId: user?.id,
      });
      setAttendanceRecords((prev) => {
        const filtered = prev.filter((r) => r.studentId !== student.id);
        return [...filtered, res.data];
      });
    } catch (err) {
      alert('Failed to mark attendance: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingStudentId(null);
    }
  };

  const presentCount = sortedStudents.filter((s) => attendanceMap[s.id]?.status === 'PRESENT').length;
  const absentCount = sortedStudents.filter((s) => attendanceMap[s.id]?.status === 'ABSENT').length;
  const onLeaveCount = sortedStudents.filter((s) => attendanceMap[s.id]?.status === 'ON_LEAVE').length;
  const unmarkedCount = sortedStudents.length - presentCount - absentCount - onLeaveCount;
  const attendanceRate = sortedStudents.length > 0 ? Math.round((presentCount / sortedStudents.length) * 100) + '%' : '—';

  const cards = [
    { label: 'Present', value: presentCount, icon: UserCheck, color: '[color-mix(in_srgb,var(--success)_10%,transparent)]0' },
    { label: 'Absent', value: absentCount, icon: UserX, color: '[color-mix(in_srgb,var(--danger)_10%,transparent)]0' },
    { label: 'On Leave', value: onLeaveCount, icon: FileText, color: '[color-mix(in_srgb,var(--warning)_10%,transparent)]0' },
    { label: 'Attendance Rate', value: attendanceRate, icon: CalendarCheck, color: '[color-mix(in_srgb,var(--info)_10%,transparent)]0' },
  ];

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

  const selectorsReady = selectedBatch && selectedClass && selectedDivision;

  return (
    <div>
      <PageHeader title="Attendance" subtitle="Track and manage student attendance" />
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

      {/* Holiday Calendar Section */}
      <div className="rounded-xl theme-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold theme-text flex items-center gap-2">
            <CalendarDays className="w-5 h-5 theme-text-muted" />
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
          <form onSubmit={handleAddHoliday} className="mb-4 p-4 [var(--sidebar-hover-bg)] rounded-lg border [var(--divider)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              <input
                type="text"
                placeholder="Holiday Name"
                value={newHoliday.name}
                onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                required
                className="px-3 py-2 theme-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={newHoliday.holidayDate}
                onChange={(e) => setNewHoliday({ ...newHoliday, holidayDate: e.target.value })}
                required
                className="px-3 py-2 theme-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newHoliday.type}
                onChange={(e) => setNewHoliday({ ...newHoliday, type: e.target.value })}
                className="px-3 py-2 theme-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="px-3 py-2 theme-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                Save
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 [var(--sidebar-hover-bg)] theme-text text-sm rounded-lg hover:bg-[var(--sidebar-hover-bg)] transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}

        {holidayLoading ? (
          <LoadingText />
        ) : holidays.length === 0 ? (
          <EmptyState message="No holidays defined yet." icon={CalendarDays} />
        ) : (
          <div className="space-y-2">
            {holidays.map((h) => (
              <div key={h.id} className="flex items-center justify-between p-3 [var(--sidebar-hover-bg)] rounded-lg border [var(--divider)]">
                <div className="flex items-center gap-3">
                  <div className="text-center min-w-[3rem]">
                    <p className="text-xs theme-text-faint">
                      {new Date(h.holidayDate).toLocaleDateString('en-US', { month: 'short' })}
                    </p>
                    <p className="text-lg font-bold theme-text">
                      {new Date(h.holidayDate).getDate()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium theme-text">{h.name}</p>
                    {h.description && <p className="text-xs theme-text-muted">{h.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${HOLIDAY_TYPE_COLORS[h.type] || '[var(--sidebar-hover-bg)] theme-text'}`}>
                    {h.type}
                  </span>
                  {canManage && (
                    <button
                      onClick={() => handleDeleteHoliday(h.id)}
                      className="p-1 theme-text-faint hover:[color:var(--danger)] transition-colors"
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
      <div className="rounded-xl theme-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold theme-text flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 theme-text-muted" />
            Mark Attendance
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="rounded-lg theme-input px-3 py-2 text-sm focus-ring"
          >
            <option value="">Select Batch / Year</option>
            {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select
            value={selectedClass}
            onChange={(e) => { setSelectedClass(e.target.value); setSelectedDivision(''); }}
            className="rounded-lg theme-input px-3 py-2 text-sm focus-ring"
          >
            <option value="">Select Class</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            disabled={!selectedClass}
            className="rounded-lg theme-input px-3 py-2 text-sm focus-ring disabled:[var(--sidebar-hover-bg)]"
          >
            <option value="">Select Division</option>
            {divisions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-lg theme-input px-3 py-2 text-sm focus-ring"
          />
        </div>

        {selectorsReady && !studentsLoading && !attendanceLoading && sortedStudents.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-4 p-3 [var(--sidebar-hover-bg)] rounded-lg border [var(--divider)]">
            <div className="flex items-center gap-2">
              <label className="text-xs theme-text-muted">Columns</label>
              <select
                value={gridColumns}
                onChange={(e) => setGridColumns(parseInt(e.target.value, 10))}
                className="rounded-lg theme-input px-2 py-1 text-sm focus-ring"
              >
                {[4, 5, 6, 7, 8, 9, 10].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs theme-text-muted">Rows / Page</label>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                className="rounded-lg theme-input px-2 py-1 text-sm focus-ring"
              >
                {[5, 10, 15, 20, 25, 30].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <p className="text-xs theme-text-muted ml-auto">
              Showing {paginatedStudents.length} of {sortedStudents.length} students · Page {safePage} of {totalPages}
            </p>
          </div>
        )}

        {!selectorsReady ? (
          <p className="text-sm theme-text-faint">Select batch, class, division and date to view attendance.</p>
        ) : studentsLoading || attendanceLoading ? (
          <LoadingText />
        ) : sortedStudents.length === 0 ? (
          <EmptyState message="No students found for the selected class and division." icon={User} />
        ) : (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}
          >
            {paginatedStudents.map((student) => {
              const record = attendanceMap[student.id];
              const status = record?.status;
              const displayName = `${student.firstName || ''} ${student.lastName || ''}`.trim();
              const title = `${displayName} • ${selectedClassName} ${divisionName}`;

              return (
                <button
                  key={student.id}
                  type="button"
                  title={title}
                  disabled={savingStudentId === student.id || !canMark}
                  onClick={() => handleTileClick(student)}
                  className={`group relative flex flex-col items-center p-3 rounded-xl border transition-all hover:shadow-md focus-ring disabled:opacity-60 ${
                    status ? 'border-transparent' : 'border-[var(--divider)] hover:border-[var(--accent-primary)]'
                  } ${canMark ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className="relative w-full aspect-square mb-2 rounded-lg overflow-hidden [var(--sidebar-hover-bg)] border [var(--divider)]">
                    <div className="absolute inset-0 flex items-center justify-center [var(--sidebar-hover-bg)] theme-accent">
                      <User className="w-10 h-10" />
                    </div>
                    {student.avatarUrl ? (
                      <img
                        src={student.avatarUrl}
                        alt={displayName}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : null}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity px-1">
                      <p className="text-white text-xs font-medium text-center truncate w-full">{displayName}</p>
                      <p className="text-white/80 text-[10px] text-center truncate w-full">{selectedClassName} {divisionName}</p>
                    </div>
                  </div>
                  <div className="w-full text-center">
                    <p className="text-xs font-semibold theme-text truncate">{displayName}</p>
                    <p className="text-[10px] theme-text-muted">Roll: {student.rollNumber || '—'}</p>
                    {status ? (
                      <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full border ${STATUS_COLORS[status]}`}>
                        {STATUS_LABELS[status]}
                      </span>
                    ) : (
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full [var(--sidebar-hover-bg)] theme-text-muted border [var(--divider)]">
                        Unmarked
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {selectorsReady && sortedStudents.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 text-sm rounded-lg theme-input theme-card theme-text hover:[var(--sidebar-hover-bg)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm theme-text-muted">
              Page {safePage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 text-sm rounded-lg theme-input theme-card theme-text hover:[var(--sidebar-hover-bg)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {selectorsReady && sortedStudents.length > 0 && unmarkedCount > 0 && (
          <p className="mt-4 text-xs theme-text-muted">{unmarkedCount} student(s) still unmarked for {new Date(selectedDate).toLocaleDateString()}.</p>
        )}
      </div>
    </div>
  );
}

