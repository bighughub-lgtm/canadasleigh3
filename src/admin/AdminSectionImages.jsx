import { useEffect, useState } from 'react'
import {
  adminCreateMedia,
  adminDeleteMedia,
  adminListMedia,
  adminUpdateMedia,
} from '../lib/cmsApi'
import { uploadImageToCloudinary } from '../lib/cloudinaryUpload'
import './admin.css'

const sections = [
  { id: 'partners', label: 'Partneriem' },
  { id: 'about', label: 'Par mums' },
  { id: 'hero', label: 'Sākuma skats' },
]

const languages = [
  { key: 'lv', label: 'LV' },
  { key: 'en', label: 'EN' },
  { key: 'ru', label: 'RU' },
  { key: 'lt', label: 'LT' },
  { key: 'est', label: 'EST' },
]

function cleanSectionImagePayload(item) {
  return {
    section: item.section,
    alt_lv: item.alt_lv || null,
    alt_en: item.alt_en || null,
    alt_ru: item.alt_ru || null,
    alt_lt: item.alt_lt || null,
    alt_est: item.alt_est || null,
    sort_order: Number(item.sort_order) || 0,
    is_active: Boolean(item.is_active),
  }
}

export default function AdminSectionImages() {
  const [section, setSection] = useState('partners')
  const [items, setItems] = useState([])
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadItems = async (selectedSection = section) => {
    setLoading(true)
    setError('')
    try {
      setItems(await adminListMedia(selectedSection))
    } catch (loadError) {
      setError(loadError.message || 'Neizdevās ielādēt sadaļu attēlus.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems(section)
  }, [section])

  const updateItem = (id, patch) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setMessage('')
    setError('')

    try {
      const upload = await uploadImageToCloudinary(file, { folder: 'sections' })
      const created = await adminCreateMedia({
        section,
        alt_lv: file.name.replace(/\.[^.]+$/, ''),
        url: upload.secure_url,
        cloudinary_public_id: upload.public_id,
        width: upload.width,
        height: upload.height,
        format: upload.format,
        sort_order: items.length + 1,
        is_active: true,
      })

      setItems((current) => [created, ...current])
      setFile(null)
      setMessage('Sadaļas attēls pievienots.')
    } catch (uploadError) {
      setError(uploadError.message || 'Attēlu neizdevās pievienot.')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (item) => {
    setSavingId(item.id)
    setMessage('')
    setError('')

    try {
      const updated = await adminUpdateMedia(item.id, cleanSectionImagePayload(item))
      setItems((current) => current.map((entry) => (entry.id === item.id ? updated : entry)))
      setMessage('Izmaiņas saglabātas.')
    } catch (saveError) {
      setError(saveError.message || 'Neizdevās saglabāt attēlu.')
    } finally {
      setSavingId('')
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm('Vai tiešām dzēst šo attēlu?')) return

    setSavingId(item.id)
    setMessage('')
    setError('')

    try {
      await adminDeleteMedia(item.id)
      setItems((current) => current.filter((entry) => entry.id !== item.id))
      setMessage('Attēls izdzēsts.')
    } catch (deleteError) {
      setError(deleteError.message || 'Neizdevās dzēst attēlu.')
    } finally {
      setSavingId('')
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <span className="admin-kicker">Sadaļu bildes</span>
          <h2>Sadaļu attēli</h2>
          <p>Partneru sadaļai varat nomainīt attēlu bez koda rediģēšanas.</p>
        </div>

        <label className="admin-field admin-section-picker">
          <span>Sadaļa</span>
          <select value={section} onChange={(event) => setSection(event.target.value)}>
            {sections.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="admin-upload-box">
        <label className="admin-file-field">
          <span>Pievienot attēlu izvēlētajai sadaļai</span>
          <input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} />
        </label>
        <button type="button" className="admin-primary-btn" onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? 'Augšupielādē...' : 'Augšupielādēt attēlu'}
        </button>
      </div>

      {message && <div className="admin-alert admin-alert--success">{message}</div>}
      {error && <div className="admin-alert admin-alert--error">{error}</div>}
      {loading && <div className="admin-muted">Ielādē sadaļas attēlus...</div>}
      {!loading && !error && items.length === 0 && (
        <div className="admin-empty-state">
          Sadaļu attēli vēl nav importēti. Palaidiet Supabase seed failu vai augšupielādējiet attēlu izvēlētajai sadaļai.
        </div>
      )}

      <div className="admin-list">
        {items.map((item) => (
          <article className="admin-media-row" key={item.id}>
            <div className="admin-media-preview">
              <img src={item.url} alt={item.alt_lv || 'Sadaļas attēls'} loading="lazy" />
            </div>

            <div className="admin-media-form">
              <div className="admin-row-top">
                <label className="admin-inline-check">
                  <input
                    type="checkbox"
                    checked={Boolean(item.is_active)}
                    onChange={(event) => updateItem(item.id, { is_active: event.target.checked })}
                  />
                  Aktīvs
                </label>
                <label className="admin-sort-field">
                  <span>Secība</span>
                  <input
                    type="number"
                    value={item.sort_order ?? 0}
                    onChange={(event) => updateItem(item.id, { sort_order: event.target.value })}
                  />
                </label>
              </div>

              <div className="admin-language-grid">
                {languages.map((lang) => (
                  <div className="admin-language-card" key={lang.key}>
                    <strong>{lang.label}</strong>
                    <label className="admin-field">
                      <span>Alt teksts</span>
                      <input
                        value={item[`alt_${lang.key}`] || ''}
                        onChange={(event) => updateItem(item.id, { [`alt_${lang.key}`]: event.target.value })}
                      />
                    </label>
                  </div>
                ))}
              </div>

              <div className="admin-row-actions">
                <button type="button" className="admin-primary-btn" onClick={() => handleSave(item)} disabled={savingId === item.id}>
                  {savingId === item.id ? 'Saglabā...' : 'Saglabāt'}
                </button>
                <button type="button" className="admin-danger-btn" onClick={() => handleDelete(item)} disabled={savingId === item.id}>
                  Dzēst
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
