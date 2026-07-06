import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import { BookOpen, Calendar, ClipboardList, FileText } from 'lucide-react';

export default function Coursework() {
  const { user } = useAuth();
  const isParent = user?.role === 'PARENT';

  const cards = [
    { label: 'Active Timetables', value: '—', icon: Calendar, color: 'bg-blue-500' },
    { label: 'Assignments', value: '—', icon: ClipboardList, color: 'bg-purple-500' },
    { label: 'Syllabus Logs', value: '—', icon: FileText, color: 'bg-green-500' },
    { label: 'Rooms', value: '—', icon: BookOpen, color: 'bg-indigo-500' },
  ];

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

      {!isParent && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {['Create Timetable', 'Add Assignment', 'Log Syllabus', 'Manage Rooms'].map((action) => (
              <button
                key={action}
                className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {isParent && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Coursework information for your child is available on the <strong>My Child</strong> page.</p>
        </div>
      )}
    </div>
  );
}
