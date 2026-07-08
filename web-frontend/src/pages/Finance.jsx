import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { financeApi } from '../api/finance';
import { academicApi } from '../api/academic';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { Plus, Trash2, DollarSign, FileText, CreditCard, Receipt } from 'lucide-react';

const CAN_MANAGE = ['SUPER_ADMIN', 'PRINCIPAL', 'CLERK', 'SCHOOL_TRUSTEE'];
const CAN_DELETE = ['SUPER_ADMIN'];

const TABS = [
  { key: 'feeStructures', label: 'Fee Structures' },
  { key: 'invoices', label: 'Invoices' },
  { key: 'payments', label: 'Payments' },
  { key: 'receipts', label: 'Receipts' },
];

export default function Finance() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('feeStructures');
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const canManage = user && CAN_MANAGE.includes(user.role);
  const canDelete = user && CAN_DELETE.includes(user.role);

  useEffect(() => {
    Promise.all([
      academicApi.getAllBatches().catch(() => ({ data: [] })),
      academicApi.getAllClasses().catch(() => ({ data: [] })),
    ]).then(([bRes, cRes]) => {
      setBatches(bRes.data || []);
      setClasses(cRes.data || []);
      const active = (bRes.data || []).find((b) => b.isActive);
      if (active) setSelectedBatch(active.id);
    });
  }, []);

  const loadData = useCallback(() => {
    if (!selectedBatch) { setData([]); setLoading(false); return; }
    setLoading(true);
    let promise;
    if (activeTab === 'feeStructures') promise = financeApi.getFeeStructuresByBatch(selectedBatch);
    else if (activeTab === 'invoices') promise = financeApi.getInvoicesByBatch(selectedBatch);
    else if (activeTab === 'payments') {
      promise = financeApi.getInvoicesByBatch(selectedBatch).then(async (invRes) => {
        const invoices = invRes.data || [];
        const allPayments = [];
        for (const inv of invoices) {
          try {
            const payRes = await financeApi.getPaymentsByInvoice(inv.id);
            allPayments.push(...(payRes.data || []));
          } catch {}
        }
        return { data: allPayments };
      });
    } else if (activeTab === 'receipts') {
      promise = financeApi.getInvoicesByBatch(selectedBatch).then(async (invRes) => {
        const invoices = invRes.data || [];
        const allReceipts = [];
        for (const inv of invoices) {
          try {
            const payRes = await financeApi.getPaymentsByInvoice(inv.id);
            for (const pay of (payRes.data || [])) {
              try {
                const recRes = await financeApi.getReceiptByPayment(pay.id);
                if (recRes.data) allReceipts.push(recRes.data);
              } catch {}
            }
          } catch {}
        }
        return { data: allReceipts };
      });
    }
    promise.then((res) => setData(res.data || [])).catch(() => setData([])).finally(() => setLoading(false));
  }, [activeTab, selectedBatch]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleOpenCreate = () => {
    if (activeTab === 'feeStructures') setForm({ classId: '', batchId: selectedBatch, feeType: 'TUITION', amount: '' });
    else if (activeTab === 'invoices') setForm({ studentId: '', batchId: selectedBatch, feeStructureId: '', dueDate: '' });
    else if (activeTab === 'payments') setForm({ invoiceId: '', amount: '', paymentMethod: 'CASH', transactionRef: '' });
    else if (activeTab === 'receipts') setForm({ paymentId: '' });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (activeTab === 'feeStructures') await financeApi.createFeeStructure({ ...form, amount: parseFloat(form.amount) });
      else if (activeTab === 'invoices') await financeApi.createInvoice({ ...form, studentId: parseInt(form.studentId) });
      else if (activeTab === 'payments') await financeApi.recordPayment({ ...form, amount: parseFloat(form.amount) });
      else if (activeTab === 'receipts') await financeApi.generateReceipt({ paymentId: parseInt(form.paymentId) });
      setShowModal(false);
      loadData();
    } catch (err) { alert('Failed: ' + (err.response?.data?.message || err.message)); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      if (activeTab === 'feeStructures') await financeApi.deleteFeeStructure(id);
      loadData();
    } catch (err) { alert('Failed to delete: ' + (err.response?.data?.message || err.message)); }
  };

  const columns = {
    feeStructures: [
      { key: 'feeType', label: 'Fee Type' },
      { key: 'amount', label: 'Amount' },
      { key: 'frequency', label: 'Frequency' },
      { key: 'className', label: 'Class' },
    ],
    invoices: [
      { key: 'id', label: 'Invoice #' },
      { key: 'studentName', label: 'Student' },
      { key: 'totalAmount', label: 'Amount' },
      { key: 'status', label: 'Status' },
      { key: 'dueDate', label: 'Due Date' },
    ],
    payments: [
      { key: 'id', label: 'Payment #' },
      { key: 'invoiceId', label: 'Invoice #' },
      { key: 'amount', label: 'Amount' },
      { key: 'paymentMethod', label: 'Method' },
      { key: 'paymentDate', label: 'Date' },
    ],
    receipts: [
      { key: 'id', label: 'Receipt #' },
      { key: 'paymentId', label: 'Payment #' },
      { key: 'receiptNumber', label: 'Receipt No.' },
      { key: 'generatedAt', label: 'Generated At' },
    ],
  };

  const cards = [
    { label: 'Fee Structures', value: data.length, icon: DollarSign, color: 'bg-blue-500' },
    { label: activeTab === 'invoices' ? 'Invoices' : 'Total Invoices', value: activeTab === 'invoices' ? data.length : '—', icon: FileText, color: 'bg-purple-500' },
    { label: 'Payments', value: activeTab === 'payments' ? data.length : '—', icon: CreditCard, color: 'bg-green-500' },
    { label: 'Receipts', value: activeTab === 'receipts' ? data.length : '—', icon: Receipt, color: 'bg-amber-500' },
  ];

  return (
    <div>
      <PageHeader title="Finance" subtitle="Manage fee structures, invoices, payments, and receipts" />

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
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.key ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Select Batch</option>
          {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
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
              {canDelete && activeTab === 'feeStructures' && <th className="px-4 py-3 font-medium text-right">Actions</th>}
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
                  {canDelete && activeTab === 'feeStructures' && (
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(row.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={`Add ${TABS.find((t) => t.key === activeTab)?.label.slice(0, -1)}`}>
        <form onSubmit={handleSave} className="space-y-4">
          {activeTab === 'feeStructures' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Class</label>
                <select required value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select Class</option>
                  {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Fee Type</label>
                <select required value={form.feeType} onChange={(e) => setForm({ ...form, feeType: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="TUITION">Tuition</option>
                  <option value="BUS">Bus</option>
                  <option value="LAB">Lab</option>
                  <option value="EXAM">Exam</option>
                  <option value="MISC">Misc</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Amount</label>
                <input type="number" step="0.01" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </>
          )}
          {activeTab === 'invoices' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Student ID</label>
                <input type="number" required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Fee Structure ID (optional)</label>
                <input type="number" value={form.feeStructureId} onChange={(e) => setForm({ ...form, feeStructureId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Due Date</label>
                <input type="date" required value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </>
          )}
          {activeTab === 'payments' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Invoice ID</label>
                <input type="number" required value={form.invoiceId} onChange={(e) => setForm({ ...form, invoiceId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Amount</label>
                <input type="number" step="0.01" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Payment Method</label>
                <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="ONLINE">Online</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Transaction Reference</label>
                <input type="text" value={form.transactionRef} onChange={(e) => setForm({ ...form, transactionRef: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </>
          )}
          {activeTab === 'receipts' && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Payment ID</label>
              <input type="number" required value={form.paymentId} onChange={(e) => setForm({ ...form, paymentId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Create'}
            </button>
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
