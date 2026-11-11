import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminCompleteSetup, checkSetupToken } from '../lib/cmsApi'
import './admin.css'

// One-time page for creating an admin account from an invitation link: /admin/setup#<token>
export default function AdminSetup() {
  const navigate = useNavigate()
  const [token] = useState(() => window.location.hash.replace(/^#/, ''))
  const [status, setStatus] = useState('checking')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    if (!token) {
      setStatus('invalid')
      return undefined
    }

    checkSetupToken(token).then((valid) => {
      if (active) setStatus(valid ? 'ready' : 'invalid')
    })

    return () => {
      active = false
    }
  }, [token])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (password.length < 10) {
      setError('Parolei jābūt vismaz 10 rakstzīmes garai.')
      return
    }

    if (password !== passwordRepeat) {
      setError('Paroles nesakrīt.')
      return
    }

    setSaving(true)
    try {
      await adminCompleteSetup(token, email, password)
      window.history.replaceState(null, '', '/admin/setup')
      navigate('/admin', { replace: true })
    } catch (setupError) {
      setError(setupError.message || 'Kontu neizdevās izveidot.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <img src="/logopng2.png" alt="Canada" className="admin-login-logo" />
        <span className="admin-kicker">Klienta admin panelis</span>
        <h1>Konta izveide</h1>

        {status === 'checking' && <p>Pārbauda saiti...</p>}

        {status === 'invalid' && (
          <>
            <div className="admin-alert admin-alert--error">
              Šī saite vairs nav derīga vai jau ir izmantota.
            </div>
            <p>
              Ja konts jau ir izveidots, <a href="/admin/login">piesakieties šeit</a>. Ja nē, palūdziet jaunu saiti.
            </p>
          </>
        )}

        {status === 'ready' && (
          <>
            <p>Ievadiet savu e-pastu un izvēlieties paroli. Ar tiem turpmāk pieteiksieties admin panelī.</p>

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
              <span>Parole (vismaz 10 rakstzīmes)</span>
              <input
                type="password"
                value={password}
                autoComplete="new-password"
                minLength={10}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            <label className="admin-field">
              <span>Parole vēlreiz</span>
              <input
                type="password"
                value={passwordRepeat}
                autoComplete="new-password"
                minLength={10}
                onChange={(event) => setPasswordRepeat(event.target.value)}
                required
              />
            </label>

            <button className="admin-primary-btn" type="submit" disabled={saving}>
              {saving ? 'Izveido...' : 'Izveidot kontu'}
            </button>
          </>
        )}
      </form>
    </main>
  )
}
