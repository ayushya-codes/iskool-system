import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { safetyApi } from '../api/safety';
import { studentApi } from '../api/student';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { Shield, KeyRound, UserCheck, Plus, QrCode, Download, User } from 'lucide-react';

const CAN_CREATE_PASS = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'FACULTY', 'PARENT'];
const CAN_VERIFY = ['SUPER_ADMIN', 'PRINCIPAL', 'GATE_KEEPER'];
const CAN_PROXY = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'PARENT'];

const TABS = [
  { key: 'gatePasses', label: 'Gate Passes' },
  { key: 'proxyPickups', label: 'Proxy Pickups' },
];

export default function Safety() {
  const { user } = useAuth();
  const isParent = user?.role === 'PARENT';
  const [activeTab, setActiveTab] = useState('gatePasses');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [children, setChildren] = useState([]);
  const [qrPass, setQrPass] = useState(null);

  const canCreatePass = CAN_CREATE_PASS.includes(user?.role);
  const canVerify = CAN_VERIFY.includes(user?.role);
  const canProxy = CAN_PROXY.includes(user?.role);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (isParent) {
      studentApi.getMyChildren().then((res) => {
        const d = res.data;
        if (Array.isArray(d)) setChildren(d);
        else if (d) setChildren([d]);
        else setChildren([]);
      }).catch(() => setChildren([]));
    }
  }, [isParent]);

  const loadData = useCallback(() => {
    setLoading(true);
    let promise;
    if (activeTab === 'gatePasses') {
      if (isParent && children.length > 0) {
        promise = Promise.all(children.map(c => safetyApi.getGatePassesByStudent(c.id).catch(() => ({ data: [] }))))
          .then(results => ({ data: results.flatMap(r => r.data || []) }));
      } else if (isParent) {
        promise = Promise.resolve({ data: [] });
      } else {
        promise = safetyApi.getProxyPickupsByDate(today).catch(() => ({ data: [] }));
      }
    } else {
      if (isParent && children.length > 0) {
        promise = Promise.all(children.map(c => safetyApi.getProxyPickupsByStudent(c.id).catch(() => ({ data: [] }))))
          .then(results => ({ data: results.flatMap(r => r.data || []) }));
      } else if (isParent) {
        promise = Promise.resolve({ data: [] });
      } else {
        promise = safetyApi.getProxyPickupsByDate(today).catch(() => ({ data: [] }));
      }
    }
    promise.then((res) => setData(res.data || [])).catch(() => setData([])).finally(() => setLoading(false));
  }, [activeTab, isParent, children, today]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleOpenCreate = () => {
    if (activeTab === 'gatePasses') {
      setForm({ studentId: isParent && children.length === 1 ? children[0].id : '', validDate: today, pickupPersonName: '', pickupPersonPhone: '', relationship: '', reason: '' });
    } else {
      setForm({ studentId: isParent && children.length === 1 ? children[0].id : '', proxyPersonName: '', proxyPersonPhone: '', validDate: today, relationship: '' });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (activeTab === 'gatePasses') {
        const res = await safetyApi.createGatePass({ ...form, studentId: parseInt(form.studentId) });
        setShowModal(false);
        setQrPass(res.data);
        loadData();
      } else {
        await safetyApi.createProxyPickup({ ...form, studentId: parseInt(form.studentId) });
        setShowModal(false);
        loadData();
      }
    } catch (err) { alert('Failed: ' + (err.response?.data?.message || err.message)); }
    finally { setSaving(false); }
  };

  const handleVerify = async () => {
    try {
      const res = await safetyApi.verifyGatePass(verifyCode, today);
      setVerifyResult(res.data);
    } catch (err) {
      setVerifyResult({ error: true, message: err.response?.data?.message || 'Verification failed' });
    }
  };

  const downloadQR = (pass) => {
    if (!pass.qrCodeBase64) return;
    const link = document.createElement('a');
    link.download = `gate-pass-${pass.passCode}.png`;
    link.href = pass.qrCodeBase64;
    link.click();
  };

  const cards = [
    { label: 'Gate Passes', value: activeTab === 'gatePasses' ? data.length : '—', icon: KeyRound, color: 'bg-blue-500' },
    { label: 'Proxy Pickups Today', value: activeTab === 'proxyPickups' ? data.length : '—', icon: UserCheck, color: 'bg-green-500' },
    { label: 'Safety Alerts', value: '—', icon: Shield, color: 'bg-red-500' },
  ];

  const columns = {
    gatePasses: [
      { key: 'studentName', label: 'Student' },
      { key: 'passCode', label: 'Pass Code' },
      { key: 'pickupPersonName', label: 'Pickup Person' },
      { key: 'relationship', label: 'Relationship' },
      { key: 'validDate', label: 'Valid Date' },
      { key: 'isUsed', label: 'Status' },
    ],
    proxyPickups: [
      { key: 'studentName', label: 'Student' },
      { key: 'pickupPersonName', label: 'Proxy Person' },
      { key: 'validDate', label: 'Date' },
    ],
  };

  return (
    <div>
      <PageHeader title="Safety" subtitle="Gate passes and proxy pickup management" />

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

      <div className="flex items-center gap-1 mb-4 bg-white rounded-xl border border-gray-200 p-1">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.key ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {canVerify && activeTab === 'gatePasses' && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Verify Gate Pass</h3>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Enter pass code" value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <button onClick={handleVerify} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">Verify</button>
          </div>
          {verifyResult && (
            <div className={`mt-4 p-4 rounded-lg ${verifyResult.error ? 'bg-red-50 text-red-700' : 'bg-green-50'}`}>
              {verifyResult.error ? (
                <p className="text-sm">{verifyResult.message}</p>
              ) : (
                <div className="flex gap-4">
                  <div className="shrink-0">
                    {verifyResult.studentPhotoUrl ? (
                      <img src={verifyResult.studentPhotoUrl} alt="Student" className="w-20 h-20 rounded-lg object-cover border border-gray-300" />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center border border-gray-300">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-gray-900">{verifyResult.studentName || `Student #${verifyResult.studentId}`}</h4>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Verified</span>
                    </div>
                    {verifyResult.studentDateOfBirth && <p className="text-xs text-gray-600">DOB: {verifyResult.studentDateOfBirth}</p>}
                    {verifyResult.studentGender && <p className="text-xs text-gray-600">Gender: {verifyResult.studentGender}</p>}
                    <div className="border-t border-gray-200 pt-1.5 mt-1.5">
                      <p className="text-xs font-semibold text-gray-700">Pickup Person:</p>
                      <p className="text-sm text-gray-900">{verifyResult.pickupPersonName || '—'}</p>
                      {verifyResult.relationship && <p className="text-xs text-gray-600">Relationship: {verifyResult.relationship}</p>}
                      {verifyResult.pickupPersonPhone && <p className="text-xs text-gray-600">Phone: {verifyResult.pickupPersonPhone}</p>}
                      {verifyResult.reason && <p className="text-xs text-gray-600">Reason: {verifyResult.reason}</p>}
                    </div>
                    <p className="text-xs text-gray-500">Pass Code: <span className="font-mono font-semibold">{verifyResult.passCode}</span> | Valid: {verifyResult.validDate}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{TABS.find((t) => t.key === activeTab)?.label}</h2>
        {((activeTab === 'gatePasses' && canCreatePass) || (activeTab === 'proxyPickups' && canProxy)) && (
          <button onClick={handleOpenCreate} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" /> Create {activeTab === 'gatePasses' ? 'Gate Pass' : 'Proxy Pickup'}
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500 bg-gray-50">
              {columns[activeTab].map((col) => <th key={col.key} className="px-4 py-3 font-medium">{col.label}</th>)}
              {activeTab === 'gatePasses' && <th className="px-4 py-3 font-medium text-center">QR</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={columns[activeTab].length + 1} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={columns[activeTab].length + 1} className="px-4 py-6 text-center text-gray-400">No {activeTab === 'gatePasses' ? 'gate passes' : 'proxy pickups'} found.</td></tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {columns[activeTab].map((col) => (
                    <td key={col.key} className="px-4 py-3 text-gray-700">
                      {col.key === 'isUsed' ? (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.isUsed ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                          {row.isUsed ? 'Used' : 'Active'}
                        </span>
                      ) : (row[col.key] || '—')}
                    </td>
                  ))}
                  {activeTab === 'gatePasses' && (
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => setQrPass(row)} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-xs font-medium">
                        <QrCode className="w-4 h-4" /> View QR
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={activeTab === 'gatePasses' ? 'Create Gate Pass' : 'Create Proxy Pickup'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Student</label>
            {isParent ? (
              <select required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select your child</option>
                {(Array.isArray(children) ? children : []).map((c) => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
              </select>
            ) : (
              <input type="number" required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} placeholder="Enter student ID" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            )}
          </div>
          <div><label className="block text-xs font-medium text-gray-500 mb-1">Valid Date</label><input type="date" required value={form.validDate} onChange={(e) => setForm({ ...form, validDate: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
          {activeTab === 'gatePasses' && (
            <>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Pickup Person Name</label><input type="text" required value={form.pickupPersonName} onChange={(e) => setForm({ ...form, pickupPersonName: e.target.value })} placeholder="Who will pick up the child?" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Pickup Person Phone</label><input type="text" value={form.pickupPersonPhone} onChange={(e) => setForm({ ...form, pickupPersonPhone: e.target.value })} placeholder="Phone number" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Relationship</label><input type="text" value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })} placeholder="e.g. Mother, Father, Uncle" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Reason (optional)</label><input type="text" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="e.g. Doctor appointment" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            </>
          )}
          {activeTab === 'proxyPickups' && (
            <>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Proxy Person Name</label><input type="text" required value={form.proxyPersonName} onChange={(e) => setForm({ ...form, proxyPersonName: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Proxy Person Phone</label><input type="text" value={form.proxyPersonPhone} onChange={(e) => setForm({ ...form, proxyPersonPhone: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Relationship</label><input type="text" value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })} placeholder="e.g. Uncle, Grandparent" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            </>
          )}
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">{saving ? 'Saving...' : 'Create'}</button>
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
          </div>
        </form>
      </Modal>

      {/* QR Code Modal */}
      <Modal open={!!qrPass} onClose={() => setQrPass(null)} title="Gate Pass QR Code" maxWidth="max-w-md">
        {qrPass && (
          <div className="flex flex-col items-center gap-4">
            {qrPass.qrCodeBase64 ? (
              <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                <img src={qrPass.qrCodeBase64} alt="Gate Pass QR Code" className="w-64 h-64" />
              </div>
            ) : (
              <p className="text-sm text-gray-500">QR code not available for this pass.</p>
            )}
            <div className="w-full bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Pass Code:</span><span className="font-mono font-semibold text-gray-900">{qrPass.passCode}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Student:</span><span className="font-medium text-gray-900">{qrPass.studentName || `#${qrPass.studentId}`}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Pickup Person:</span><span className="font-medium text-gray-900">{qrPass.pickupPersonName || '—'}</span></div>
              {qrPass.relationship && <div className="flex justify-between text-sm"><span className="text-gray-500">Relationship:</span><span className="font-medium text-gray-900">{qrPass.relationship}</span></div>}
              {qrPass.pickupPersonPhone && <div className="flex justify-between text-sm"><span className="text-gray-500">Phone:</span><span className="font-medium text-gray-900">{qrPass.pickupPersonPhone}</span></div>}
              <div className="flex justify-between text-sm"><span className="text-gray-500">Valid Date:</span><span className="font-medium text-gray-900">{qrPass.validDate}</span></div>
              {qrPass.reason && <div className="flex justify-between text-sm"><span className="text-gray-500">Reason:</span><span className="font-medium text-gray-900">{qrPass.reason}</span></div>}
              <div className="flex justify-between text-sm"><span className="text-gray-500">Status:</span><span className={`font-medium ${qrPass.isUsed ? 'text-gray-400' : 'text-green-600'}`}>{qrPass.isUsed ? 'Used' : 'Active'}</span></div>
            </div>
            {qrPass.qrCodeBase64 && (
              <button onClick={() => downloadQR(qrPass)} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
                <Download className="w-4 h-4" /> Download QR
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
