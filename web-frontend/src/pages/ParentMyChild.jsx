import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
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

export default function ParentMyChild() {
  const { user } = useAuth();
  const [child, setChild] = useState(null);
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
        // 1. Get the child linked to parent
        const childRes = await studentApi.getMyChild();
        if (!mounted) return;
        const childData = childRes.data;
        setChild(childData);

        // 2. Fetch enrollment, attendance, and other data using child ID
        const [enrollRes, attRes, announceRes] = await Promise.all([
          studentApi.getEnrollments(childData.id).catch(() => ({ data: [] })),
          attendanceApi.getByStudentRange(childData.id, '2024-01-01', '2025-12-31').catch(() => ({ data: [] })),
          // We need divisionId for announcements - get it from enrollment first
          Promise.resolve({ data: [] }),
        ]);
        if (!mounted) return;

        const enrollments = enrollRes.data;
        setEnrollment(enrollments[0] || null);
        setAttendance(attRes.data || []);

        // 3. Fetch announcements for the child's division
        const divisionId = enrollments[0]?.divisionId;
        if (divisionId) {
          const announceRes = await communicationApi.getAnnouncementsByDivision(divisionId).catch(() => ({ data: [] }));
          if (mounted) setAnnouncements(announceRes.data || []);
        }

        // 4. Fetch exam results: get exams by division, then results
        if (divisionId) {
          const examsRes = await examApi.getByDivision(divisionId).catch(() => ({ data: [] }));
          const examList = examsRes.data || [];
          const results = [];
          for (const exam of examList.slice(0, 5)) {
            const resultRes = await examApi.getResultsByStudent(exam.id, childData.id).catch(() => ({ data: [] }));
            const examResults = resultRes.data || [];
            for (const r of examResults) {
              results.push({ ...r, examName: exam.name });
            }
          }
          if (mounted) setExams(results);
        }
      } catch (err) {
        console.error('Failed to load child data:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-400">Loading your child's information...</div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">No Student Linked</h2>
        <p className="text-gray-500 mt-2 max-w-md">
          Your account is not linked to any student yet. Please contact the school administration to link your child to your account.
        </p>
      </div>
    );
  }

  const fullName = `${child.firstName} ${child.lastName}`;
  const presentDays = attendance.filter(a => a.status === 'PRESENT').length;
  const totalDays = attendance.length || 1;
  const attendanceRate = Math.round((presentDays / totalDays) * 100);
  const latestExam = exams[0];

  return (
    <div>
      <PageHeader
        title="My Child"
        subtitle={`Welcome back, ${user?.fullName || 'Parent'}. Here's everything about ${fullName}.`}
      />

      {/* ── Top Card: Child Profile ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-700 shrink-0">
            {fullName.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                Active
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <GraduationCap className="w-4 h-4 text-gray-400" />
                <span>Roll No: {enrollment?.rollNumber || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Admission: {child.admissionDate || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4 text-gray-400" />
                <span>{child.gender || '—'} | DOB: {child.dateOfBirth || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <span>Student ID: {child.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Activity} label="Attendance" value={`${attendanceRate}%`} color="bg-emerald-500" />
        <StatCard icon={TrendingUp} label="Latest Exam" value={latestExam?.grade || '—'} color="bg-blue-500" />
        <StatCard icon={Award} label="Results" value={exams.length} color="bg-amber-500" />
        <StatCard icon={Bell} label="Announcements" value={announcements.length} color="bg-purple-500" />
      </div>

      {/* ── Tab Navigation ── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
            { id: 'exams', label: 'Exam Results', icon: Award },
            { id: 'safety', label: 'Safety', icon: ShieldCheck },
            { id: 'communication', label: 'Communication', icon: Megaphone },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <OverviewTab child={child} enrollment={enrollment} latestExam={latestExam} announcements={announcements.slice(0, 3)} />
          )}
          {activeTab === 'attendance' && (
            <AttendanceTab attendance={attendance} />
          )}
          {activeTab === 'exams' && (
            <ExamsTab exams={exams} />
          )}
          {activeTab === 'safety' && (
            <SafetyTab studentId={child.id} />
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
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function OverviewTab({ child, enrollment, latestExam, announcements }) {
  return (
    <div className="space-y-6">
      {/* Recent Announcements */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Recent Announcements</h3>
        {announcements.length === 0 ? (
          <p className="text-sm text-gray-400">No recent announcements.</p>
        ) : (
          <div className="space-y-3">
            {announcements.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Megaphone className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{a.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Latest Exam */}
      {latestExam && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Latest Exam Result</h3>
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-900">{latestExam.examName}</p>
                <p className="text-xs text-indigo-600 mt-1">{latestExam.subjectName}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-indigo-700">{latestExam.marksObtained} / {latestExam.maxMarks}</p>
                <p className="text-xs font-semibold text-indigo-600">Grade: {latestExam.grade}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Details */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Enrollment Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoItem label="Class" value={enrollment?.className || '—'} />
          <InfoItem label="Division" value={enrollment?.divisionName || '—'} />
          <InfoItem label="Roll Number" value={enrollment?.rollNumber || '—'} />
          <InfoItem label="Batch" value={enrollment?.batchName || '—'} />
          <InfoItem label="Academic Year" value={enrollment?.academicYear || '—'} />
        </div>
      </div>
    </div>
  );
}

function AttendanceTab({ attendance }) {
  if (attendance.length === 0) {
    return <p className="text-sm text-gray-400">No attendance records found.</p>;
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-sm mb-4">
        <span className="px-2 py-1 rounded bg-green-100 text-green-700 font-medium">Present</span>
        <span className="px-2 py-1 rounded bg-red-100 text-red-700 font-medium">Absent</span>
        <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 font-medium">Late</span>
        <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 font-medium">Leave</span>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {attendance.slice(0, 28).map((record, i) => {
          const color =
            record.status === 'PRESENT' ? 'bg-green-500' :
            record.status === 'ABSENT' ? 'bg-red-500' :
            record.status === 'LATE' ? 'bg-amber-500' :
            'bg-blue-500';
          return (
            <div key={i} className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 ${color} rounded-full`} title={record.status} />
              <span className="text-[10px] text-gray-500">{record.date}</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400">Showing last {Math.min(28, attendance.length)} records.</p>
    </div>
  );
}

function ExamsTab({ exams }) {
  if (exams.length === 0) {
    return <p className="text-sm text-gray-400">No exam results available yet.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500">
            <th className="pb-3 pr-4 font-medium">Exam</th>
            <th className="pb-3 pr-4 font-medium">Subject</th>
            <th className="pb-3 pr-4 font-medium">Marks</th>
            <th className="pb-3 pr-4 font-medium">Grade</th>
            <th className="pb-3 font-medium">Rank</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {exams.map((exam, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="py-3 pr-4 font-medium text-gray-900">{exam.examName}</td>
              <td className="py-3 pr-4 text-gray-600">{exam.subjectName}</td>
              <td className="py-3 pr-4 text-gray-900 font-semibold">{exam.marksObtained} / {exam.maxMarks}</td>
              <td className="py-3 pr-4">
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                  {exam.grade}
                </span>
              </td>
              <td className="py-3 text-gray-600">{exam.rank || '—'}</td>
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
    return <p className="text-sm text-gray-400">Loading safety information...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Gate Passes</h3>
        {gatePasses.length === 0 ? (
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <ShieldCheck className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No active gate passes for your child.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {gatePasses.map((gp, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">Pass Code: {gp.passCode}</p>
                  <p className="text-xs text-gray-500">Valid until: {gp.validDate}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${gp.verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {gp.verified ? 'Verified' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Proxy Pickups</h3>
        {proxyPickups.length === 0 ? (
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <User className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No proxy pickups scheduled.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {proxyPickups.map((pp, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{pp.proxyName}</p>
                <p className="text-xs text-gray-500">Relation: {pp.relation} | Phone: {pp.proxyPhone}</p>
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
    return <p className="text-sm text-gray-400">No announcements from the school.</p>;
  }
  return (
    <div className="space-y-4">
      {announcements.map((a, i) => (
        <div key={i} className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Megaphone className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                <p className="text-sm text-gray-600 mt-1">{a.message}</p>
                {a.postedBy && (
                  <p className="text-xs text-gray-400 mt-2">Posted by {a.postedBy} on {a.postedAt}</p>
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
    <div className="p-3 bg-gray-50 rounded-lg">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-gray-900 mt-1">{value}</p>
    </div>
  );
}
