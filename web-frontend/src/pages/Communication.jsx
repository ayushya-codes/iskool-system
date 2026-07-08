import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { communicationApi } from '../api/communication';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { Megaphone, Calendar, Image, FileText, Plus, Trash2, CheckCircle } from 'lucide-react';

const CAN_MANAGE = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'SUPERVISOR'];
const CAN_DELETE = ['SUPER_ADMIN'];
const CAN_APPROVE = ['SUPER_ADMIN', 'PRINCIPAL'];

const TABS = [
  { key: 'events', label: 'Events' },
  { key: 'circulars', label: 'Circulars' },
  { key: 'announcements', label: 'Announcements' },
  { key: 'galleries', label: 'Galleries' },
];

export default function Communication() {
  const { user } = useAuth();
  const isParent = user?.role === 'PARENT';
  const [activeTab, setActiveTab] = useState('events');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const canManage = CAN_MANAGE.includes(user?.role);
  const canDelete = CAN_DELETE.includes(user?.role);
  const canApprove = CAN_APPROVE.includes(user?.role);

  const loadData = useCallback(() => {
    setLoading(true);
    let promise;
    if (activeTab === 'events') promise = communicationApi.getAllEvents();
    else if (activeTab === 'circulars') promise = communicationApi.getAllCirculars();
    else if (activeTab === 'galleries') promise = communicationApi.getAllGalleries();
    else { setData([]); setLoading(false); return; }
    promise.then((res) => setData(res.data || [])).catch(() => setData([])).finally(() => setLoading(false));
  }, [activeTab]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleOpenCreate = () => {
    if (activeTab === 'events') setForm({ title: '', description: '', eventDate: '', eventType: 'HOLIDAY' });
    else if (activeTab === 'circulars') setForm({ title: '', content: '', targetClassLevel: '' });
    else if (activeTab === 'announcements') setForm({ divisionId: '', content: '' });
    else if (activeTab === 'galleries') setForm({ title: '', eventDate: '', targetClassLevel: '' });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (activeTab === 'events') await communicationApi.createEvent(form);
      else if (activeTab === 'circulars') await communicationApi.createCircular({ ...form, targetClassLevel: form.targetClassLevel ? parseInt(form.targetClassLevel) : null });
      else if (activeTab === 'announcements') await communicationApi.createAnnouncement({ ...form, divisionId: form.divisionId ? parseInt(form.divisionId) : null, publishedByFacultyId: user?.id });
      else if (activeTab === 'galleries') await communicationApi.createGallery({ ...form, targetClassLevel: form.targetClassLevel ? parseInt(form.targetClassLevel) : null });
      setShowModal(false);
      loadData();
    } catch (err) { alert('Failed: ' + (err.response?.data?.message || err.message)); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      if (activeTab === 'events') await communicationApi.deleteEvent(id);
      else if (activeTab === 'circulars') await communicationApi.deleteCircular(id);
      else if (activeTab === 'announcements') await communicationApi.deleteAnnouncement(id);
      else if (activeTab === 'galleries') await communicationApi.deleteGallery(id);
      loadData();
    } catch (err) { alert('Failed to delete: ' + (err.response?.data?.message || err.message)); }
  };

  const handleApprove = async (id) => {
    try { await communicationApi.approveGallery(id, user?.id); loadData(); }
    catch (err) { alert('Failed to approve: ' + (err.response?.data?.message || err.message)); }
  };

  const columns = {
    events: [
      { key: 'title', label: 'Title' },
      { key: 'eventDate', label: 'Date' },
      { key: 'location', label: 'Location' },
    ],
    circulars: [
      { key: 'title', label: 'Title' },
      { key: 'targetAudience', label: 'Audience' },
      { key: 'createdAt', label: 'Published' },
    ],
    announcements: [
      { key: 'title', label: 'Title' },
      { key: 'body', label: 'Body' },
      { key: 'createdAt', label: 'Posted' },
    ],
    galleries: [
      { key: 'title', label: 'Title' },
      { key: 'status', label: 'Status' },
      { key: 'createdAt', label: 'Created' },
    ],
  };

  const cards = [
    { label: 'Calendar Events', value: activeTab === 'events' ? data.length : '—', icon: Calendar, color: 'bg-blue-500' },
    { label: 'Circulars', value: activeTab === 'circulars' ? data.length : '—', icon: FileText, color: 'bg-purple-500' },
    { label: 'Announcements', value: activeTab === 'announcements' ? data.length : '—', icon: Megaphone, color: 'bg-green-500' },
    { label: 'Galleries', value: activeTab === 'galleries' ? data.length : '—', icon: Image, color: 'bg-indigo-500' },
  ];

  if (isParent) {
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
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">School announcements and events for your child are available on the <strong>My Child</strong> page.</p>
        </div>
      </div>
    );
  }

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

      <div className="flex items-center gap-1 mb-4 bg-white rounded-xl border border-gray-200 p-1">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.key ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{TABS.find((t) => t.key === activeTab)?.label}</h2>
        {canManage && (
          <button onClick={handleOpenCreate} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" /> Add {TABS.find((t) => t.key === activeTab)?.label.slice(0, -1)}
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500 bg-gray-50">
              {columns[activeTab].map((col) => <th key={col.key} className="px-4 py-3 font-medium">{col.label}</th>)}
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={columns[activeTab].length + 1} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={columns[activeTab].length + 1} className="px-4 py-6 text-center text-gray-400">No {activeTab} found.</td></tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {columns[activeTab].map((col) => <td key={col.key} className="px-4 py-3 text-gray-700">{row[col.key] || '—'}</td>)}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {activeTab === 'galleries' && canApprove && row.status === 'PENDING' && (
                        <button onClick={() => handleApprove(row.id)} className="p-1.5 text-gray-400 hover:text-green-600 transition-colors" title="Approve">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button onClick={() => handleDelete(row.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={`Add ${TABS.find((t) => t.key === activeTab)?.label.slice(0, -1)}`}>
        <form onSubmit={handleSave} className="space-y-4">
          {activeTab === 'events' && (
            <>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Title</label><input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Event Date</label><input type="date" required value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Event Type</label><select required value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"><option value="HOLIDAY">Holiday</option><option value="EXAM">Exam</option><option value="PTM">PTM</option><option value="MILESTONE">Milestone</option><option value="OPERATIONAL">Operational</option></select></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            </>
          )}
          {activeTab === 'circulars' && (
            <>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Title</label><input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Target Class Level (optional)</label><input type="number" value={form.targetClassLevel} onChange={(e) => setForm({ ...form, targetClassLevel: e.target.value })} placeholder="e.g. 1, 2, 3" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Content</label><textarea required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            </>
          )}
          {activeTab === 'announcements' && (
            <>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Division ID (optional)</label><input type="number" value={form.divisionId} onChange={(e) => setForm({ ...form, divisionId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Content</label><textarea required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            </>
          )}
          {activeTab === 'galleries' && (
            <>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Title</label><input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Event Date</label><input type="date" required value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Target Class Level (optional)</label><input type="number" value={form.targetClassLevel} onChange={(e) => setForm({ ...form, targetClassLevel: e.target.value })} placeholder="e.g. 1, 2, 3" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            </>
          )}
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">{saving ? 'Saving...' : 'Create'}</button>
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
