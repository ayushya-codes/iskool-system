import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import { Megaphone, Calendar, Image, FileText } from 'lucide-react';

export default function Communication() {
  const { user } = useAuth();
  const isParent = user?.role === 'PARENT';

  const cards = [
    { label: 'Calendar Events', value: '—', icon: Calendar, color: 'bg-blue-500' },
    { label: 'Circulars', value: '—', icon: FileText, color: 'bg-purple-500' },
    { label: 'Announcements', value: '—', icon: Megaphone, color: 'bg-green-500' },
    { label: 'Media Galleries', value: '—', icon: Image, color: 'bg-indigo-500' },
  ];

  return (
    <div>
      <PageHeader title="Communication" subtitle="Calendar events, circulars, announcements, and media" />
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
            {['Add Event', 'Publish Circular', 'Post Announcement', 'Create Gallery'].map((action) => (
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
          <p className="text-sm text-gray-500">School announcements and events for your child are available on the <strong>My Child</strong> page.</p>
        </div>
      )}
    </div>
  );
}
