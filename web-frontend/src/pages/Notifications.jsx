import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { notificationApi } from '../api/notification';
import PageHeader from '../components/PageHeader';
import { Bell, CheckCheck } from 'lucide-react';
import { LoadingText, EmptyState } from '../components/ui';

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
          <button onClick={handleMarkAllRead} className="inline-flex items-center gap-2 rounded-lg glass-btn px-4 py-2.5 text-sm font-medium theme-text transition-all duration-300 hover:scale-[1.02] focus-ring">
            <CheckCheck className="w-4 h-4" />
            Mark All Read
          </button>
        )}
      />
      <div className="rounded-xl theme-card divide-y theme-divider animate-fade-in">
        {loading ? (
          <div className="p-8"><LoadingText /></div>
        ) : notifications.length === 0 ? (
          <EmptyState message="No notifications yet." icon={Bell} className="border-0" />
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.isRead && handleMarkRead(n.id)}
              className={`flex items-start gap-3 p-4 cursor-pointer transition-all duration-200 ${n.isRead ? '' : 'hover:scale-[1.01] accent-tint-bg-light'}`}
            >
              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.isRead ? 'bg-[var(--text-faint)]' : 'bg-accent'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium theme-text">{n.title}</p>
                {n.body && <p className="text-sm theme-text-muted mt-0.5">{n.body}</p>}
                <p className="text-xs theme-text-faint mt-1">
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
