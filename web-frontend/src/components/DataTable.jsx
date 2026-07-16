import { SkeletonTable } from './ui/Skeleton';

export default function DataTable({ columns, data, loading, emptyMessage }) {
  if (loading) {
    return <SkeletonTable cols={columns?.length || 4} />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl theme-card p-12 text-center">
        <p className="text-sm theme-text-muted">{emptyMessage || 'No data available.'}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden theme-card animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-bottom-divider">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3.5 text-left font-semibold theme-text-muted whitespace-nowrap text-xs uppercase tracking-wider bg-sidebar-hover"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={row.id || i}
                className="theme-table-row border-bottom-divider"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5 theme-text whitespace-nowrap">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
