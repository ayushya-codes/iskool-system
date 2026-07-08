import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { notificationApi } from '../api/notification';
import PageHeader from '../components/PageHeader';
import { Bell, CheckCheck } from 'lucide-react';

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = user?.id;

  const load = useCallback(() => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    notificationApi.getByUser(userId)
      .then((res) => setNotifications(res.data || []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const handleMarkAllRead = async () => {
    if (!userId) return;
    try {
      await notificationApi.markAllAsRead(userId);
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      alert('Failed to mark all as read');
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(notifications.map((n) => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      alert('Failed to mark as read');
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'View and manage your notifications'}
        action={unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <CheckCheck className="w-4 h-4" />
            Mark All Read
          </button>
        )}
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
              onClick={() => !n.isRead && handleMarkRead(n.id)}
              className={`flex items-start gap-3 p-4 cursor-pointer transition-colors ${n.isRead ? 'bg-white' : 'bg-indigo-50/50 hover:bg-indigo-50'}`}
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
