import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { helpdeskApi } from '../api/helpdesk';
import { studentApi } from '../api/student';
import { userApi } from '../api/user';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { LifeBuoy, MessageSquare, CheckCircle, Plus, Send } from 'lucide-react';

const CAN_MANAGE = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'HELPDESK'];

export default function Helpdesk() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('OPEN');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ studentId: '', subject: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAssignTicket, setSelectedAssignTicket] = useState(null);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [selectedAssignUserId, setSelectedAssignUserId] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [children, setChildren] = useState([]);

  const canManage = CAN_MANAGE.includes(user?.role);
  const isParent = user?.role === 'PARENT';

  useEffect(() => {
    if (isParent) {
      studentApi.getMyChildren().then((res) => {
        const data = res.data;
        if (Array.isArray(data)) setChildren(data);
        else if (data) setChildren([data]);
        else setChildren([]);
      }).catch(() => setChildren([]));
    }
  }, [isParent]);

  const load = useCallback(() => {
    setLoading(true);
    helpdeskApi.getTicketsByStatus(statusFilter)
      .then((res) => setTickets(res.data || []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { subject: form.subject, description: form.description, raisedByUserId: user?.id, studentId: form.studentId ? parseInt(form.studentId) : null };
      await helpdeskApi.createTicket(payload);
      setShowModal(false);
      setForm({ studentId: '', subject: '', description: '' });
      load();
    } catch (err) { alert('Failed: ' + (err.response?.data?.message || err.message)); }
    finally { setSaving(false); }
  };

  const handleOpenAssign = async (ticket) => {
    setSelectedAssignTicket(ticket);
    setSelectedAssignUserId('');
    setAssignableUsers([]);
    setShowAssignModal(true);
    setUsersLoading(true);
    try {
      const res = await userApi.getAll();
      setAssignableUsers((res.data || []).filter((u) => CAN_MANAGE.includes(u.role) && u.id !== user?.id));
    } catch {
      setAssignableUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedAssignUserId || !selectedAssignTicket) return;
    setAssignLoading(true);
    try {
      await helpdeskApi.assignTicket(selectedAssignTicket.id, parseInt(selectedAssignUserId));
      setShowAssignModal(false);
      setSelectedAssignTicket(null);
      setSelectedAssignUserId('');
      load();
    } catch (err) {
      alert('Failed to assign: ' + (err.response?.data?.message || err.message));
    } finally {
      setAssignLoading(false);
    }
  };

  const handleResolve = async (id) => {
    if (!confirm('Mark this ticket as resolved?')) return;
    try { await helpdeskApi.resolveTicket(id); load(); }
    catch (err) { alert('Failed to resolve: ' + (err.response?.data?.message || err.message)); }
  };

  const handleViewReplies = async (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
    try {
      const res = await helpdeskApi.getReplies(ticket.id);
      setReplies(res.data || []);
    } catch { setReplies([]); }
  };

  const handleAddReply = async () => {
    if (!replyText.trim()) return;
    try {
      await helpdeskApi.addReply({ ticketId: selectedTicket.id, body: replyText, userId: user?.id });
      setReplyText('');
      const res = await helpdeskApi.getReplies(selectedTicket.id);
      setReplies(res.data || []);
    } catch (err) { alert('Failed to reply: ' + (err.response?.data?.message || err.message)); }
  };

  const cards = [
    { label: 'Open Tickets', value: tickets.filter(t => t.status === 'OPEN').length, icon: LifeBuoy, color: 'bg-amber-500' },
    { label: 'Resolved', value: tickets.filter(t => t.status === 'RESOLVED').length, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Total', value: tickets.length, icon: MessageSquare, color: 'bg-blue-500' },
  ];

  return (
    <div>
      <PageHeader title="Helpdesk" subtitle="Support tickets and replies" action={
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" /> New Ticket
        </button>
      } />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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

      <div className="flex items-center gap-2 mb-4">
        {(isParent ? ['OPEN', 'RESOLVED'] : ['OPEN', 'ASSIGNED', 'RESOLVED']).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${statusFilter === s ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500 bg-gray-50">
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Student</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>
            ) : tickets.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No tickets found.</td></tr>
            ) : (
              tickets.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-700">#{t.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{t.subject}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.status === 'OPEN' ? 'bg-amber-100 text-amber-700' : t.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{t.studentName || t.studentId || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleViewReplies(t)} className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors" title="View">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      {canManage && t.status === 'OPEN' && (
                        <button onClick={() => handleOpenAssign(t)} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">Assign</button>
                      )}
                      {canManage && t.status !== 'RESOLVED' && (
                        <button onClick={() => handleResolve(t.id)} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">Resolve</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Support Ticket">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Student {isParent ? '' : '(optional)'}</label>
            {isParent ? (
              <select value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select your child</option>
                {(Array.isArray(children) ? children : []).map((c) => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
              </select>
            ) : (
              <input type="number" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} placeholder="Enter student ID" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            )}
          </div>
          <div><label className="block text-xs font-medium text-gray-500 mb-1">Subject</label><input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
          <div><label className="block text-xs font-medium text-gray-500 mb-1">Description</label><textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">{saving ? 'Creating...' : 'Create'}</button>
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
          </div>
        </form>
      </Modal>

      <Modal open={showAssignModal} onClose={() => { setShowAssignModal(false); setSelectedAssignTicket(null); setSelectedAssignUserId(''); }} title={`Assign Ticket #${selectedAssignTicket?.id || ''} - ${selectedAssignTicket?.subject || ''}`}>
        <form onSubmit={handleAssign} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Assign to User</label>
            {usersLoading ? (
              <p className="text-sm text-gray-400 py-2">Loading users...</p>
            ) : assignableUsers.length === 0 ? (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">No eligible users found.</p>
            ) : (
              <select required value={selectedAssignUserId} onChange={(e) => setSelectedAssignUserId(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select a user</option>
                {assignableUsers.map((u) => <option key={u.id} value={u.id}>{u.fullName || u.email} ({u.role})</option>)}
              </select>
            )}
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={assignLoading || !selectedAssignUserId} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">{assignLoading ? 'Assigning...' : 'Assign'}</button>
            <button type="button" onClick={() => { setShowAssignModal(false); setSelectedAssignTicket(null); setSelectedAssignUserId(''); }} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
          </div>
        </form>
      </Modal>

      <Modal open={showTicketModal} onClose={() => setShowTicketModal(false)} title={`Ticket #${selectedTicket?.id || ''} - ${selectedTicket?.subject || ''}`} maxWidth="max-w-2xl">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{selectedTicket?.description}</p>
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Replies</h4>
            {replies.length === 0 ? (
              <p className="text-sm text-gray-400 py-2">No replies yet.</p>
            ) : (
              <div className="space-y-2 mb-4">
                {replies.map((r) => (
                  <div key={r.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{r.body}</p>
                    <p className="text-xs text-gray-400 mt-1">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type a reply..." onKeyDown={(e) => e.key === 'Enter' && handleAddReply()} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <button onClick={handleAddReply} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
