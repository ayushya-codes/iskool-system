import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import PageHeader from '../components/PageHeader';
import { Package, ClipboardList, AlertTriangle, Boxes } from 'lucide-react';

const CATEGORIES = [
  'STATIONERY', 'LAB_EQUIPMENT', 'ACADEMICS', 'SPORTS',
  'IT_EQUIPMENT', 'FURNITURE', 'LIBRARY', 'GENERAL'
];

export default function Inventory() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'PRINCIPAL';
  const isFaculty = user?.role === 'FACULTY';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [assignedCategories, setAssignedCategories] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        if (isAdmin) {
          const res = selectedCategory
            ? await api.get(`/inventory/items?category=${selectedCategory}`)
            : await api.get('/inventory/items');
          setItems(res.data || []);
        } else if (isFaculty && user?.id) {
          const [itemsRes, catRes] = await Promise.all([
            api.get(`/inventory/items/my-assigned?facultyUserId=${user.id}`).catch(() => ({ data: [] })),
            api.get(`/inventory/assignments/my-categories?facultyUserId=${user.id}`).catch(() => ({ data: [] })),
          ]);
          setItems(itemsRes.data || []);
          setAssignedCategories(catRes.data || []);
        }
      } catch (err) {
        console.error('Failed to load inventory:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isAdmin, isFaculty, user?.id, selectedCategory]);

  const lowStock = items.filter(i => i.lowStockThreshold && i.quantity <= i.lowStockThreshold);
  const categories = [...new Set(items.map(i => i.category))];

  const cards = [
    { label: 'Total Items', value: items.length, icon: Package, color: 'bg-indigo-500' },
    { label: 'Low Stock', value: lowStock.length, icon: AlertTriangle, color: 'bg-red-500' },
    { label: 'Categories', value: categories.length, icon: Boxes, color: 'bg-blue-500' },
    { label: 'Pending Indents', value: '—', icon: ClipboardList, color: 'bg-amber-500' },
  ];

  return (
    <div>
      <PageHeader
        title="Inventory"
        subtitle={isFaculty ? 'Inventory items under your management' : 'Manage stock items and indent requests'}
      />

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

      {isAdmin && (
        <div className="mb-4 flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Filter by Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      )}

      {isFaculty && assignedCategories.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Your assigned categories:</span>{' '}
            {assignedCategories.map(c => c.replace(/_/g, ' ')).join(', ')}
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500 bg-gray-50">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Quantity</th>
              <th className="px-4 py-3 font-medium">Low Stock Threshold</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                {isFaculty ? 'No inventory items assigned to you yet.' : 'No inventory items found.'}
              </td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                      {item.category?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{item.quantity}</td>
                  <td className="px-4 py-3 text-gray-700">{item.lowStockThreshold ?? '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
