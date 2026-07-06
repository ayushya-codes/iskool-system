import PageHeader from '../components/PageHeader';
import { LifeBuoy, MessageSquare, CheckCircle } from 'lucide-react';

export default function Helpdesk() {
  const cards = [
    { label: 'Open Tickets', value: '—', icon: LifeBuoy, color: 'bg-amber-500' },
    { label: 'Resolved', value: '—', icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Total Replies', value: '—', icon: MessageSquare, color: 'bg-blue-500' },
  ];

  return (
    <div>
      <PageHeader title="Helpdesk" subtitle="Support tickets and replies" />
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
    </div>
  );
}
