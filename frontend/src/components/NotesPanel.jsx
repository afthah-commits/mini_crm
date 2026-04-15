import { useState } from 'react'

const NotesPanel = ({ lead, onAddNote, isSaving }) => {
  const [content, setContent] = useState('')

  if (!lead) {
    return (
      <div className="card muted text-sm">
        Select a lead to view and add notes.
      </div>
    )
  }

  const submit = (e) => {
    e.preventDefault()
    if (!content.trim()) return
    onAddNote(content)
    setContent('')
  }

  return (
    <div className="card">
      <h3 className="text-sm font-semibold">Notes - {lead.name}</h3>
      <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
        {lead.notes?.length ? (
          lead.notes.map((note) => (
            <div key={note.id} className="rounded-md p-2 text-sm" style={{ background: 'var(--surface-soft)' }}>
              <p>{note.content}</p>
              <p className="muted mt-1 text-xs">By {note.author?.name ?? 'User'}</p>
            </div>
          ))
        ) : (
          <p className="muted text-sm">No notes yet</p>
        )}
      </div>
      <form onSubmit={submit} className="mt-3 flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a note..."
          className="field flex-1"
        />
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary px-3"
        >
          {isSaving ? '...' : 'Add'}
        </button>
      </form>
    </div>
  )
}

export default NotesPanel
