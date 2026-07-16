export default function FormActions({ onSubmit, onCancel, submitLabel = 'Create', cancelLabel = 'Cancel', submitting = false, submitVariant = 'accent' }) {
  const submitClass = submitVariant === 'accent'
    ? 'gradient-bg-hover text-white shadow-glow'
    : 'btn-accent-secondary';

  return (
    <div className="flex gap-2 pt-2">
      <button
        type="submit"
        disabled={submitting}
        onClick={onSubmit}
        className={`px-4 py-2.5 text-sm rounded-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 ${submitClass}`}
      >
        {submitting ? 'Saving...' : submitLabel}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2.5 glass-btn theme-text text-sm rounded-lg transition-all"
      >
        {cancelLabel}
      </button>
    </div>
  );
}
