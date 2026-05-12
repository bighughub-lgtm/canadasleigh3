import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isCurrentUserAdmin } from '../lib/cmsApi'
import { supabase, supabaseConfigured, getSupabaseConfigError } from '../lib/supabaseClient'
import './admin.css'

export default function AdminLogin({ onAuthenticated }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [checkingSession, setCheckingSession] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function checkExistingSession() {
      if (!supabaseConfigured || !supabase) {
        setCheckingSession(false)
        return
      }

      const { data } = await supabase.auth.getSession()
      const sessionUser = data.session?.user

      if (!active) return

      if (!sessionUser) {
        setCheckingSession(false)
        return
      }

      const allowed = await isCurrentUserAdmin(sessionUser.id)

      if (!active) return

      if (!allowed) {
        setError('Nav piekļuves šim admin panelim.')
        setCheckingSession(false)
        return
      }

      if (onAuthenticated) {
        onAuthenticated(sessionUser)
      } else {
        navigate('/admin', { replace: true })
      }
    }

    checkExistingSession()

    return () => {
      active = false
    }
  }, [navigate, onAuthenticated])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!supabaseConfigured || !supabase) {
      setError(getSupabaseConfigError())
      return
    }

    setLoading(true)
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError('Nepareizs e-pasts vai parole.')
        return
      }

      const { data: userData, error: userError } = await supabase.auth.getUser()
      const sessionUser = userData?.user

      if (userError || !sessionUser) {
        setError('Neizdevās pārbaudīt lietotāja piekļuvi.')
        return
      }

      const allowed = await isCurrentUserAdmin(sessionUser.id)

      if (!allowed) {
        setError('Nav piekļuves šim admin panelim.')
        return
      }

      if (onAuthenticated) {
        onAuthenticated(sessionUser)
      } else {
        navigate('/admin', { replace: true })
      }
    } catch (loginError) {
      setError(loginError.message || 'Pieslēgšanās neizdevās.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <img src="/logopng2.png" alt="Canada" className="admin-login-logo" />
        <span className="admin-kicker">Klienta admin panelis</span>
        <h1>Pieslēgšanās</h1>
        <p>Pārvaldiet galeriju, video un sadaļu attēlus bez koda rediģēšanas.</p>

        {!supabaseConfigured && (
          <div className="admin-alert admin-alert--error">{getSupabaseConfigError()}</div>
        )}

        {error && <div className="admin-alert admin-alert--error">{error}</div>}

        <label className="admin-field">
          <span>E-pasts</span>
          <input
            type="email"
            value={email}
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="admin-field">
          <span>Parole</span>
          <input
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button className="admin-primary-btn" type="submit" disabled={loading || checkingSession || !supabaseConfigured}>
          {loading || checkingSession ? 'Pārbauda...' : 'Ienākt'}
        </button>
      </form>
    </main>
  )
}
