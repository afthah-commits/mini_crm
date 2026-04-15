const FollowUpList = ({ title, leads }) => {
  return (
    <div className="card">
      <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{title}</h3>
      <div className="mt-3 space-y-2">
        {leads.length === 0 ? (
          <p className="muted text-sm">No records</p>
        ) : (
          leads.map((lead) => (
            <div key={lead.id} className="rounded-lg p-3 text-sm" style={{ background: 'var(--surface-soft)' }}>
              <p className="font-medium">{lead.name}</p>
              <p className="muted">{lead.phone}</p>
              <p className="muted text-xs">Follow-up: {lead.follow_up_date ?? '-'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default FollowUpList
