import './admin.css'

const tabs = [
  { id: 'gallery', label: 'Galerija' },
  { id: 'videos', label: 'Videoklipi' },
  { id: 'sections', label: 'Sadaļu bildes' },
]

export default function AdminLayout({ activeTab, onTabChange, onSignOut, userEmail, children }) {
  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a href="/" className="admin-brand">
          <img src="/logopng2.png" alt="Canada" />
        </a>
        <div className="admin-sidebar-copy">
          <span className="admin-kicker">Admin panelis</span>
          <h1>Media pārvaldība</h1>
          <p>{userEmail}</p>
        </div>

        <nav className="admin-tabs" aria-label="Admin sadaļas">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`admin-tab${activeTab === tab.id ? ' admin-tab--active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <button type="button" className="admin-logout-btn" onClick={onSignOut}>
          Iziet
        </button>
      </aside>

      <section className="admin-content">{children}</section>
    </main>
  )
}
