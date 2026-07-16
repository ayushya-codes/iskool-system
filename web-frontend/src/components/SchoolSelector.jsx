import { useEffect, useState } from 'react';
import { schoolApi } from '../api/school';
import { Building2, ChevronDown } from 'lucide-react';

export default function SchoolSelector() {
  const [schools, setSchools] = useState([]);
  const [selectedId, setSelectedId] = useState(localStorage.getItem('iskool_selected_school_id') || '');
  const [selectedName, setSelectedName] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    schoolApi.getAll()
      .then((res) => {
        setSchools(res.data);
        const saved = localStorage.getItem('iskool_selected_school_id');
        if (saved) {
          const school = res.data.find((s) => s.id === parseInt(saved));
          if (school) setSelectedName(school.name);
        }
      })
      .catch(() => setSchools([]));
  }, []);

  const handleSelect = (school) => {
    localStorage.setItem('iskool_selected_school_id', school.id);
    setSelectedId(school.id);
    setSelectedName(school.name);
    setOpen(false);
    window.location.reload();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors bg-sidebar-hover text-main"
      >
        <Building2 className="w-4 h-4 text-accent-c" />
        <span className="max-w-[140px] truncate">
          {selectedName || 'Select School'}
        </span>
        <ChevronDown className="w-4 h-4 theme-text-muted" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-64 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto theme-panel">
            {schools.length === 0 ? (
              <div className="px-3 py-2 text-sm theme-text-muted">No schools found</div>
            ) : (
              schools.map((school) => (
                <button
                  key={school.id}
                  onClick={() => handleSelect(school)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    selectedId === String(school.id) ? 'font-medium' : ''
                  }`}
                  style={{
                    background: selectedId === String(school.id) ? 'color-mix(in srgb, var(--accent-primary) 10%, transparent)' : 'transparent',
                    color: selectedId === String(school.id) ? 'var(--accent-primary)' : 'var(--text-main)',
                  }}
                >
                  {school.name}
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
