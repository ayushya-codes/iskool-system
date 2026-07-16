import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { studentApi } from '../api/student';
import { attendanceApi } from '../api/attendance';
import { communicationApi } from '../api/communication';
import { examApi } from '../api/exam';
import { safetyApi } from '../api/safety';
import PageHeader from '../components/PageHeader';
import {
  User, Calendar, BookOpen, ClipboardCheck, ShieldCheck, Megaphone,
  GraduationCap, Activity, TrendingUp, Award,
  AlertCircle, Bell
} from 'lucide-react';
import { Tabs } from '../components/ui';

export default function StudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [exams, setExams] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const studentRes = await studentApi.getById(id);
        if (!mounted) return;
        const studentData = studentRes.data;
        setStudent(studentData);

        const [enrollRes, attRes] = await Promise.all([
          studentApi.getEnrollments(id).catch(() => ({ data: [] })),
          attendanceApi.getByStudentRange(id, '2024-01-01', '2025-12-31').catch(() => ({ data: [] })),
        ]);
        if (!mounted) return;

        const enrollments = enrollRes.data;
        setEnrollment(enrollments[0] || null);
        setAttendance(attRes.data || []);

        const divisionId = enrollments[0]?.divisionId;
        if (divisionId) {
          const announceRes = await communicationApi.getAnnouncementsByDivision(divisionId).catch(() => ({ data: [] }));
          if (mounted) setAnnouncements(announceRes.data || []);
        }

        if (divisionId) {
          const examsRes = await examApi.getByDivision(divisionId).catch(() => ({ data: [] }));
          const examList = examsRes.data || [];
          const results = [];
          for (const exam of examList.slice(0, 5)) {
            const resultRes = await examApi.getResultsByStudent(exam.id, id).catch(() => ({ data: [] }));
            const examResults = resultRes.data || [];
            for (const r of examResults) {
              results.push({ ...r, examName: exam.name });
            }
          }
          if (mounted) setExams(results);
        }
      } catch (err) {
        console.error('Failed to load student data:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="theme-text-faint">Loading student information...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold theme-text">Student Not Found</h2>
        <p className="theme-text-muted mt-2 max-w-md">
          The student you are looking for does not exist or you do not have permission to view their details.
        </p>
      </div>
    );
  }

  const fullName = `${student.firstName} ${student.lastName}`;
  const presentDays = attendance.filter(a => a.status === 'PRESENT').length;
  const totalDays = attendance.length || 1;
  const attendanceRate = Math.round((presentDays / totalDays) * 100);
  const latestExam = exams[0];

  return (
    <div>
      <PageHeader
        title={fullName}
        subtitle={`Student Profile — ${student.gender || ''} | DOB: ${student.dateOfBirth || '—'} | ID: ${student.id}`}
      />

      {/* Profile Card */}
      <div className="rounded-xl theme-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center text-2xl font-bold theme-accent shrink-0">
            {fullName.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-xl font-bold theme-text">{fullName}</h2>
              <span className="px-2.5 py-0.5 rounded-full theme-badge-success text-xs font-semibold">
                Active
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
              <div className="flex items-center gap-2 text-sm theme-text-muted">
                <GraduationCap className="w-4 h-4 theme-text-faint" />
                <span>Roll No: {enrollment?.rollNumber || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm theme-text-muted">
                <Calendar className="w-4 h-4 theme-text-faint" />
                <span>Admission: {student.admissionDate || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm theme-text-muted">
                <User className="w-4 h-4 theme-text-faint" />
                <span>{student.gender || '—'} | DOB: {student.dateOfBirth || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm theme-text-muted">
                <BookOpen className="w-4 h-4 theme-text-faint" />
                <span>Student ID: {student.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Activity} label="Attendance" value={`${attendanceRate}%`} color="bg-emerald-500" />
        <StatCard icon={TrendingUp} label="Latest Exam" value={latestExam?.grade || '—'} color="[color-mix(in_srgb,var(--info)_10%,transparent)]0" />
        <StatCard icon={Award} label="Results" value={exams.length} color="[color-mix(in_srgb,var(--warning)_10%,transparent)]0" />
        <StatCard icon={Bell} label="Announcements" value={announcements.length} color="[color-mix(in_srgb,var(--accent-secondary)_10%,transparent)]0" />
      </div>

      {/* Tabs */}
      <div className="rounded-xl theme-card overflow-hidden">
        <Tabs
          tabs={[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
            { id: 'exams', label: 'Exam Results', icon: Award },
            { id: 'safety', label: 'Safety', icon: ShieldCheck },
            { id: 'communication', label: 'Communication', icon: Megaphone },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="p-6">
          {activeTab === 'overview' && (
            <OverviewTab student={student} enrollment={enrollment} latestExam={latestExam} announcements={announcements.slice(0, 3)} />
          )}
          {activeTab === 'attendance' && (
            <AttendanceTab attendance={attendance} />
          )}
          {activeTab === 'exams' && (
            <ExamsTab exams={exams} />
          )}
          {activeTab === 'safety' && (
            <SafetyTab studentId={id} />
          )}
          {activeTab === 'communication' && (
            <CommunicationTab announcements={announcements} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-Components ─── */

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-xl theme-card p-4 flex items-center gap-4">
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold theme-text">{value}</p>
        <p className="text-xs theme-text-muted">{label}</p>
      </div>
    </div>
  );
}

function OverviewTab({ student, enrollment, latestExam, announcements }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold theme-text uppercase tracking-wide mb-3">Recent Announcements</h3>
        {announcements.length === 0 ? (
          <p className="text-sm theme-text-faint">No recent announcements.</p>
        ) : (
          <div className="space-y-3">
            {announcements.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 [var(--sidebar-hover-bg)] rounded-lg">
                <Megaphone className="w-4 h-4 theme-accent mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium theme-text">{a.title}</p>
                  <p className="text-xs theme-text-muted mt-0.5">{a.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {latestExam && (
        <div>
          <h3 className="text-sm font-semibold theme-text uppercase tracking-wide mb-3">Latest Exam Result</h3>
          <div className="p-4 [var(--sidebar-hover-bg)] rounded-lg border [var(--divider)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium theme-text">{latestExam.examName}</p>
                <p className="text-xs theme-accent mt-1">{latestExam.subjectName}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold theme-accent">{latestExam.marksObtained} / {latestExam.maxMarks}</p>
                <p className="text-xs font-semibold theme-accent">Grade: {latestExam.grade}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold theme-text uppercase tracking-wide mb-3">Enrollment Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoItem label="Class" value={enrollment?.className || '—'} />
          <InfoItem label="Division" value={enrollment?.divisionName || '—'} />
          <InfoItem label="Roll Number" value={enrollment?.rollNumber || '—'} />
          <InfoItem label="Batch" value={enrollment?.batchName || '—'} />
          <InfoItem label="Academic Year" value={enrollment?.academicYear || '—'} />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold theme-text uppercase tracking-wide mb-3">Personal Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoItem label="First Name" value={student.firstName || '—'} />
          <InfoItem label="Last Name" value={student.lastName || '—'} />
          <InfoItem label="Gender" value={student.gender || '—'} />
          <InfoItem label="Date of Birth" value={student.dateOfBirth || '—'} />
          <InfoItem label="Admission Date" value={student.admissionDate || '—'} />
        </div>
      </div>
    </div>
  );
}

function AttendanceTab({ attendance }) {
  if (attendance.length === 0) {
    return <p className="text-sm theme-text-faint">No attendance records found.</p>;
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-sm mb-4">
        <span className="px-2 py-1 rounded theme-badge-success font-medium">Present</span>
        <span className="px-2 py-1 rounded bg-red-100 text-red-700 font-medium">Absent</span>
        <span className="px-2 py-1 rounded [color-mix(in_srgb,var(--warning)_15%,transparent)] [color:var(--warning)] font-medium">Late</span>
        <span className="px-2 py-1 rounded [color-mix(in_srgb,var(--info)_15%,transparent)] text-blue-700 font-medium">Leave</span>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {attendance.slice(0, 28).map((record, i) => {
          const color =
            record.status === 'PRESENT' ? '[color-mix(in_srgb,var(--success)_10%,transparent)]0' :
            record.status === 'ABSENT' ? '[color-mix(in_srgb,var(--danger)_10%,transparent)]0' :
            record.status === 'LATE' ? '[color-mix(in_srgb,var(--warning)_10%,transparent)]0' :
            '[color-mix(in_srgb,var(--info)_10%,transparent)]0';
          return (
            <div key={i} className="flex flex-col items-center gap-1 p-2 [var(--sidebar-hover-bg)] rounded-lg">
              <div className={`w-8 h-8 ${color} rounded-full`} title={record.status} />
              <span className="text-[10px] theme-text-muted">{record.date}</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs theme-text-faint">Showing last {Math.min(28, attendance.length)} records.</p>
    </div>
  );
}

function ExamsTab({ exams }) {
  if (exams.length === 0) {
    return <p className="text-sm theme-text-faint">No exam results available yet.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b [var(--divider)] text-left theme-text-muted">
            <th className="pb-3 pr-4 font-medium">Exam</th>
            <th className="pb-3 pr-4 font-medium">Subject</th>
            <th className="pb-3 pr-4 font-medium">Marks</th>
            <th className="pb-3 pr-4 font-medium">Grade</th>
            <th className="pb-3 font-medium">Rank</th>
          </tr>
        </thead>
        <tbody className="divide-y theme-divider">
          {exams.map((exam, i) => (
            <tr key={i} className="hover:[var(--sidebar-hover-bg)]">
              <td className="py-3 pr-4 font-medium theme-text">{exam.examName}</td>
              <td className="py-3 pr-4 theme-text-muted">{exam.subjectName}</td>
              <td className="py-3 pr-4 theme-text font-semibold">{exam.marksObtained} / {exam.maxMarks}</td>
              <td className="py-3 pr-4">
                <span className="px-2 py-0.5 rounded-full gradient-bg theme-accent text-xs font-semibold">
                  {exam.grade}
                </span>
              </td>
              <td className="py-3 theme-text-muted">{exam.rank || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SafetyTab({ studentId }) {
  const [gatePasses, setGatePasses] = useState([]);
  const [proxyPickups, setProxyPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    Promise.all([
      safetyApi.getGatePassesByStudent(studentId).catch(() => ({ data: [] })),
      safetyApi.getProxyPickupsByStudent(studentId).catch(() => ({ data: [] })),
    ]).then(([gpRes, ppRes]) => {
      setGatePasses(gpRes.data || []);
      setProxyPickups(ppRes.data || []);
    }).finally(() => setLoading(false));
  }, [studentId]);

  if (loading) {
    return <p className="text-sm theme-text-faint">Loading safety information...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold theme-text uppercase tracking-wide mb-3">Gate Passes</h3>
        {gatePasses.length === 0 ? (
          <div className="p-4 [var(--sidebar-hover-bg)] rounded-lg text-center">
            <ShieldCheck className="w-8 h-8 theme-text-faint mx-auto mb-2" />
            <p className="text-sm theme-text-muted">No active gate passes.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {gatePasses.map((gp, i) => (
              <div key={i} className="p-3 [var(--sidebar-hover-bg)] rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium theme-text">Pass Code: {gp.passCode}</p>
                  <p className="text-xs theme-text-muted">Valid until: {gp.validDate}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${gp.verified ? 'theme-badge-success' : '[color-mix(in_srgb,var(--warning)_15%,transparent)] [color:var(--warning)]'}`}>
                  {gp.verified ? 'Verified' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-semibold theme-text uppercase tracking-wide mb-3">Proxy Pickups</h3>
        {proxyPickups.length === 0 ? (
          <div className="p-4 [var(--sidebar-hover-bg)] rounded-lg text-center">
            <User className="w-8 h-8 theme-text-faint mx-auto mb-2" />
            <p className="text-sm theme-text-muted">No proxy pickups scheduled.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {proxyPickups.map((pp, i) => (
              <div key={i} className="p-3 [var(--sidebar-hover-bg)] rounded-lg">
                <p className="text-sm font-medium theme-text">{pp.proxyName}</p>
                <p className="text-xs theme-text-muted">Relation: {pp.relation} | Phone: {pp.proxyPhone}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CommunicationTab({ announcements }) {
  if (announcements.length === 0) {
    return <p className="text-sm theme-text-faint">No announcements from the school.</p>;
  }
  return (
    <div className="space-y-4">
      {announcements.map((a, i) => (
        <div key={i} className="p-4 [var(--sidebar-hover-bg)] rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Megaphone className="w-5 h-5 theme-accent mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold theme-text">{a.title}</p>
                <p className="text-sm theme-text-muted mt-1">{a.message}</p>
                {a.postedBy && (
                  <p className="text-xs theme-text-faint mt-2">Posted by {a.postedBy} on {a.postedAt}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="p-3 [var(--sidebar-hover-bg)] rounded-lg">
      <p className="text-xs theme-text-muted uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium theme-text mt-1">{value}</p>
    </div>
  );
}
