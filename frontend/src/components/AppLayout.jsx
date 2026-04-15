import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/leads', label: 'Leads' },
]

const AppLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-64 shrink-0 border-r p-6 md:block" style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}>
        <h1 className="text-xl font-bold" style={{ color: 'var(--brand)' }}>LeadFlow</h1>
        <p className="mt-2 text-sm muted">{user?.name}</p>
        <nav className="mt-8 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? '' : 'hover:opacity-80'
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? { background: 'var(--surface-soft)', color: 'var(--brand)' }
                  : { color: 'var(--muted)' }
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" onClick={handleLogout} className="btn-primary mt-8">
          Logout
        </button>
      </aside>

      <main className="flex-1">
        <header className="border-b p-4 md:hidden" style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold" style={{ color: 'var(--brand)' }}>LeadFlow</h2>
            <button type="button" onClick={handleLogout} className="btn-primary rounded-md px-3 py-1.5 text-xs">
              Logout
            </button>
          </div>
          <nav className="mt-3 flex gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-xs font-medium ${
                    isActive ? '' : ''
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? { background: 'var(--surface-soft)', color: 'var(--brand)' }
                    : { background: '#e9f0ec', color: 'var(--muted)' }
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppLayout
