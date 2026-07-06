import { useEffect, useState } from 'react';
import api from '../api/client';
import PageHeader from '../components/PageHeader';
import { Bell, CheckCheck } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications/user/1')
      .then((res) => setNotifications(res.data))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="View and manage your notifications"
        action={
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <CheckCheck className="w-4 h-4" />
            Mark All Read
          </button>
        }
      />
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-400 flex flex-col items-center gap-2">
            <Bell className="w-8 h-8 text-gray-300" />
            No notifications yet.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 p-4 ${n.isRead ? 'bg-white' : 'bg-indigo-50/50'}`}
            >
              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.isRead ? 'bg-gray-300' : 'bg-indigo-600'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{n.title}</p>
                {n.body && <p className="text-sm text-gray-500 mt-0.5">{n.body}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  {n.sentAt ? new Date(n.sentAt).toLocaleString() : ''}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
