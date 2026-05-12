import { useEffect, useState } from 'react'
import {
  adminCreateMedia,
  adminDeleteMedia,
  adminUpdateMedia,
  moveMediaItem,
  normalizeMediaOrder,
} from '../lib/cmsApi'
import { uploadImageToCloudinary } from '../lib/cloudinaryUpload'
import './admin.css'

const languages = [
  { key: 'lv', label: 'LV' },
  { key: 'en', label: 'EN' },
  { key: 'ru', label: 'RU' },
]

function fileTitle(file) {
  return file?.name?.replace(/\.[^.]+$/, '') || 'Jauns attēls'
}

function cleanMediaPayload(item) {
  return {
    title_lv: item.title_lv || null,
    title_en: item.title_en || null,
    title_ru: item.title_ru || null,
    alt_lv: item.alt_lv || null,
    alt_en: item.alt_en || null,
    alt_ru: item.alt_ru || null,
    sort_order: Number(item.sort_order) || 1,
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
      setItems(await normalizeMediaOrder('gallery'))
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
      await adminCreateMedia({
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

      setItems(await normalizeMediaOrder('gallery'))
      setFile(null)
      setMessage('Attēls pievienots galerijai.')
    } catch (uploadError) {
      setError(uploadError.message || 'Attēlu neizdevās pievienot.')
    } finally {
      setUploading(false)
    }
  }

  const handleMove = async (item, direction) => {
    setSavingId(`${item.id}-${direction}`)
    setMessage('')
    setError('')

    try {
      setItems(await moveMediaItem('gallery', item.id, direction))
      setMessage('Galerijas secība atjaunota.')
    } catch (moveError) {
      setError(moveError.message || 'Neizdevās mainīt attēla secību.')
    } finally {
      setSavingId('')
    }
  }

  const handleToggleActive = async (item) => {
    setSavingId(item.id)
    setMessage('')
    setError('')

    try {
      const updated = await adminUpdateMedia(item.id, {
        ...cleanMediaPayload(item),
        is_active: !item.is_active,
      })
      setItems((current) => current.map((entry) => (entry.id === item.id ? updated : entry)))
      setMessage(updated.is_active ? 'Attēls aktivizēts.' : 'Attēls paslēpts.')
    } catch (toggleError) {
      setError(toggleError.message || 'Neizdevās mainīt attēla statusu.')
    } finally {
      setSavingId('')
    }
  }

  const handleSave = async (item) => {
    setSavingId(item.id)
    setMessage('')
    setError('')

    try {
      await adminUpdateMedia(item.id, cleanMediaPayload(item))
      setItems(await normalizeMediaOrder('gallery'))
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
      setItems(await normalizeMediaOrder('gallery'))
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
          <p>Attēli publiskajā galerijā. Secību mainiet ar pogām, nevis ar numuriem.</p>
        </div>
      </div>

      <div className="admin-upload-box admin-upload-box--compact">
        <label className="admin-file-field">
          <span>Pievienot jaunu attēlu</span>
          <input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} />
        </label>
        <button type="button" className="admin-primary-btn" onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? 'Augšupielādē...' : 'Augšupielādēt'}
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

      <div className="admin-list admin-list--compact">
        {items.map((item, index) => {
          const busy = savingId === item.id || savingId.startsWith(`${item.id}-`)

          return (
            <article className={`admin-media-row admin-media-row--compact${item.is_active ? '' : ' admin-media-row--inactive'}`} key={item.id}>
              <div className="admin-media-preview admin-media-preview--small">
                <img src={item.url} alt={item.alt_lv || item.title_lv || 'Galerijas attēls'} loading="lazy" />
                <span className="admin-order-badge">{index + 1}</span>
              </div>

              <div className="admin-media-form">
                <div className="admin-row-top admin-row-top--compact">
                  <span className={`admin-status-pill${item.is_active ? ' admin-status-pill--active' : ''}`}>
                    {item.is_active ? 'Aktīvs' : 'Paslēpts'}
                  </span>
                  <button
                    type="button"
                    className="admin-secondary-btn"
                    onClick={() => handleMove(item, 'up')}
                    disabled={index === 0 || busy}
                  >
                    Augšup
                  </button>
                  <button
                    type="button"
                    className="admin-secondary-btn"
                    onClick={() => handleMove(item, 'down')}
                    disabled={index === items.length - 1 || busy}
                  >
                    Lejup
                  </button>
                </div>

                <div className="admin-language-grid admin-language-grid--compact">
                  {languages.map((lang) => (
                    <div className="admin-language-card admin-language-card--compact" key={lang.key}>
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

                <div className="admin-row-actions admin-row-actions--compact">
                  <button
                    type="button"
                    className="admin-secondary-btn"
                    onClick={() => handleToggleActive(item)}
                    disabled={busy}
                  >
                    {item.is_active ? 'Paslēpt' : 'Aktivizēt'}
                  </button>
                  <button
                    type="button"
                    className="admin-primary-btn"
                    onClick={() => handleSave(item)}
                    disabled={busy}
                  >
                    {busy ? 'Saglabā...' : 'Saglabāt'}
                  </button>
                  <button
                    type="button"
                    className="admin-danger-btn"
                    onClick={() => handleDelete(item)}
                    disabled={busy}
                  >
                    Dzēst
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
