import PageHeader from '../components/PageHeader';
import DataTable from './DataTable';
import { Plus } from 'lucide-react';

export default function ModulePage({ title, subtitle, columns, data, loading, onAdd, addLabel }) {
  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={
          onAdd && (
            <button
              onClick={onAdd}
              className="inline-flex items-center gap-2 rounded-lg gradient-bg-hover px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] focus-ring shadow-glow"
            >
              <Plus className="w-4 h-4" />
              {addLabel || 'Add New'}
            </button>
          )
        }
      />
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage={`No ${title.toLowerCase()} found. Click "${addLabel || 'Add New'}" to create one.`}
      />
    </div>
  );
}
