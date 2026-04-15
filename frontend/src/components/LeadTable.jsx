const LeadTable = ({ leads, onEdit, onDelete, onSelectLead }) => {
  return (
    <div className="card overflow-x-auto p-0">
      <table className="min-w-full text-left text-sm">
        <thead className="text-xs uppercase muted" style={{ background: 'var(--surface-soft)' }}>
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Follow-up</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-t" style={{ borderColor: 'var(--line)' }}>
              <td className="px-4 py-3">
                <p className="font-medium">{lead.name}</p>
                <p className="muted text-xs">{lead.email}</p>
              </td>
              <td className="px-4 py-3">{lead.phone}</td>
              <td className="px-4 py-3">{lead.status}</td>
              <td className="px-4 py-3">{lead.follow_up_date ?? '-'}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectLead(lead)}
                    className="rounded-md px-2 py-1 text-xs"
                    style={{ background: 'var(--surface-soft)', color: 'var(--text)' }}
                  >
                    Notes
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(lead)}
                    className="rounded-md px-2 py-1 text-xs"
                    style={{ background: '#d9ebe3', color: 'var(--brand)' }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(lead.id)}
                    className="rounded-md bg-rose-100 px-2 py-1 text-xs text-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LeadTable
