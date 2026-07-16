import { useState, useEffect, useCallback } from 'react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { academicApi } from '../api/academic';
import { courseworkApi } from '../api/coursework';
import { Calendar, Plus, Trash2, Send, DoorOpen, Clock } from 'lucide-react';
import Modal from '../components/Modal';
import { FormField, FormActions, FilterBar, FilterSelect } from '../components/ui';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SLOT_TYPES = ['LECTURE', 'LAB', 'FREE', 'BREAK', 'ASSEMBLY'];
const ROOM_TYPES = ['CLASSROOM', 'LAB', 'LIBRARY', 'SPORTS'];

export default function TimetableBuilder() {
  const { user } = useAuth();
  const canEdit = ['SUPER_ADMIN', 'PRINCIPAL', 'SUPERVISOR'].includes(user?.role);

  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [slots, setSlots] = useState([]);

  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedTimetable, setSelectedTimetable] = useState('');

  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    academicApi.getAllBatches().then((res) => {
      setBatches(res.data);
      const active = res.data.find((b) => b.isActive);
      if (active) setSelectedBatch(active.id);
    }).catch(() => setBatches([]));
    academicApi.getAllClasses().then((res) => setClasses(res.data)).catch(() => setClasses([]));
    academicApi.getAllSubjects().then((res) => setSubjects(res.data)).catch(() => setSubjects([]));
    courseworkApi.getAllRooms().then((res) => setRooms(res.data)).catch(() => setRooms([]));
  }, []);

  // Load divisions when class changes
  useEffect(() => {
    if (selectedClass) {
      academicApi.getDivisionsByClass(selectedClass).then((res) => setDivisions(res.data)).catch(() => setDivisions([]));
      setSelectedDivision('');
    } else {
      setDivisions([]);
    }
  }, [selectedClass]);

  // Load timetables when batch changes
  useEffect(() => {
    if (selectedBatch) {
      courseworkApi.getTimetablesByBatch(selectedBatch).then((res) => setTimetables(res.data)).catch(() => setTimetables([]));
    } else {
      setTimetables([]);
    }
  }, [selectedBatch]);

  // Load slots when timetable is selected
  const loadSlots = useCallback(() => {
    if (selectedTimetable) {
      setLoading(true);
      courseworkApi.getSlotsByTimetable(selectedTimetable).then((res) => setSlots(res.data)).catch(() => setSlots([])).finally(() => setLoading(false));
    } else {
      setSlots([]);
    }
  }, [selectedTimetable]);

  useEffect(() => { loadSlots(); }, [loadSlots]);

  // Group slots by day and period
  const slotGrid = {};
  slots.forEach((s) => {
    const key = `${s.dayOfWeek}-${s.periodNumber}`;
    slotGrid[key] = s;
  });

  // Find max period number
  const maxPeriod = slots.reduce((max, s) => Math.max(max, s.periodNumber), 0);
  const periodCount = Math.max(maxPeriod, 8);

  const subjectMap = Object.fromEntries(subjects.map((s) => [s.id, s]));
  const roomMap = Object.fromEntries(rooms.map((r) => [r.id, r]));

  const handleCreateTimetable = async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      await courseworkApi.createTimetable({
        classId: parseInt(selectedClass),
        batchId: parseInt(selectedBatch),
        name: form.name.value,
        isShared: form.isShared.checked,
      });
      setShowTimetableModal(false);
      courseworkApi.getTimetablesByBatch(selectedBatch).then((res) => setTimetables(res.data));
    } catch (err) {
      alert('Failed to create timetable: ' + (err.response?.data?.message || err.message));
    }
  };

  const handlePublish = async () => {
    if (!selectedTimetable) return;
    if (!confirm('Publish this timetable? It will become visible to faculty and parents.')) return;
    try {
      await courseworkApi.publishTimetable(selectedTimetable);
      courseworkApi.getTimetablesByBatch(selectedBatch).then((res) => {
        setTimetables(res.data);
        const updated = res.data.find((t) => t.id === parseInt(selectedTimetable));
        if (updated) setSelectedTimetable(updated.id.toString());
      });
    } catch (err) {
      alert('Failed to publish: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSaveSlot = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      timetableId: parseInt(selectedTimetable),
      divisionId: parseInt(selectedDivision),
      dayOfWeek: parseInt(editingSlot.day),
      periodNumber: parseInt(editingSlot.period),
      subjectId: form.subjectId.value ? parseInt(form.subjectId.value) : null,
      facultyId: form.facultyId.value ? parseInt(form.facultyId.value) : null,
      roomId: form.roomId.value ? parseInt(form.roomId.value) : null,
      startTime: form.startTime.value,
      endTime: form.endTime.value,
      slotType: form.slotType.value,
    };
    try {
      await courseworkApi.createSlot(data);
      setShowSlotModal(false);
      setEditingSlot(null);
      loadSlots();
    } catch (err) {
      alert('Failed to save slot: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!confirm('Delete this slot?')) return;
    try {
      await courseworkApi.deleteSlot(slotId);
      loadSlots();
    } catch (err) {
      alert('Failed to delete slot: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      await courseworkApi.createRoom({
        name: form.name.value,
        roomType: form.roomType.value,
        capacity: form.capacity.value ? parseInt(form.capacity.value) : null,
      });
      setShowRoomModal(false);
      courseworkApi.getAllRooms().then((res) => setRooms(res.data));
    } catch (err) {
      alert('Failed to create room: ' + (err.response?.data?.message || err.message));
    }
  };

  const openSlotEditor = (day, period) => {
    const existing = slotGrid[`${day}-${period}`];
    if (existing) {
      setEditingSlot({ day, period, existing });
    } else {
      setEditingSlot({ day, period, existing: null });
    }
    setShowSlotModal(true);
  };

  const selectedTimetableObj = timetables.find((t) => t.id === parseInt(selectedTimetable));

  return (
    <div>
      <PageHeader
        title="Timetable Builder"
        subtitle="Create and manage class timetables with slot-based scheduling"
        action={canEdit && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowRoomModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors btn-accent"
            >
              <DoorOpen className="w-4 h-4" /> Add Room
            </button>
            <button
              onClick={() => setShowTimetableModal(true)}
              disabled={!selectedBatch || !selectedClass}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 btn-accent-secondary"
            >
              <Plus className="w-4 h-4" /> New Timetable
            </button>
          </div>
        )}
      />

      {/* Filters */}
      <FilterBar>
        <FilterSelect label="Batch" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
          <option value="">Select batch</option>
          {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </FilterSelect>
        <FilterSelect label="Class" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="">Select class</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </FilterSelect>
        <FilterSelect label="Division" value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)}>
          <option value="">Select division</option>
          {divisions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </FilterSelect>
        <div>
          <label className="block text-xs font-medium theme-text-muted mb-1.5">Timetable</label>
          <div className="flex gap-2">
            <select
              value={selectedTimetable}
              onChange={(e) => setSelectedTimetable(e.target.value)}
              className="theme-input w-full rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select timetable</option>
              {timetables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} {t.isPublished ? '(Published)' : '(Draft)'}
                </option>
              ))}
            </select>
            {canEdit && selectedTimetableObj && !selectedTimetableObj.isPublished && (
              <button
                onClick={handlePublish}
                className="px-3 py-2 rounded-lg text-sm font-medium shrink-0 btn-accent"
                title="Publish timetable"
              >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
      </FilterBar>

      {/* Timetable Grid */}
      {selectedTimetable ? (
        <div className="theme-card rounded-xl p-4 overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-muted-c">
              <Clock className="w-8 h-8 mx-auto mb-2 animate-spin" />
              Loading slots...
            </div>
          ) : (
            <table className="w-full border-collapse min-w-700">
              <thead>
                <tr>
                  <th className="p-2 text-left text-xs font-semibold th-header">Period</th>
                  {DAYS.map((day) => (
                    <th key={day} className="p-2 text-center text-xs font-semibold th-header">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: periodCount }, (_, i) => i + 1).map((period) => (
                  <tr key={period}>
                    <td className="p-2 text-sm font-semibold text-main">P{period}</td>
                    {DAYS.map((_, dayIdx) => {
                      const slot = slotGrid[`${dayIdx}-${period}`];
                      return (
                        <td key={dayIdx} className="p-1">
                          {slot ? (
                            <div
                              className="rounded-lg p-2 text-xs cursor-pointer relative group"
                              style={{
                                background: slot.slotType === 'FREE' ? 'transparent' : 'var(--icon-bg-tint)',
                                border: '1px solid var(--input-border)',
                                minHeight: '60px',
                              }}
                              onClick={() => canEdit && openSlotEditor(dayIdx, period)}
                            >
                              {slot.slotType === 'FREE' ? (
                                <span className="text-muted-c">Free</span>
                              ) : slot.slotType === 'BREAK' ? (
                                <span className="text-muted-c">Break</span>
                              ) : slot.slotType === 'ASSEMBLY' ? (
                                <span className="text-main">Assembly</span>
                              ) : (
                                <>
                                  <div className="font-semibold text-main">
                                    {subjectMap[slot.subjectId]?.name || '—'}
                                  </div>
                                  <div className="text-muted-c">
                                    {slot.startTime}–{slot.endTime}
                                  </div>
                                  {slot.roomId && (
                                    <div className="text-muted-c">
                                      {roomMap[slot.roomId]?.name || ''}
                                    </div>
                                  )}
                                  <div className="text-[10px] mt-1 text-accent-c">
                                    {slot.slotType}
                                  </div>
                                </>
                              )}
                              {canEdit && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDeleteSlot(slot.id); }}
                                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-accent-secondary"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ) : (
                            canEdit ? (
                              <button
                                onClick={() => openSlotEditor(dayIdx, period)}
                                className="w-full rounded-lg p-2 text-xs flex items-center justify-center transition-colors"
                                style={{
                                  border: '1px dashed var(--input-border)',
                                  color: 'var(--text-muted)',
                                  minHeight: '60px',
                                }}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            ) : (
                              <div className="rounded-lg border-input" style={{ minHeight: '60px' }} />
                            )
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="theme-card rounded-xl p-12 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-c" />
          <p className="text-sm text-muted-c">
            Select a batch, class, and timetable to view or edit the schedule.
          </p>
        </div>
      )}

      {/* Rooms list */}
      {rooms.length > 0 && (
        <div className="theme-card rounded-xl p-4 mt-6">
          <h3 className="text-sm font-semibold mb-3 text-main">Rooms</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {rooms.map((r) => (
              <div key={r.id} className="rounded-lg p-3 text-sm border-input">
                <div className="font-medium text-main">{r.name}</div>
                <div className="text-xs text-muted-c">{r.roomType} · Cap: {r.capacity || '—'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slot Editor Modal */}
      <Modal open={showSlotModal && !!editingSlot} onClose={() => setShowSlotModal(false)} title={editingSlot ? `${editingSlot.existing ? 'Edit Slot' : 'Add Slot'} — ${DAYS[editingSlot.day]} P${editingSlot.period}` : ''} maxWidth="max-w-md">
        {editingSlot && (
          <form onSubmit={handleSaveSlot} className="space-y-3">
            <FormField label="Subject">
              <select name="subjectId" defaultValue={editingSlot.existing?.subjectId || ''} className="theme-input w-full rounded-lg px-3 py-2 text-sm">
                <option value="">— None —</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </FormField>
            <FormField label="Faculty ID">
              <input name="facultyId" type="number" defaultValue={editingSlot.existing?.facultyId || ''} className="theme-input w-full rounded-lg px-3 py-2 text-sm" placeholder="Faculty user ID" />
            </FormField>
            <FormField label="Room">
              <select name="roomId" defaultValue={editingSlot.existing?.roomId || ''} className="theme-input w-full rounded-lg px-3 py-2 text-sm">
                <option value="">— None —</option>
                {rooms.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.roomType})</option>)}
              </select>
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Start Time">
                <input name="startTime" type="time" defaultValue={editingSlot.existing?.startTime || '09:00'} className="theme-input w-full rounded-lg px-3 py-2 text-sm" required />
              </FormField>
              <FormField label="End Time">
                <input name="endTime" type="time" defaultValue={editingSlot.existing?.endTime || '09:45'} className="theme-input w-full rounded-lg px-3 py-2 text-sm" required />
              </FormField>
            </div>
            <FormField label="Slot Type">
              <select name="slotType" defaultValue={editingSlot.existing?.slotType || 'LECTURE'} className="theme-input w-full rounded-lg px-3 py-2 text-sm">
                {SLOT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormActions onSubmit={handleSaveSlot} onCancel={() => setShowSlotModal(false)} submitLabel="Save Slot" submitting={false} />
          </form>
        )}
      </Modal>

      {/* New Timetable Modal */}
      <Modal open={showTimetableModal} onClose={() => setShowTimetableModal(false)} title="Create Timetable" maxWidth="max-w-md">
        <form onSubmit={handleCreateTimetable} className="space-y-3">
          <FormField label="Timetable Name">
            <input name="name" type="text" required placeholder="e.g., Class 10 Master Schedule" className="theme-input w-full rounded-lg px-3 py-2 text-sm" />
          </FormField>
          <label className="flex items-center gap-2 text-sm text-main">
            <input name="isShared" type="checkbox" /> Shared across divisions
          </label>
          <FormActions onSubmit={handleCreateTimetable} onCancel={() => setShowTimetableModal(false)} submitLabel="Create" submitting={false} submitVariant="secondary" />
        </form>
      </Modal>

      {/* Room Modal */}
      <Modal open={showRoomModal} onClose={() => setShowRoomModal(false)} title="Add Room" maxWidth="max-w-md">
        <form onSubmit={handleCreateRoom} className="space-y-3">
          <FormField label="Room Name">
            <input name="name" type="text" required placeholder="e.g., Room 201" className="theme-input w-full rounded-lg px-3 py-2 text-sm" />
          </FormField>
          <FormField label="Room Type">
            <select name="roomType" defaultValue="CLASSROOM" className="theme-input w-full rounded-lg px-3 py-2 text-sm">
              {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Capacity">
            <input name="capacity" type="number" placeholder="e.g., 40" className="theme-input w-full rounded-lg px-3 py-2 text-sm" />
          </FormField>
          <FormActions onSubmit={handleCreateRoom} onCancel={() => setShowRoomModal(false)} submitLabel="Add Room" submitting={false} />
        </form>
      </Modal>
    </div>
  );
}
