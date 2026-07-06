import { useEffect, useState } from 'react';
import api from '../api/client';
import PageHeader from '../components/PageHeader';
import { Palette, Type, Globe, ToggleLeft, Upload, Tag, Trash2, Plus } from 'lucide-react';

export default function Settings() {
  const [tab, setTab] = useState('theme');
  const [cust, setCust] = useState(null);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newLabel, setNewLabel] = useState({ labelKey: '', labelValue: '', language: 'en' });

  useEffect(() => {
    Promise.all([
      api.get('/school/customization').catch(() => null),
      api.get('/school/labels').catch(() => null),
    ]).then(([c, l]) => {
      if (c?.data) setCust(c.data);
      if (l?.data) setLabels(l.data);
      setLoading(false);
    });
  }, []);

  const saveCustomization = async (updates) => {
    setSaving(true);
    try {
      const res = await api.put('/school/customization', updates);
      setCust(res.data);
    } catch (err) {
      console.error('Failed to save', err);
    } finally {
      setSaving(false);
    }
  };

  const addLabel = async () => {
    if (!newLabel.labelKey || !newLabel.labelValue) return;
    try {
      const res = await api.post('/school/labels', newLabel);
      setLabels([...labels, res.data]);
      setNewLabel({ labelKey: '', labelValue: '', language: 'en' });
    } catch (err) {
      console.error('Failed to add label', err);
    }
  };

  const deleteLabel = async (id) => {
    try {
      await api.delete(`/school/labels/${id}`);
      setLabels(labels.filter((l) => l.id !== id));
    } catch (err) {
      console.error('Failed to delete label', err);
    }
  };

  const tabs = [
    { key: 'theme', label: 'Theme & Colors', icon: Palette },
    { key: 'fonts', label: 'Fonts & Locale', icon: Type },
    { key: 'modules', label: 'Module Toggles', icon: ToggleLeft },
    { key: 'labels', label: 'Custom Labels', icon: Tag },
    { key: 'assets', label: 'Asset Upload', icon: Upload },
  ];

  if (loading) {
    return (
      <div>
        <PageHeader title="School Settings" subtitle="Customize your school's appearance and behavior" />
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="School Settings" subtitle="Customize your school's appearance and behavior" />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-56 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-2 flex lg:flex-col gap-1 overflow-x-auto">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  tab === key ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 min-w-0">
          {tab === 'theme' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Theme & Colors</h2>
              {[
                { key: 'accentColor', label: 'Accent Color' },
                { key: 'backgroundColor', label: 'Background Color' },
                { key: 'sidebarColor', label: 'Sidebar Color' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">{label}</label>
                  <input
                    type="color"
                    defaultValue={cust?.[key] || '#4f46e5'}
                    onBlur={(e) => saveCustomization({ [key]: e.target.value })}
                    className="w-12 h-9 rounded border border-gray-300 cursor-pointer"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CSS Overrides</label>
                <textarea
                  defaultValue={cust?.cssOverrides || ''}
                  onBlur={(e) => saveCustomization({ cssOverrides: e.target.value })}
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="/* Custom CSS here */"
                />
              </div>
            </div>
          )}

          {tab === 'fonts' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Fonts & Locale</h2>
              {[
                { key: 'fontFamily', label: 'Body Font Family', placeholder: 'Inter, sans-serif' },
                { key: 'headingFontFamily', label: 'Heading Font Family', placeholder: 'Inter, sans-serif' },
                { key: 'dateFormat', label: 'Date Format', placeholder: 'dd-MM-yyyy' },
                { key: 'timeFormat', label: 'Time Format', placeholder: 'HH:mm' },
                { key: 'locale', label: 'Locale', placeholder: 'en' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="text"
                    defaultValue={cust?.[key] || ''}
                    onBlur={(e) => saveCustomization({ [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          )}

          {tab === 'modules' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Module Toggles</h2>
              <p className="text-sm text-gray-500 mb-4">Enable or disable modules for your school.</p>
              {[
                { key: 'enableFinance', label: 'Finance' },
                { key: 'enableHelpdesk', label: 'Helpdesk' },
                { key: 'enableInventory', label: 'Inventory' },
                { key: 'enableAlmanac', label: 'Almanac' },
                { key: 'enableCommunication', label: 'Communication' },
                { key: 'enableSafety', label: 'Safety' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  <input
                    type="checkbox"
                    defaultChecked={cust?.[key] ?? true}
                    onChange={(e) => saveCustomization({ [key]: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              ))}
            </div>
          )}

          {tab === 'labels' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Custom Labels</h2>
              <p className="text-sm text-gray-500 mb-4">Override default labels with your own terminology.</p>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Key (e.g. student)"
                  value={newLabel.labelKey}
                  onChange={(e) => setNewLabel({ ...newLabel, labelKey: e.target.value })}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. Learner)"
                  value={newLabel.labelValue}
                  onChange={(e) => setNewLabel({ ...newLabel, labelValue: e.target.value })}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={newLabel.language}
                  onChange={(e) => setNewLabel({ ...newLabel, language: e.target.value })}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="en">EN</option>
                  <option value="hi">HI</option>
                </select>
                <button
                  onClick={addLabel}
                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {labels.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4 text-center">No custom labels yet.</p>
                ) : (
                  labels.map((l) => (
                    <div key={l.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-gray-500">{l.labelKey}</span>
                        <span className="text-gray-300">→</span>
                        <span className="text-sm font-medium text-gray-900">{l.labelValue}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{l.language}</span>
                      </div>
                      <button
                        onClick={() => deleteLabel(l.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {tab === 'assets' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Asset Upload</h2>
              <p className="text-sm text-gray-500 mb-4">Upload logos, favicons, banners, and other assets to S3.</p>
              <AssetUpload />
            </div>
          )}
        </div>
      </div>
      {saving && (
        <div className="fixed bottom-4 right-4 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          Saving...
        </div>
      )}
    </div>
  );
}

function AssetUpload() {
  const [uploading, setUploading] = useState(false);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    api.get('/school/assets').then((res) => setAssets(res.data)).catch(() => {});
  }, []);

  const handleUpload = async (e, assetType) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('assetType', assetType);
      formData.append('uploadedByUserId', '1');
      const res = await api.post('/school/assets/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAssets([res.data, ...assets]);
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  const types = ['LOGO', 'FAVICON', 'BANNER', 'REPORT_CARD_LOGO', 'CSS', 'MISC'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {types.map((type) => (
          <label
            key={type}
            className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 p-4 cursor-pointer hover:border-indigo-400 transition-colors"
          >
            <Upload className="w-5 h-5 text-gray-400" />
            <span className="text-xs font-medium text-gray-600">{type.replace(/_/g, ' ')}</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleUpload(e, type)}
              disabled={uploading}
            />
          </label>
        ))}
      </div>
      {uploading && <p className="text-sm text-indigo-600">Uploading...</p>}
      {assets.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Uploaded Assets</h3>
          <div className="space-y-2">
            {assets.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{a.assetType}</span>
                  <span className="text-sm text-gray-700 truncate max-w-xs">{a.originalFilename}</span>
                </div>
                <a
                  href={a.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 hover:underline"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
