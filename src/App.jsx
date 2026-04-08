import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import CookieBanner from './components/CookieBanner'
import MainPage from './pages/MainPage'
import PrivatumaPolitika from './pages/PrivatumaPolitika'
import SikdatnuPolitika from './pages/SikdatnuPolitika'
import PirksanasNoteikumi from './pages/PirksanasNoteikumi'
import PiegadeAtgriešana from './pages/PiegadeAtgriešana'

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
  return (
    <>
      <RouteScrollTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/privatuma-politika" element={<PrivatumaPolitika />} />
          <Route path="/sikdatnu-politika" element={<SikdatnuPolitika />} />
          <Route path="/pirksanas-noteikumi" element={<PirksanasNoteikumi />} />
          <Route path="/piegade-atgriešana" element={<PiegadeAtgriešana />} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTop />
      <CookieBanner />
    </>
  )
}
