import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, supabaseConfigured, getSupabaseConfigError } from '../lib/supabaseClient'
import './admin.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin', { replace: true })
    })
  }, [navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!supabaseConfigured || !supabase) {
      setError(getSupabaseConfigError())
      return
    }

    setLoading(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)

    if (signInError) {
      setError('Nepareizs e-pasts vai parole.')
      return
    }

    navigate('/admin', { replace: true })
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

        <button className="admin-primary-btn" type="submit" disabled={loading || !supabaseConfigured}>
          {loading ? 'Pārbauda...' : 'Ienākt'}
        </button>
      </form>
    </main>
  )
}
