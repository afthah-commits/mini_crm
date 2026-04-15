const DashboardCards = ({ stats }) => {
  const cards = [
    { title: 'Total Leads', value: stats?.total_leads ?? 0 },
    { title: 'Your Leads', value: stats?.user_assigned_leads ?? 0 },
    { title: 'New', value: stats?.leads_by_status?.New ?? 0 },
    { title: 'Interested', value: stats?.leads_by_status?.Interested ?? 0 },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.title} className="card">
          <p className="muted text-sm">{card.title}</p>
          <p className="mt-2 text-2xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  )
}

export default DashboardCards
