import { useEffect, useState } from 'react'
import AdminLogin from './AdminLogin'
import AdminLayout from './AdminLayout'
import AdminGallery from './AdminGallery'
import AdminProductGalleries from './AdminProductGalleries'
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

    async function validateSession(session) {
      const sessionUser = session?.user

      if (!active) return

      if (!sessionUser) {
        setUser(null)
        setStatus('login')
        return
      }

      setStatus('loading')
      setUser(sessionUser)
      const allowed = await isCurrentUserAdmin(sessionUser.id)

      if (!active) return
      setStatus(allowed ? 'ready' : 'denied')
    }

    if (!supabaseConfigured || !supabase) {
      setStatus('not-configured')
      return () => {
        active = false
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      validateSession(data.session)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      validateSession(session)
    })

    return () => {
      active = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleAuthenticated = async (sessionUser) => {
    setStatus('ready')
    setUser(sessionUser)
  }

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

  if (status === 'login') return <AdminLogin onAuthenticated={handleAuthenticated} />

  if (status === 'denied') {
    return (
      <main className="admin-state-page">
        <div className="admin-state-card admin-state-card--wide">
          <h1>Piekļuve liegta</h1>
          <p>Nav piekļuves šim admin panelim.</p>
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
      {activeTab === 'product-galleries' && <AdminProductGalleries />}
      {activeTab === 'videos' && <AdminVideos />}
      {activeTab === 'sections' && <AdminSectionImages />}
    </AdminLayout>
  )
}
