import { useEffect, useState } from 'react';
import api from '../api/client';
import { holidayApi } from '../api/holiday';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { CalendarCheck, FileText, UserX, UserCheck, CalendarDays, Plus, Trash2, Upload } from 'lucide-react';

const HOLIDAY_TYPE_COLORS = {
  PUBLIC: 'bg-blue-100 text-blue-700',
  SCHOOL: 'bg-purple-100 text-purple-700',
  RELIGIOUS: 'bg-amber-100 text-amber-700',
  NATIONAL: 'bg-green-100 text-green-700',
  BREAK: 'bg-rose-100 text-rose-700',
};

const CAN_MANAGE_HOLIDAYS = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'SUPERVISOR'];

export default function Attendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [holidays, setHolidays] = useState([]);
  const [holidayLoading, setHolidayLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ name: '', holidayDate: '', type: 'SCHOOL', description: '' });

  const canManage = user && CAN_MANAGE_HOLIDAYS.includes(user.role);

  useEffect(() => {
    api.get('/attendance/records')
      .then((res) => setRecords(res.data))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));

    holidayApi.getAll()
      .then((res) => setHolidays(res.data))
      .catch(() => setHolidays([]))
      .finally(() => setHolidayLoading(false));
  }, []);

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    try {
      const res = await holidayApi.create(newHoliday);
      setHolidays([...holidays, res.data].sort((a, b) => new Date(a.holidayDate) - new Date(b.holidayDate)));
      setNewHoliday({ name: '', holidayDate: '', type: 'SCHOOL', description: '' });
      setShowAddForm(false);
    } catch (err) {
      alert('Failed to add holiday');
    }
  };

  const handleDeleteHoliday = async (id) => {
    try {
      await holidayApi.delete(id);
      setHolidays(holidays.filter((h) => h.id !== id));
    } catch (err) {
      alert('Failed to delete holiday');
    }
  };

  const cards = [
    { label: 'Present Today', value: '—', icon: UserCheck, color: 'bg-green-500' },
    { label: 'Absent Today', value: '—', icon: UserX, color: 'bg-red-500' },
    { label: 'On Leave', value: '—', icon: FileText, color: 'bg-amber-500' },
    { label: 'Attendance Rate', value: '—', icon: CalendarCheck, color: 'bg-blue-500' },
  ];

  return (
    <div>
      <PageHeader title="Attendance" subtitle="Track and manage student attendance" />
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

      {/* Holiday Calendar Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-gray-500" />
            Holiday Calendar
          </h2>
          {canManage && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Holiday
            </button>
          )}
        </div>

        {showAddForm && canManage && (
          <form onSubmit={handleAddHoliday} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              <input
                type="text"
                placeholder="Holiday Name"
                value={newHoliday.name}
                onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={newHoliday.holidayDate}
                onChange={(e) => setNewHoliday({ ...newHoliday, holidayDate: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newHoliday.type}
                onChange={(e) => setNewHoliday({ ...newHoliday, type: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="SCHOOL">School</option>
                <option value="PUBLIC">Public</option>
                <option value="RELIGIOUS">Religious</option>
                <option value="NATIONAL">National</option>
                <option value="BREAK">Break</option>
              </select>
              <input
                type="text"
                placeholder="Description (optional)"
                value={newHoliday.description}
                onChange={(e) => setNewHoliday({ ...newHoliday, description: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                Save
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}

        {holidayLoading ? (
          <p className="text-sm text-gray-400">Loading holidays...</p>
        ) : holidays.length === 0 ? (
          <p className="text-sm text-gray-400">No holidays defined yet.</p>
        ) : (
          <div className="space-y-2">
            {holidays.map((h) => (
              <div key={h.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="text-center min-w-[3rem]">
                    <p className="text-xs text-gray-400">
                      {new Date(h.holidayDate).toLocaleDateString('en-US', { month: 'short' })}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(h.holidayDate).getDate()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{h.name}</p>
                    {h.description && <p className="text-xs text-gray-500">{h.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${HOLIDAY_TYPE_COLORS[h.type] || 'bg-gray-100 text-gray-700'}`}>
                    {h.type}
                  </span>
                  {canManage && (
                    <button
                      onClick={() => handleDeleteHoliday(h.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance Records</h2>
        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : records.length === 0 ? (
          <p className="text-sm text-gray-400">No attendance records found.</p>
        ) : (
          <p className="text-sm text-gray-400">{records.length} records found.</p>
        )}
      </div>
    </div>
  );
}
