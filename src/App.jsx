import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import CookieBanner from './components/CookieBanner'
import MainPage from './pages/MainPage'
import PrivatumaPolitika from './pages/PrivatumaPolitika'
import SikdatnuPolitika from './pages/SikdatnuPolitika'
import PirksanasNoteikumi from './pages/PirksanasNoteikumi'
import PiegadeAtgriešana from './pages/PiegadeAtgriešana'

const AdminLogin = lazy(() => import('./admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'))

function RouteScrollTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const timer = setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 80)
      return () => clearTimeout(timer)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

export default function App() {
  const { pathname } = useLocation()
  const isAdminRoute = pathname.startsWith('/admin')

  return (
    <>
      <RouteScrollTop />
      {!isAdminRoute && <Header />}
      <main>
        <Suspense fallback={<div />}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/privatuma-politika" element={<PrivatumaPolitika />} />
            <Route path="/sikdatnu-politika" element={<SikdatnuPolitika />} />
            <Route path="/pirksanas-noteikumi" element={<PirksanasNoteikumi />} />
            <Route path="/piegade-atgriešana" element={<PiegadeAtgriešana />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <ScrollToTop />}
      {!isAdminRoute && <CookieBanner />}
    </>
  )
}
