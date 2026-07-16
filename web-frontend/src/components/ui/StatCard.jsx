export default function StatCard({ icon: Icon, label, value, iconBg, iconColor }) {
  return (
    <div className="rounded-xl p-5 bg-white border border-slate-200/80 transition-all duration-200 ease-in-out hover:border-slate-300 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-slate-900 text-3xl font-bold tracking-tight">{value}</p>
          <p className="text-slate-500 text-sm font-medium mt-1">{label}</p>
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconBg || 'bg-slate-100'}`}>
            <Icon className={`w-5 h-5 ${iconColor || 'text-slate-600'}`} strokeWidth={1.5} />
          </div>
        )}
      </div>
    </div>
  );
}
