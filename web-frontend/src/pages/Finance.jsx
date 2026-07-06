import PageHeader from '../components/PageHeader';
import { DollarSign, FileText, CreditCard, Receipt } from 'lucide-react';

export default function Finance() {
  const cards = [
    { label: 'Total Revenue', value: '—', icon: DollarSign, color: 'bg-green-500' },
    { label: 'Pending Invoices', value: '—', icon: FileText, color: 'bg-amber-500' },
    { label: 'Payments', value: '—', icon: CreditCard, color: 'bg-blue-500' },
    { label: 'Receipts Issued', value: '—', icon: Receipt, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <PageHeader title="Finance" subtitle="Fee structures, invoices, payments, and receipts" />
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {['Create Fee Structure', 'Generate Invoice', 'Record Payment', 'Issue Receipt'].map((action) => (
            <button
              key={action}
              className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
