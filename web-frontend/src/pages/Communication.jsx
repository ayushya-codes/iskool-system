import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { communicationApi } from '../api/communication';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { Megaphone, Calendar, Image, FileText, Plus, Trash2, CheckCircle } from 'lucide-react';
import { LoadingText, Tabs, FormField, FormActions } from '../components/ui';

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
    { label: 'Calendar Events', value: activeTab === 'events' ? data.length : '—', icon: Calendar, color: '[color-mix(in_srgb,var(--info)_10%,transparent)]0' },
    { label: 'Circulars', value: activeTab === 'circulars' ? data.length : '—', icon: FileText, color: '[color-mix(in_srgb,var(--accent-secondary)_10%,transparent)]0' },
    { label: 'Announcements', value: activeTab === 'announcements' ? data.length : '—', icon: Megaphone, color: '[color-mix(in_srgb,var(--success)_10%,transparent)]0' },
    { label: 'Galleries', value: activeTab === 'galleries' ? data.length : '—', icon: Image, color: 'gradient-bg' },
  ];

  if (isParent) {
    return (
      <div>
        <PageHeader title="Communication" subtitle="Calendar events, circulars, announcements, and media" />
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
        <div className="rounded-xl theme-card p-6">
          <p className="text-sm theme-text-muted">School announcements and events for your child are available on the <strong>My Child</strong> page.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Communication" subtitle="Calendar events, circulars, announcements, and media" />

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

      <Tabs tabs={TABS.map(t => ({ id: t.key, label: t.label }))} activeTab={activeTab} onChange={setActiveTab} layout="sidebar" />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold theme-text">{TABS.find((t) => t.key === activeTab)?.label}</h2>
        {canManage && (
          <button onClick={handleOpenCreate} className="inline-flex items-center gap-2 rounded-lg gradient-bg px-4 py-2 text-sm font-semibold text-white gradient-bg-hover transition-colors">
            <Plus className="w-4 h-4" /> Add {TABS.find((t) => t.key === activeTab)?.label.slice(0, -1)}
          </button>
        )}
      </div>

      <div className="rounded-xl theme-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b [var(--divider)] text-left theme-text-muted [var(--sidebar-hover-bg)]">
              {columns[activeTab].map((col) => <th key={col.key} className="px-4 py-3 font-medium">{col.label}</th>)}
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y theme-divider">
            {loading ? (
              <tr><td colSpan={columns[activeTab].length + 1} className="px-4 py-6"><LoadingText /></td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={columns[activeTab].length + 1} className="px-4 py-6 text-center theme-text-faint">No {activeTab} found.</td></tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:[var(--sidebar-hover-bg)] transition-colors">
                  {columns[activeTab].map((col) => <td key={col.key} className="px-4 py-3 theme-text">{row[col.key] || '—'}</td>)}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {activeTab === 'galleries' && canApprove && row.status === 'PENDING' && (
                        <button onClick={() => handleApprove(row.id)} className="p-1.5 theme-text-faint hover:[color:var(--success)] transition-colors" title="Approve">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button onClick={() => handleDelete(row.id)} className="p-1.5 theme-text-faint hover:[color:var(--danger)] transition-colors" title="Delete">
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
              <FormField label="Title"><input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" /></FormField>
              <FormField label="Event Date"><input type="date" required value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" /></FormField>
              <FormField label="Event Type"><select required value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring"><option value="HOLIDAY">Holiday</option><option value="EXAM">Exam</option><option value="PTM">PTM</option><option value="MILESTONE">Milestone</option><option value="OPERATIONAL">Operational</option></select></FormField>
              <FormField label="Description"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" /></FormField>
            </>
          )}
          {activeTab === 'circulars' && (
            <>
              <FormField label="Title"><input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" /></FormField>
              <FormField label="Target Class Level (optional)"><input type="number" value={form.targetClassLevel} onChange={(e) => setForm({ ...form, targetClassLevel: e.target.value })} placeholder="e.g. 1, 2, 3" className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" /></FormField>
              <FormField label="Content"><textarea required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={3} className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" /></FormField>
            </>
          )}
          {activeTab === 'announcements' && (
            <>
              <FormField label="Division ID (optional)"><input type="number" value={form.divisionId} onChange={(e) => setForm({ ...form, divisionId: e.target.value })} className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" /></FormField>
              <FormField label="Content"><textarea required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={3} className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" /></FormField>
            </>
          )}
          {activeTab === 'galleries' && (
            <>
              <FormField label="Title"><input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" /></FormField>
              <FormField label="Event Date"><input type="date" required value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" /></FormField>
              <FormField label="Target Class Level (optional)"><input type="number" value={form.targetClassLevel} onChange={(e) => setForm({ ...form, targetClassLevel: e.target.value })} placeholder="e.g. 1, 2, 3" className="w-full rounded-lg theme-input px-3 py-2 text-sm focus-ring" /></FormField>
            </>
          )}
          <FormActions onSubmit={handleSave} onCancel={() => setShowModal(false)} submitLabel="Create" submitting={saving} />
        </form>
      </Modal>
    </div>
  );
}
