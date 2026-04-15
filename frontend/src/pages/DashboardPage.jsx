import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import DashboardCards from '../components/DashboardCards'
import FollowUpList from '../components/FollowUpList'
import { getDashboard, getOverdueFollowUps, getTodayFollowUps } from '../services/leadService'

const DashboardPage = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [today, setToday] = useState([])
  const [overdue, setOverdue] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [dashboardData, todayData, overdueData] = await Promise.all([
          getDashboard(),
          getTodayFollowUps(),
          getOverdueFollowUps(),
        ])
        setStats(dashboardData)
        setToday(todayData)
        setOverdue(overdueData)
      } catch {
        toast.error('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return <div className="muted text-sm">Loading dashboard...</div>
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="muted text-sm">Track lead performance and follow-ups.</p>
      </div>
      <DashboardCards stats={stats} />
      <div className="grid gap-4 lg:grid-cols-2">
        <FollowUpList title="Today's Follow-ups" leads={today} />
        <FollowUpList title="Overdue Follow-ups" leads={overdue} />
      </div>
    </div>
  )
}

export default DashboardPage
