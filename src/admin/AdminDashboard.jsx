import { useEffect, useState } from 'react'
import AdminLogin from './AdminLogin'
import AdminLayout from './AdminLayout'
import AdminGallery from './AdminGallery'
import AdminProductGalleries from './AdminProductGalleries'
import AdminVideos from './AdminVideos'
import AdminSectionImages from './AdminSectionImages'
import AdminTexts from './AdminTexts'
import { adminLogout, getAdminSession } from '../lib/cmsApi'
import './admin.css'

export default function AdminDashboard() {
  const [status, setStatus] = useState('loading')
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('gallery')

  useEffect(() => {
    let active = true

    getAdminSession().then((sessionUser) => {
      if (!active) return
      setUser(sessionUser)
      setStatus(sessionUser ? 'ready' : 'login')
    })

    return () => {
      active = false
    }
  }, [])

  const handleAuthenticated = (sessionUser) => {
    setUser(sessionUser)
    setStatus('ready')
  }

  const handleSignOut = async () => {
    await adminLogout()
    window.location.href = '/admin/login'
  }

  if (status === 'loading') {
    return (
      <main className="admin-state-page">
        <div className="admin-state-card">Ielādē admin paneli...</div>
      </main>
    )
  }

  if (status === 'login') return <AdminLogin onAuthenticated={handleAuthenticated} />

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
      {activeTab === 'texts' && <AdminTexts />}
    </AdminLayout>
  )
}
