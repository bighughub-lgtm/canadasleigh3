import { useEffect, useState } from 'react'
import {
  adminCreateVideo,
  adminDeleteVideo,
  adminUpdateVideo,
  moveVideoItem,
  normalizeVideosOrder,
} from '../lib/cmsApi'
import './admin.css'

const languages = [
  { key: 'lv', label: 'LV' },
  { key: 'en', label: 'EN' },
  { key: 'ru', label: 'RU' },
]

const emptyVideo = {
  title_lv: '',
  title_en: '',
  title_ru: '',
  description_lv: '',
  description_en: '',
  description_ru: '',
  video_url: '',
  thumbnail_url: '',
  sort_order: 1,
  is_active: true,
}

function cleanVideoPayload(item) {
  return {
    title_lv: item.title_lv || null,
    title_en: item.title_en || null,
    title_ru: item.title_ru || null,
    description_lv: item.description_lv || null,
    description_en: item.description_en || null,
    description_ru: item.description_ru || null,
    video_url: item.video_url,
    thumbnail_url: item.thumbnail_url || null,
    sort_order: Number(item.sort_order) || 1,
    is_active: Boolean(item.is_active),
  }
}

export default function AdminVideos() {
  const [videos, setVideos] = useState([])
  const [newVideo, setNewVideo] = useState(emptyVideo)
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadVideos = async () => {
    setLoading(true)
    setError('')
    try {
      setVideos(await normalizeVideosOrder())
    } catch (loadError) {
      setError(loadError.message || 'Neizdevās ielādēt videoklipus.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVideos()
  }, [])

  const updateVideo = (id, patch) => {
    setVideos((current) => current.map((video) => (video.id === id ? { ...video, ...patch } : video)))
  }

  const updateNewVideo = (patch) => {
    setNewVideo((current) => ({ ...current, ...patch }))
  }

  const handleCreate = async () => {
    if (!newVideo.video_url.trim()) {
      setError('Pievienojiet video saiti.')
      return
    }

    setSavingId('new')
    setMessage('')
    setError('')

    try {
      await adminCreateVideo(cleanVideoPayload({ ...newVideo, sort_order: videos.length + 1 }))
      setVideos(await normalizeVideosOrder())
      setNewVideo(emptyVideo)
      setMessage('Video pievienots.')
    } catch (createError) {
      setError(createError.message || 'Neizdevās pievienot video.')
    } finally {
      setSavingId('')
    }
  }

  const handleMove = async (video, direction) => {
    setSavingId(`${video.id}-${direction}`)
    setMessage('')
    setError('')

    try {
      setVideos(await moveVideoItem(video.id, direction))
      setMessage('Video secība atjaunota.')
    } catch (moveError) {
      setError(moveError.message || 'Neizdevās mainīt video secību.')
    } finally {
      setSavingId('')
    }
  }

  const handleSave = async (video) => {
    if (!video.video_url?.trim()) {
      setError('Video saite ir obligāta.')
      return
    }

    setSavingId(video.id)
    setMessage('')
    setError('')

    try {
      await adminUpdateVideo(video.id, cleanVideoPayload(video))
      setVideos(await normalizeVideosOrder())
      setMessage('Izmaiņas saglabātas.')
    } catch (saveError) {
      setError(saveError.message || 'Neizdevās saglabāt video.')
    } finally {
      setSavingId('')
    }
  }

  const handleDelete = async (video) => {
    if (!window.confirm('Vai tiešām dzēst šo video?')) return

    setSavingId(video.id)
    setMessage('')
    setError('')

    try {
      await adminDeleteVideo(video.id)
      setVideos(await normalizeVideosOrder())
      setMessage('Video izdzēsts.')
    } catch (deleteError) {
      setError(deleteError.message || 'Neizdevās dzēst video.')
    } finally {
      setSavingId('')
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <span className="admin-kicker">Videoklipi</span>
          <h2>Video saraksts</h2>
          <p>Pievienojiet YouTube vai lokāla video saiti. Secību mainiet ar pogām.</p>
        </div>
      </div>

      <div className="admin-create-box admin-create-box--compact">
        <label className="admin-field admin-field--wide">
          <span>Video URL</span>
          <input
            value={newVideo.video_url}
            onChange={(event) => updateNewVideo({ video_url: event.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </label>
        <label className="admin-field admin-field--wide">
          <span>Miniatūras URL</span>
          <input
            value={newVideo.thumbnail_url}
            onChange={(event) => updateNewVideo({ thumbnail_url: event.target.value })}
            placeholder="Nav obligāti"
          />
        </label>

        <div className="admin-language-grid admin-language-grid--compact admin-language-grid--full">
          {languages.map((lang) => (
            <div className="admin-language-card admin-language-card--compact" key={lang.key}>
              <strong>{lang.label}</strong>
              <label className="admin-field">
                <span>Nosaukums</span>
                <input
                  value={newVideo[`title_${lang.key}`] || ''}
                  onChange={(event) => updateNewVideo({ [`title_${lang.key}`]: event.target.value })}
                />
              </label>
              <label className="admin-field">
                <span>Apraksts</span>
                <textarea
                  value={newVideo[`description_${lang.key}`] || ''}
                  onChange={(event) => updateNewVideo({ [`description_${lang.key}`]: event.target.value })}
                />
              </label>
            </div>
          ))}
        </div>

        <button type="button" className="admin-primary-btn" onClick={handleCreate} disabled={savingId === 'new'}>
          {savingId === 'new' ? 'Pievieno...' : 'Pievienot video'}
        </button>
      </div>

      {message && <div className="admin-alert admin-alert--success">{message}</div>}
      {error && <div className="admin-alert admin-alert--error">{error}</div>}
      {loading && <div className="admin-muted">Ielādē video...</div>}
      {!loading && !error && videos.length === 0 && (
        <div className="admin-empty-state">
          Video dati vēl nav importēti. Palaidiet Supabase seed failu vai pievienojiet pirmo video.
        </div>
      )}

      <div className="admin-list admin-list--compact">
        {videos.map((video, index) => {
          const busy = savingId === video.id || savingId.startsWith(`${video.id}-`)

          return (
            <article className={`admin-edit-card admin-edit-card--compact${video.is_active ? '' : ' admin-media-row--inactive'}`} key={video.id}>
              <div className="admin-row-top admin-row-top--compact">
                <span className="admin-order-badge admin-order-badge--static">{index + 1}</span>
                <span className={`admin-status-pill${video.is_active ? ' admin-status-pill--active' : ''}`}>
                  {video.is_active ? 'Aktīvs' : 'Paslēpts'}
                </span>
                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={() => handleMove(video, 'up')}
                  disabled={index === 0 || busy}
                >
                  Augšup
                </button>
                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={() => handleMove(video, 'down')}
                  disabled={index === videos.length - 1 || busy}
                >
                  Lejup
                </button>
              </div>

              <div className="admin-video-fields">
                <label className="admin-field">
                  <span>Video URL</span>
                  <input value={video.video_url || ''} onChange={(event) => updateVideo(video.id, { video_url: event.target.value })} />
                </label>
                <label className="admin-field">
                  <span>Miniatūras URL</span>
                  <input value={video.thumbnail_url || ''} onChange={(event) => updateVideo(video.id, { thumbnail_url: event.target.value })} />
                </label>
                <label className="admin-inline-check admin-inline-check--compact">
                  <input
                    type="checkbox"
                    checked={Boolean(video.is_active)}
                    onChange={(event) => updateVideo(video.id, { is_active: event.target.checked })}
                  />
                  Aktīvs
                </label>
              </div>

              <div className="admin-language-grid admin-language-grid--compact">
                {languages.map((lang) => (
                  <div className="admin-language-card admin-language-card--compact" key={lang.key}>
                    <strong>{lang.label}</strong>
                    <label className="admin-field">
                      <span>Nosaukums</span>
                      <input
                        value={video[`title_${lang.key}`] || ''}
                        onChange={(event) => updateVideo(video.id, { [`title_${lang.key}`]: event.target.value })}
                      />
                    </label>
                    <label className="admin-field">
                      <span>Apraksts</span>
                      <textarea
                        value={video[`description_${lang.key}`] || ''}
                        onChange={(event) => updateVideo(video.id, { [`description_${lang.key}`]: event.target.value })}
                      />
                    </label>
                  </div>
                ))}
              </div>

              <div className="admin-row-actions admin-row-actions--compact">
                <button type="button" className="admin-primary-btn" onClick={() => handleSave(video)} disabled={busy}>
                  {busy ? 'Saglabā...' : 'Saglabāt'}
                </button>
                <button type="button" className="admin-danger-btn" onClick={() => handleDelete(video)} disabled={busy}>
                  Dzēst
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
