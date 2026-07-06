import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import { Shield, KeyRound, UserCheck } from 'lucide-react';

export default function Safety() {
  const { user } = useAuth();
  const isParent = user?.role === 'PARENT';

  const cards = [
    { label: 'Active Gate Passes', value: '—', icon: KeyRound, color: 'bg-blue-500' },
    { label: 'Proxy Pickups Today', value: '—', icon: UserCheck, color: 'bg-green-500' },
    { label: 'Safety Alerts', value: '—', icon: Shield, color: 'bg-red-500' },
  ];

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

      {!isParent && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {['Create Gate Pass', 'Verify Gate Pass', 'Add Proxy Pickup', 'View Today\'s Pickups'].map((action) => (
              <button
                key={action}
                className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {isParent && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Safety information for your child is available on the <strong>My Child</strong> page.</p>
        </div>
      )}
    </div>
  );
}
