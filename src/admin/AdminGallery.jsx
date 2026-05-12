import { useEffect, useState } from 'react'
import {
  adminCreateMedia,
  adminDeleteMedia,
  adminListMedia,
  adminUpdateMedia,
} from '../lib/cmsApi'
import { uploadImageToCloudinary } from '../lib/cloudinaryUpload'
import './admin.css'

const languages = [
  { key: 'lv', label: 'LV' },
  { key: 'en', label: 'EN' },
  { key: 'ru', label: 'RU' },
  { key: 'lt', label: 'LT' },
  { key: 'est', label: 'EST' },
]

function fileTitle(file) {
  return file?.name?.replace(/\.[^.]+$/, '') || 'Jauns attēls'
}

function cleanMediaPayload(item) {
  return {
    title_lv: item.title_lv || null,
    title_en: item.title_en || null,
    title_ru: item.title_ru || null,
    title_lt: item.title_lt || null,
    title_est: item.title_est || null,
    alt_lv: item.alt_lv || null,
    alt_en: item.alt_en || null,
    alt_ru: item.alt_ru || null,
    alt_lt: item.alt_lt || null,
    alt_est: item.alt_est || null,
    sort_order: Number(item.sort_order) || 0,
    is_active: Boolean(item.is_active),
  }
}

export default function AdminGallery() {
  const [items, setItems] = useState([])
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadItems = async () => {
    setLoading(true)
    setError('')
    try {
      setItems(await adminListMedia('gallery'))
    } catch (loadError) {
      setError(loadError.message || 'Neizdevās ielādēt galeriju.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  const updateItem = (id, patch) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setMessage('')
    setError('')

    try {
      const upload = await uploadImageToCloudinary(file, { folder: 'gallery' })
      const created = await adminCreateMedia({
        section: 'gallery',
        title_lv: fileTitle(file),
        alt_lv: fileTitle(file),
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
      setMessage('Attēls pievienots galerijai.')
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
      const updated = await adminUpdateMedia(item.id, cleanMediaPayload(item))
      setItems((current) => current.map((entry) => (entry.id === item.id ? updated : entry)))
      setMessage('Izmaiņas saglabātas.')
    } catch (saveError) {
      setError(saveError.message || 'Neizdevās saglabāt izmaiņas.')
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
          <span className="admin-kicker">Galerija</span>
          <h2>Galerijas attēli</h2>
          <p>Attēli, kas parādās publiskajā galerijas sadaļā.</p>
        </div>
      </div>

      <div className="admin-upload-box">
        <label className="admin-file-field">
          <span>Pievienot jaunu attēlu</span>
          <input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} />
        </label>
        <button type="button" className="admin-primary-btn" onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? 'Augšupielādē...' : 'Augšupielādēt attēlu'}
        </button>
      </div>

      {message && <div className="admin-alert admin-alert--success">{message}</div>}
      {error && <div className="admin-alert admin-alert--error">{error}</div>}
      {loading && <div className="admin-muted">Ielādē attēlus...</div>}
      {!loading && !error && items.length === 0 && (
        <div className="admin-empty-state">
          Galerijas dati vēl nav importēti. Palaidiet Supabase seed failu vai augšupielādējiet pirmo attēlu.
        </div>
      )}

      <div className="admin-list">
        {items.map((item) => (
          <article className="admin-media-row" key={item.id}>
            <div className="admin-media-preview">
              <img src={item.url} alt={item.alt_lv || item.title_lv || 'Galerijas attēls'} loading="lazy" />
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
                      <span>Nosaukums</span>
                      <input
                        value={item[`title_${lang.key}`] || ''}
                        onChange={(event) => updateItem(item.id, { [`title_${lang.key}`]: event.target.value })}
                      />
                    </label>
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
                <button
                  type="button"
                  className="admin-primary-btn"
                  onClick={() => handleSave(item)}
                  disabled={savingId === item.id}
                >
                  {savingId === item.id ? 'Saglabā...' : 'Saglabāt'}
                </button>
                <button
                  type="button"
                  className="admin-danger-btn"
                  onClick={() => handleDelete(item)}
                  disabled={savingId === item.id}
                >
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
