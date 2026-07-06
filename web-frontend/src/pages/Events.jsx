import { useEffect, useState } from 'react';
import { eventApi } from '../api/event';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { CalendarDays, Plus, Trash2, Trophy, Music, BookOpen, Bus, Flag, Star, MapPin } from 'lucide-react';

const EVENT_ICONS = {
  SPORTS: Trophy,
  CULTURAL: Music,
  ACADEMIC: BookOpen,
  ANNUAL_DAY: Star,
  FIELD_TRIP: Bus,
  COMPETITION: Flag,
  OTHER: CalendarDays,
};

const EVENT_COLORS = {
  SPORTS: 'bg-green-100 text-green-700',
  CULTURAL: 'bg-purple-100 text-purple-700',
  ACADEMIC: 'bg-blue-100 text-blue-700',
  ANNUAL_DAY: 'bg-amber-100 text-amber-700',
  FIELD_TRIP: 'bg-cyan-100 text-cyan-700',
  COMPETITION: 'bg-rose-100 text-rose-700',
  OTHER: 'bg-gray-100 text-gray-700',
};

const CAN_MANAGE_EVENTS = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'SUPERVISOR'];

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [view, setView] = useState('upcoming');
  const [newEvent, setNewEvent] = useState({
    name: '', description: '', eventDate: '', endDate: '',
    eventType: 'OTHER', venue: '', targetClassLevel: '', targetDivisionId: '',
  });

  const canManage = user && CAN_MANAGE_EVENTS.includes(user.role);

  useEffect(() => {
    eventApi.getUpcoming()
      .then((res) => setUpcoming(res.data))
      .catch(() => setUpcoming([]));
    eventApi.getAll()
      .then((res) => setEvents(res.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newEvent,
        targetClassLevel: newEvent.targetClassLevel ? parseInt(newEvent.targetClassLevel) : null,
        targetDivisionId: newEvent.targetDivisionId ? parseInt(newEvent.targetDivisionId) : null,
        endDate: newEvent.endDate || null,
        managedByUserId: user.id,
      };
      const res = await eventApi.create(payload);
      setEvents([res.data, ...events]);
      setUpcoming([res.data, ...upcoming].sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate)));
      setNewEvent({ name: '', description: '', eventDate: '', endDate: '', eventType: 'OTHER', venue: '', targetClassLevel: '', targetDivisionId: '' });
      setShowAddForm(false);
    } catch (err) {
      alert('Failed to create event');
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await eventApi.delete(id);
      setEvents(events.filter((e) => e.id !== id));
      setUpcoming(upcoming.filter((e) => e.id !== id));
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  const displayEvents = view === 'upcoming' ? upcoming : events;

  return (
    <div>
      <PageHeader
        title="Events"
        subtitle="School events, competitions, and activities"
        action={
          canManage && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          )
        }
      />

      {showAddForm && canManage && (
        <form onSubmit={handleAddEvent} className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
            <input type="text" placeholder="Event Name" value={newEvent.name} onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })} required className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="date" placeholder="Start Date" value={newEvent.eventDate} onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })} required className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="date" placeholder="End Date (optional)" value={newEvent.endDate} onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <select value={newEvent.eventType} onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="OTHER">Other</option>
              <option value="SPORTS">Sports</option>
              <option value="CULTURAL">Cultural</option>
              <option value="ACADEMIC">Academic</option>
              <option value="ANNUAL_DAY">Annual Day</option>
              <option value="FIELD_TRIP">Field Trip</option>
              <option value="COMPETITION">Competition</option>
            </select>
            <input type="text" placeholder="Venue" value={newEvent.venue} onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="number" placeholder="Target Class Level (optional)" value={newEvent.targetClassLevel} onChange={(e) => setNewEvent({ ...newEvent, targetClassLevel: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <textarea placeholder="Description (optional)" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3" />
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">Save</button>
            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
          </div>
        </form>
      )}

      <div className="flex gap-2 mb-4">
        <button onClick={() => setView('upcoming')} className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${view === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>Upcoming</button>
        <button onClick={() => setView('all')} className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${view === 'all' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>All Events</button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-400">Loading events...</p>
        </div>
      ) : displayEvents.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-400">No events found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayEvents.map((event) => {
            const Icon = EVENT_ICONS[event.eventType] || CalendarDays;
            const colorClass = EVENT_COLORS[event.eventType] || 'bg-gray-100 text-gray-700';
            const eventDate = new Date(event.eventDate);
            const isUpcoming = eventDate >= new Date(new Date().toDateString());
            return (
              <div key={event.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {canManage && (
                    <button onClick={() => handleDeleteEvent(event.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{event.name}</h3>
                {event.description && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{event.description}</p>}
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>{eventDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  {event.endDate && new Date(event.endDate).getTime() !== eventDate.getTime() && (
                    <span>— {new Date(event.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                  )}
                </div>
                {event.venue && (
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{event.venue}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorClass}`}>{event.eventType}</span>
                  {isUpcoming && <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">Upcoming</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
