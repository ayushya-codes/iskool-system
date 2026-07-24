import { useEffect, useState } from 'react';
import { customizationApi } from '../api/customization';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import { Palette, Type, Globe, ToggleLeft, Upload, Tag, Trash2, Plus } from 'lucide-react';
import { Tabs, LoadingText } from '../components/ui';

export default function Settings() {
  const [tab, setTab] = useState('theme');
  const [cust, setCust] = useState(null);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newLabel, setNewLabel] = useState({ labelKey: '', labelValue: '', language: 'en' });

  useEffect(() => {
    Promise.all([
      customizationApi.getCustomization().catch(() => null),
      customizationApi.getAllLabels().catch(() => null),
    ]).then(([c, l]) => {
      if (c?.data) setCust(c.data);
      if (l?.data) setLabels(l.data);
      setLoading(false);
    });
  }, []);

  const saveCustomization = async (updates) => {
    setSaving(true);
    try {
      const res = await customizationApi.updateCustomization(updates);
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
      const res = await customizationApi.upsertLabel(newLabel);
      setLabels([...labels, res.data]);
      setNewLabel({ labelKey: '', labelValue: '', language: 'en' });
    } catch (err) {
      console.error('Failed to add label', err);
    }
  };

  const deleteLabel = async (id) => {
    try {
      await customizationApi.deleteLabel(id);
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
        <div className="rounded-xl theme-card p-12 text-center theme-text-muted flex items-center justify-center gap-2"><LoadingText /></div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="School Settings" subtitle="Customize your school's appearance and behavior" />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-56 shrink-0">
          <Tabs tabs={tabs} activeTab={tab} onChange={setTab} layout="sidebar" />
        </div>

        {/* Tab content */}
        <div className="flex-1 min-w-0">
          {tab === 'theme' && (
            <div className="rounded-xl theme-card p-6 space-y-4 animate-fade-in">
              <h2 className="text-lg font-semibold theme-text">Theme & Colors</h2>
              {[
                { key: 'accentColor', label: 'Accent Color' },
                { key: 'backgroundColor', label: 'Background Color' },
                { key: 'sidebarColor', label: 'Sidebar Color' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm font-medium theme-text">{label}</label>
                  <input
                    type="color"
                    defaultValue={cust?.[key] || '#4f46e5'}
                    onBlur={(e) => saveCustomization({ [key]: e.target.value })}
                    className="w-12 h-9 rounded-lg cursor-pointer theme-input"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium theme-text mb-1">CSS Overrides</label>
                <textarea
                  defaultValue={cust?.cssOverrides || ''}
                  onBlur={(e) => saveCustomization({ cssOverrides: e.target.value })}
                  rows={5}
                  className="w-full rounded-lg px-3 py-2 text-sm font-mono theme-input"
                  placeholder="/* Custom CSS here */"
                />
              </div>
            </div>
          )}

          {tab === 'fonts' && (
            <div className="rounded-xl theme-card p-6 space-y-4 animate-fade-in">
              <h2 className="text-lg font-semibold theme-text">Fonts & Locale</h2>
              {[
                { key: 'fontFamily', label: 'Body Font Family', placeholder: 'Inter, sans-serif' },
                { key: 'headingFontFamily', label: 'Heading Font Family', placeholder: 'Inter, sans-serif' },
                { key: 'dateFormat', label: 'Date Format', placeholder: 'dd-MM-yyyy' },
                { key: 'timeFormat', label: 'Time Format', placeholder: 'HH:mm' },
                { key: 'locale', label: 'Locale', placeholder: 'en' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium theme-text mb-1">{label}</label>
                  <input
                    type="text"
                    defaultValue={cust?.[key] || ''}
                    onBlur={(e) => saveCustomization({ [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full rounded-lg px-3 py-2 text-sm theme-input"
                  />
                </div>
              ))}
            </div>
          )}

          {tab === 'modules' && (
            <div className="rounded-xl theme-card p-6 space-y-3 animate-fade-in">
              <h2 className="text-lg font-semibold theme-text">Module Toggles</h2>
              <p className="text-sm theme-text-muted mb-4">Enable or disable modules for your school.</p>
              {[
                { key: 'enableFinance', label: 'Finance' },
                { key: 'enableHelpdesk', label: 'Helpdesk' },
                { key: 'enableInventory', label: 'Inventory' },
                { key: 'enableAlmanac', label: 'Almanac' },
                { key: 'enableCommunication', label: 'Communication' },
                { key: 'enableSafety', label: 'Safety' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between py-2 theme-divider last:border-0">
                  <span className="text-sm font-medium theme-text">{label}</span>
                  <input
                    type="checkbox"
                    defaultChecked={cust?.[key] ?? true}
                    onChange={(e) => saveCustomization({ [key]: e.target.checked })}
                    className="w-5 h-5 rounded cursor-pointer accent-color"
                  />
                </label>
              ))}
            </div>
          )}

          {tab === 'labels' && (
            <div className="rounded-xl theme-card p-6 animate-fade-in">
              <h2 className="text-lg font-semibold theme-text mb-4">Custom Labels</h2>
              <p className="text-sm theme-text-muted mb-4">Override default labels with your own terminology.</p>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Key (e.g. student)"
                  value={newLabel.labelKey}
                  onChange={(e) => setNewLabel({ ...newLabel, labelKey: e.target.value })}
                  className="flex-1 rounded-lg px-3 py-2 text-sm theme-input"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. Learner)"
                  value={newLabel.labelValue}
                  onChange={(e) => setNewLabel({ ...newLabel, labelValue: e.target.value })}
                  className="flex-1 rounded-lg px-3 py-2 text-sm theme-input"
                />
                <select
                  value={newLabel.language}
                  onChange={(e) => setNewLabel({ ...newLabel, language: e.target.value })}
                  className="rounded-lg px-3 py-2 text-sm theme-input cursor-pointer"
                >
                  <option value="en">EN</option>
                  <option value="hi">HI</option>
                </select>
                <button
                  onClick={addLabel}
                  className="inline-flex items-center gap-1 rounded-lg gradient-bg-hover px-3 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] shadow-glow"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="divide-y theme-divider">
                {labels.length === 0 ? (
                  <p className="text-sm theme-text-muted py-4 text-center">No custom labels yet.</p>
                ) : (
                  labels.map((l) => (
                    <div key={l.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono theme-text-muted">{l.labelKey}</span>
                        <span className="theme-text-faint">→</span>
                        <span className="text-sm font-medium theme-text">{l.labelValue}</span>
                        <span className="theme-badge">{l.language}</span>
                      </div>
                      <button
                        onClick={() => deleteLabel(l.id)}
                        className="theme-text-faint hover:opacity-70 transition-opacity"
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = ''}
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
            <div className="rounded-xl theme-card p-6 animate-fade-in">
              <h2 className="text-lg font-semibold theme-text mb-4">Asset Upload</h2>
              <p className="text-sm theme-text-muted mb-4">Upload logos, favicons, banners, and other assets to S3.</p>
              <AssetUpload />
            </div>
          )}
        </div>
      </div>
      {saving && (
        <div className="fixed bottom-4 right-4 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg gradient-bg animate-slide-in-left">
          Saving...
        </div>
      )}
    </div>
  );
}

function AssetUpload() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    customizationApi.getAllAssets().then((res) => setAssets(res.data)).catch(() => {});
  }, []);

  const handleUpload = async (e, assetType) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('assetType', assetType);
      formData.append('uploadedByUserId', user?.id);
      const res = await customizationApi.uploadAsset(formData);
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
            className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] theme-input"
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--input-border)'}
          >
            <Upload className="w-5 h-5 theme-text-faint" />
            <span className="text-xs font-medium theme-text-muted">{type.replace(/_/g, ' ')}</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleUpload(e, type)}
              disabled={uploading}
            />
          </label>
        ))}
      </div>
      {uploading && <p className="text-sm theme-accent flex items-center gap-2"><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Uploading...</p>}
      {assets.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold theme-text mb-2">Uploaded Assets</h3>
          <div className="space-y-2">
            {assets.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg theme-card px-3 py-2">
                <div className="flex items-center gap-3">
                  <span className="theme-badge">{a.assetType}</span>
                  <span className="text-sm theme-text truncate max-w-xs">{a.originalFilename}</span>
                </div>
                <a
                  href={a.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs theme-accent hover:underline"
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
