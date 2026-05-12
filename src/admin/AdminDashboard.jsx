import { useEffect, useState } from 'react'
import AdminLogin from './AdminLogin'
import AdminLayout from './AdminLayout'
import AdminGallery from './AdminGallery'
import AdminVideos from './AdminVideos'
import AdminSectionImages from './AdminSectionImages'
import { isCurrentUserAdmin } from '../lib/cmsApi'
import { supabase, supabaseConfigured, getSupabaseConfigError } from '../lib/supabaseClient'
import './admin.css'

export default function AdminDashboard() {
  const [status, setStatus] = useState('loading')
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('gallery')

  useEffect(() => {
    let active = true

    async function loadSession() {
      if (!supabaseConfigured || !supabase) {
        setStatus('not-configured')
        return
      }

      const { data } = await supabase.auth.getSession()
      const sessionUser = data.session?.user

      if (!active) return

      if (!sessionUser) {
        setStatus('login')
        return
      }

      setUser(sessionUser)
      const allowed = await isCurrentUserAdmin(sessionUser.id)

      if (!active) return
      setStatus(allowed ? 'ready' : 'denied')
    }

    loadSession()

    return () => {
      active = false
    }
  }, [])

  const handleSignOut = async () => {
    await supabase?.auth.signOut()
    window.location.href = '/admin/login'
  }

  if (status === 'loading') {
    return (
      <main className="admin-state-page">
        <div className="admin-state-card">Ielādē admin paneli...</div>
      </main>
    )
  }

  if (status === 'not-configured') {
    return (
      <main className="admin-state-page">
        <div className="admin-state-card admin-state-card--wide">
          <h1>Admin panelis nav nokonfigurēts</h1>
          <p>{getSupabaseConfigError()}</p>
        </div>
      </main>
    )
  }

  if (status === 'login') return <AdminLogin />

  if (status === 'denied') {
    return (
      <main className="admin-state-page">
        <div className="admin-state-card admin-state-card--wide">
          <h1>Piekļuve liegta</h1>
          <p>Jūsu lietotājs nav pievienots admin sarakstam. Sazinieties ar vietnes administratoru.</p>
          <button type="button" className="admin-secondary-btn" onClick={handleSignOut}>
            Iziet
          </button>
        </div>
      </main>
    )
  }

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSignOut={handleSignOut}
      userEmail={user?.email}
    >
      {activeTab === 'gallery' && <AdminGallery />}
      {activeTab === 'videos' && <AdminVideos />}
      {activeTab === 'sections' && <AdminSectionImages />}
    </AdminLayout>
  )
}
