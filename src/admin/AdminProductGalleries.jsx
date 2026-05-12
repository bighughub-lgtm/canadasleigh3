import { useEffect, useState } from 'react'
import {
  adminAddGalleryImage,
  adminDeleteMedia,
  adminUpdateMedia,
  moveMediaItem,
  normalizeMediaOrder,
} from '../lib/cmsApi'
import { uploadImageToCloudinary } from '../lib/cloudinaryUpload'
import { productGallerySections } from '../lib/mediaSlots'
import './admin.css'

const languages = [
  { key: 'lv', label: 'LV' },
  { key: 'en', label: 'EN' },
  { key: 'ru', label: 'RU' },
]

function fileTitle(file) {
  return file?.name?.replace(/\.[^.]+$/, '') || 'Jauns produkta attēls'
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

export default function AdminProductGalleries() {
  const [activeSection, setActiveSection] = useState(productGallerySections[0]?.id || '')
  const [itemsBySection, setItemsBySection] = useState({})
  const [filesBySection, setFilesBySection] = useState({})
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState('')
  const [uploadingSection, setUploadingSection] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const activeDefinition = productGallerySections.find((section) => section.id === activeSection) ?? productGallerySections[0]
  const activeItems = itemsBySection[activeDefinition?.id] || []
  const activeFile = filesBySection[activeDefinition?.id] || null

  const setSectionItems = (section, items) => {
    setItemsBySection((current) => ({ ...current, [section]: items }))
  }

  const loadItems = async () => {
    setLoading(true)
    setError('')

    try {
      const entries = await Promise.all(
        productGallerySections.map(async (section) => [section.id, await normalizeMediaOrder(section.id)]),
      )
      setItemsBySection(Object.fromEntries(entries))
    } catch (loadError) {
      setError(loadError.message || 'Neizdevās ielādēt produktu galerijas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  const updateItem = (section, id, patch) => {
    setItemsBySection((current) => ({
      ...current,
      [section]: (current[section] || []).map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))
  }

  const handleUpload = async (section) => {
    const file = filesBySection[section]
    if (!file) return

    setUploadingSection(section)
    setMessage('')
    setError('')

    try {
      const upload = await uploadImageToCloudinary(file, { folder: 'product-galleries' })
      await adminAddGalleryImage(section, {
        title_lv: fileTitle(file),
        alt_lv: fileTitle(file),
        url: upload.secure_url,
        cloudinary_public_id: upload.public_id,
        width: upload.width,
        height: upload.height,
        format: upload.format,
      })

      setSectionItems(section, await normalizeMediaOrder(section))
      setFilesBySection((current) => ({ ...current, [section]: null }))
      setMessage('Attēls pievienots produkta galerijai.')
    } catch (uploadError) {
      setError(uploadError.message || 'Attēlu neizdevās pievienot.')
    } finally {
      setUploadingSection('')
    }
  }

  const handleReplace = async (section, item, file) => {
    if (!file) return

    setSavingId(item.id)
    setMessage('')
    setError('')

    try {
      const upload = await uploadImageToCloudinary(file, { folder: 'product-galleries' })
      const updated = await adminUpdateMedia(item.id, {
        ...cleanMediaPayload(item),
        title_lv: item.title_lv || fileTitle(file),
        alt_lv: item.alt_lv || fileTitle(file),
        url: upload.secure_url,
        cloudinary_public_id: upload.public_id,
        width: upload.width,
        height: upload.height,
        format: upload.format,
      })

      setSectionItems(
        section,
        (itemsBySection[section] || []).map((entry) => (entry.id === item.id ? updated : entry)),
      )
      setMessage('Attēls nomainīts.')
    } catch (replaceError) {
      setError(replaceError.message || 'Attēlu neizdevās nomainīt.')
    } finally {
      setSavingId('')
    }
  }

  const handleMove = async (section, item, direction) => {
    setSavingId(`${item.id}-${direction}`)
    setMessage('')
    setError('')

    try {
      setSectionItems(section, await moveMediaItem(section, item.id, direction))
      setMessage('Galerijas secība atjaunota.')
    } catch (moveError) {
      setError(moveError.message || 'Neizdevās mainīt attēla secību.')
    } finally {
      setSavingId('')
    }
  }

  const handleToggleActive = async (section, item) => {
    setSavingId(item.id)
    setMessage('')
    setError('')

    try {
      const updated = await adminUpdateMedia(item.id, {
        ...cleanMediaPayload(item),
        is_active: !item.is_active,
      })
      updateItem(section, item.id, updated)
      setMessage(updated.is_active ? 'Attēls aktivizēts.' : 'Attēls paslēpts.')
    } catch (toggleError) {
      setError(toggleError.message || 'Neizdevās mainīt attēla statusu.')
    } finally {
      setSavingId('')
    }
  }

  const handleSave = async (section, item) => {
    setSavingId(item.id)
    setMessage('')
    setError('')

    try {
      await adminUpdateMedia(item.id, cleanMediaPayload(item))
      setSectionItems(section, await normalizeMediaOrder(section))
      setMessage('Izmaiņas saglabātas.')
    } catch (saveError) {
      setError(saveError.message || 'Neizdevās saglabāt izmaiņas.')
    } finally {
      setSavingId('')
    }
  }

  const handleDelete = async (section, item) => {
    if (!window.confirm('Vai tiešām dzēst šo attēlu?')) return

    setSavingId(item.id)
    setMessage('')
    setError('')

    try {
      await adminDeleteMedia(item.id)
      setSectionItems(section, await normalizeMediaOrder(section))
      setMessage('Attēls izdzēsts.')
    } catch (deleteError) {
      setError(deleteError.message || 'Neizdevās dzēst attēlu.')
    } finally {
      setSavingId('')
    }
  }

  if (!activeDefinition) {
    return (
      <div className="admin-panel">
        <div className="admin-empty-state">Produktu galeriju konfigurācija nav atrasta.</div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <span className="admin-kicker">Produktu galerijas</span>
          <h2>Produktu detalizētās galerijas</h2>
          <p>Attēli, kas redzami katra produkta “Pilna informācija” blokā. Secība tiek uzturēta ar pogām.</p>
        </div>
      </div>

      <div className="admin-section-tabs" role="tablist" aria-label="Produktu galerijas">
        {productGallerySections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`admin-section-tab${activeSection === section.id ? ' admin-section-tab--active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.label_lv}
            <span>{itemsBySection[section.id]?.length || 0}</span>
          </button>
        ))}
      </div>

      <section className="admin-media-group admin-media-group--active">
        <div className="admin-media-group-head">
          <div>
            <h3>{activeDefinition.label_lv}</h3>
            <p>{activeDefinition.description_lv}</p>
          </div>
          <span className="admin-slot-id">{activeDefinition.id}</span>
        </div>

        <div className="admin-upload-box admin-upload-box--compact">
          <label className="admin-file-field">
            <span>Pievienot attēlu</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setFilesBySection((current) => ({ ...current, [activeDefinition.id]: event.target.files?.[0] || null }))}
            />
          </label>
          <button
            type="button"
            className="admin-primary-btn"
            onClick={() => handleUpload(activeDefinition.id)}
            disabled={!activeFile || uploadingSection === activeDefinition.id}
          >
            {uploadingSection === activeDefinition.id ? 'Augšupielādē...' : 'Pievienot attēlu'}
          </button>
        </div>
      </section>

      {message && <div className="admin-alert admin-alert--success">{message}</div>}
      {error && <div className="admin-alert admin-alert--error">{error}</div>}
      {loading && <div className="admin-muted">Ielādē produktu galerijas...</div>}
      {!loading && !error && activeItems.length === 0 && (
        <div className="admin-empty-state">
          Šī produkta galerija vēl nav importēta. Palaidiet Supabase seed failu vai pievienojiet pirmo attēlu.
        </div>
      )}

      <div className="admin-list admin-list--compact">
        {activeItems.map((item, index) => {
          const busy = savingId === item.id || savingId.startsWith(`${item.id}-`)

          return (
            <article className={`admin-media-row admin-media-row--compact${item.is_active ? '' : ' admin-media-row--inactive'}`} key={item.id}>
              <div className="admin-media-preview admin-media-preview--small">
                <img src={item.url} alt={item.alt_lv || item.title_lv || activeDefinition.label_lv} loading="lazy" />
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
                    onClick={() => handleMove(activeDefinition.id, item, 'up')}
                    disabled={index === 0 || busy}
                  >
                    Augšup
                  </button>
                  <button
                    type="button"
                    className="admin-secondary-btn"
                    onClick={() => handleMove(activeDefinition.id, item, 'down')}
                    disabled={index === activeItems.length - 1 || busy}
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
                          onChange={(event) => updateItem(activeDefinition.id, item.id, { [`title_${lang.key}`]: event.target.value })}
                        />
                      </label>
                      <label className="admin-field">
                        <span>Alt teksts</span>
                        <input
                          value={item[`alt_${lang.key}`] || ''}
                          onChange={(event) => updateItem(activeDefinition.id, item.id, { [`alt_${lang.key}`]: event.target.value })}
                        />
                      </label>
                    </div>
                  ))}
                </div>

                <div className="admin-row-actions admin-row-actions--compact">
                  <label className={`admin-secondary-btn admin-file-button${busy ? ' admin-file-button--disabled' : ''}`}>
                    Nomainīt attēlu
                    <input
                      type="file"
                      accept="image/*"
                      disabled={busy}
                      onChange={(event) => {
                        const selectedFile = event.target.files?.[0]
                        event.target.value = ''
                        handleReplace(activeDefinition.id, item, selectedFile)
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className="admin-secondary-btn"
                    onClick={() => handleToggleActive(activeDefinition.id, item)}
                    disabled={busy}
                  >
                    {item.is_active ? 'Paslēpt' : 'Aktivizēt'}
                  </button>
                  <button
                    type="button"
                    className="admin-primary-btn"
                    onClick={() => handleSave(activeDefinition.id, item)}
                    disabled={busy}
                  >
                    {busy ? 'Saglabā...' : 'Saglabāt'}
                  </button>
                  <button
                    type="button"
                    className="admin-danger-btn"
                    onClick={() => handleDelete(activeDefinition.id, item)}
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
