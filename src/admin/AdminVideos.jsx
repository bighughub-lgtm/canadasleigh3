import { useEffect, useState } from 'react'
import {
  adminCreateVideo,
  adminDeleteVideo,
  adminListVideos,
  adminUpdateVideo,
} from '../lib/cmsApi'
import './admin.css'

const languages = [
  { key: 'lv', label: 'LV' },
  { key: 'en', label: 'EN' },
  { key: 'ru', label: 'RU' },
  { key: 'lt', label: 'LT' },
  { key: 'est', label: 'EST' },
]

const emptyVideo = {
  title_lv: '',
  description_lv: '',
  video_url: '',
  thumbnail_url: '',
  sort_order: 0,
  is_active: true,
}

function cleanVideoPayload(item) {
  return {
    title_lv: item.title_lv || null,
    title_en: item.title_en || null,
    title_ru: item.title_ru || null,
    title_lt: item.title_lt || null,
    title_est: item.title_est || null,
    description_lv: item.description_lv || null,
    description_en: item.description_en || null,
    description_ru: item.description_ru || null,
    description_lt: item.description_lt || null,
    description_est: item.description_est || null,
    video_url: item.video_url,
    thumbnail_url: item.thumbnail_url || null,
    sort_order: Number(item.sort_order) || 0,
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
      setVideos(await adminListVideos())
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

  const handleCreate = async () => {
    if (!newVideo.video_url.trim()) {
      setError('Pievienojiet video saiti.')
      return
    }

    setSavingId('new')
    setMessage('')
    setError('')

    try {
      const created = await adminCreateVideo(cleanVideoPayload(newVideo))
      setVideos((current) => [created, ...current])
      setNewVideo(emptyVideo)
      setMessage('Video pievienots.')
    } catch (createError) {
      setError(createError.message || 'Neizdevās pievienot video.')
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
      const updated = await adminUpdateVideo(video.id, cleanVideoPayload(video))
      setVideos((current) => current.map((entry) => (entry.id === video.id ? updated : entry)))
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
      setVideos((current) => current.filter((entry) => entry.id !== video.id))
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
          <p>Pievienojiet YouTube vai citu video saiti publiskajai video sadaļai.</p>
        </div>
      </div>

      <div className="admin-create-box">
        <label className="admin-field">
          <span>Video saite</span>
          <input
            value={newVideo.video_url}
            onChange={(event) => setNewVideo((current) => ({ ...current, video_url: event.target.value }))}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </label>
        <label className="admin-field">
          <span>Nosaukums LV</span>
          <input
            value={newVideo.title_lv}
            onChange={(event) => setNewVideo((current) => ({ ...current, title_lv: event.target.value }))}
          />
        </label>
        <label className="admin-field">
          <span>Apraksts LV</span>
          <input
            value={newVideo.description_lv}
            onChange={(event) => setNewVideo((current) => ({ ...current, description_lv: event.target.value }))}
          />
        </label>
        <label className="admin-field">
          <span>Miniatūras saite</span>
          <input
            value={newVideo.thumbnail_url}
            onChange={(event) => setNewVideo((current) => ({ ...current, thumbnail_url: event.target.value }))}
          />
        </label>
        <label className="admin-sort-field">
          <span>Secība</span>
          <input
            type="number"
            value={newVideo.sort_order}
            onChange={(event) => setNewVideo((current) => ({ ...current, sort_order: event.target.value }))}
          />
        </label>
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

      <div className="admin-list">
        {videos.map((video) => (
          <article className="admin-edit-card" key={video.id}>
            <div className="admin-row-top">
              <label className="admin-field admin-field--wide">
                <span>Video saite</span>
                <input value={video.video_url || ''} onChange={(event) => updateVideo(video.id, { video_url: event.target.value })} />
              </label>
              <label className="admin-field admin-field--wide">
                <span>Miniatūras saite</span>
                <input value={video.thumbnail_url || ''} onChange={(event) => updateVideo(video.id, { thumbnail_url: event.target.value })} />
              </label>
              <label className="admin-inline-check">
                <input
                  type="checkbox"
                  checked={Boolean(video.is_active)}
                  onChange={(event) => updateVideo(video.id, { is_active: event.target.checked })}
                />
                Aktīvs
              </label>
              <label className="admin-sort-field">
                <span>Secība</span>
                <input type="number" value={video.sort_order ?? 0} onChange={(event) => updateVideo(video.id, { sort_order: event.target.value })} />
              </label>
            </div>

            <div className="admin-language-grid">
              {languages.map((lang) => (
                <div className="admin-language-card" key={lang.key}>
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

            <div className="admin-row-actions">
              <button type="button" className="admin-primary-btn" onClick={() => handleSave(video)} disabled={savingId === video.id}>
                {savingId === video.id ? 'Saglabā...' : 'Saglabāt'}
              </button>
              <button type="button" className="admin-danger-btn" onClick={() => handleDelete(video)} disabled={savingId === video.id}>
                Dzēst
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
