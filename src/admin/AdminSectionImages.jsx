import { useEffect, useState } from 'react'
import {
  adminListMedia,
  adminUpdateMedia,
  adminUpsertSectionImage,
} from '../lib/cmsApi'
import { uploadImageToCloudinary } from '../lib/cloudinaryUpload'
import { editableImageSlotIds, editableImageSlots } from '../lib/mediaSlots'
import './admin.css'

const languages = [
  { key: 'lv', label: 'LV' },
  { key: 'en', label: 'EN' },
  { key: 'ru', label: 'RU' },
]

function chooseSlotRow(rows) {
  return rows
    .slice()
    .sort((a, b) => {
      if (Boolean(a.is_active) !== Boolean(b.is_active)) return Boolean(b.is_active) - Boolean(a.is_active)
      const orderDiff = (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0)
      if (orderDiff !== 0) return orderDiff
      return String(b.created_at || '').localeCompare(String(a.created_at || ''))
    })[0] ?? null
}

function buildSlotMap(rows) {
  return editableImageSlots.reduce((map, slot) => {
    const slotRows = rows.filter((item) => item.section === slot.id)
    map[slot.id] = chooseSlotRow(slotRows)
    return map
  }, {})
}

function slotAltValue(item, slot, lang) {
  if (!item) return lang === 'lv' ? slot.alt_lv : ''
  return item[`alt_${lang}`] || ''
}

export default function AdminSectionImages() {
  const [slotItems, setSlotItems] = useState({})
  const [loading, setLoading] = useState(true)
  const [savingSlot, setSavingSlot] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [slotStatus, setSlotStatus] = useState({})

  const loadItems = async () => {
    setLoading(true)
    setError('')
    try {
      const rows = await adminListMedia()
      setSlotItems(buildSlotMap(rows.filter((item) => editableImageSlotIds.includes(item.section))))
    } catch (loadError) {
      setError(loadError.message || 'Neizdevās ielādēt sadaļu attēlus.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  const setStatus = (slotId, status) => {
    setSlotStatus((current) => ({ ...current, [slotId]: status }))
  }

  const updateSlotAlt = (slotId, lang, value) => {
    setSlotItems((current) => {
      const currentItem = current[slotId] || {}
      return {
        ...current,
        [slotId]: {
          ...currentItem,
          section: slotId,
          [`alt_${lang}`]: value,
        },
      }
    })
  }

  const handleReplace = async (slot, file) => {
    if (!file) return

    setSavingSlot(slot.id)
    setMessage('')
    setError('')
    setStatus(slot.id, 'Augšupielādē...')

    try {
      const currentItem = slotItems[slot.id]
      const upload = await uploadImageToCloudinary(file, { folder: 'sections' })
      const saved = await adminUpsertSectionImage(slot.id, {
        title_lv: slot.label_lv,
        alt_lv: currentItem?.alt_lv || slot.alt_lv,
        alt_en: currentItem?.alt_en || null,
        alt_ru: currentItem?.alt_ru || null,
        url: upload.secure_url,
        cloudinary_public_id: upload.public_id,
        width: upload.width,
        height: upload.height,
        format: upload.format,
      })

      setSlotItems((current) => ({ ...current, [slot.id]: saved }))
      setStatus(slot.id, 'Nomainīts')
      setMessage(`${slot.label_lv} attēls nomainīts.`)
    } catch (uploadError) {
      setStatus(slot.id, '')
      setError(uploadError.message || 'Attēlu neizdevās nomainīt.')
    } finally {
      setSavingSlot('')
    }
  }

  const handleSaveAlt = async (slot) => {
    const item = slotItems[slot.id]

    if (!item?.id) {
      setError('Vispirms augšupielādējiet attēlu šim slotam.')
      return
    }

    setSavingSlot(slot.id)
    setMessage('')
    setError('')
    setStatus(slot.id, 'Saglabā...')

    try {
      const updated = await adminUpdateMedia(item.id, {
        title_lv: slot.label_lv,
        alt_lv: item.alt_lv || slot.alt_lv,
        alt_en: item.alt_en || null,
        alt_ru: item.alt_ru || null,
        sort_order: 1,
        is_active: true,
      })

      await adminUpsertSectionImage(slot.id, {
        title_lv: slot.label_lv,
        alt_lv: updated.alt_lv || slot.alt_lv,
        alt_en: updated.alt_en || null,
        alt_ru: updated.alt_ru || null,
        url: updated.url,
        cloudinary_public_id: updated.cloudinary_public_id,
        width: updated.width,
        height: updated.height,
        format: updated.format,
      })

      setSlotItems((current) => ({ ...current, [slot.id]: updated }))
      setStatus(slot.id, 'Saglabāts')
      setMessage(`${slot.label_lv} alt teksts saglabāts.`)
    } catch (saveError) {
      setStatus(slot.id, '')
      setError(saveError.message || 'Neizdevās saglabāt attēla informāciju.')
    } finally {
      setSavingSlot('')
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <span className="admin-kicker">Sadaļu bildes</span>
          <h2>Sadaļu attēli</h2>
          <p>Katrs attēls ir fiksēts slots publiskajā lapā. Augšupielāde nomaina attiecīgā slota attēlu.</p>
        </div>
      </div>

      {message && <div className="admin-alert admin-alert--success">{message}</div>}
      {error && <div className="admin-alert admin-alert--error">{error}</div>}
      {loading && <div className="admin-muted">Ielādē sadaļu attēlus...</div>}
      {!loading && !error && Object.values(slotItems).filter(Boolean).length === 0 && (
        <div className="admin-empty-state">
          Sadaļu attēli vēl nav importēti. Palaidiet Supabase seed failu vai augšupielādējiet attēlu izvēlētajai sadaļai.
        </div>
      )}

      <div className="admin-slot-grid">
        {editableImageSlots.map((slot) => {
          const item = slotItems[slot.id]
          const previewUrl = item?.url || slot.fallbackUrl
          const busy = savingSlot === slot.id

          return (
            <article className="admin-slot-card" key={slot.id}>
              <div className="admin-slot-preview">
                <img src={previewUrl} alt={item?.alt_lv || slot.alt_lv} loading="lazy" />
              </div>

              <div className="admin-slot-body">
                <div className="admin-slot-head">
                  <div>
                    <h3>{slot.label_lv}</h3>
                    <p>{slot.description_lv}</p>
                  </div>
                  <span className="admin-slot-id">{slot.id}</span>
                </div>

                <p className="admin-slot-usage">{slot.usage_lv}</p>

                <div className="admin-language-grid admin-language-grid--compact">
                  {languages.map((lang) => (
                    <label className="admin-field" key={lang.key}>
                      <span>Alt teksts {lang.label}</span>
                      <input
                        value={slotAltValue(item, slot, lang.key)}
                        onChange={(event) => updateSlotAlt(slot.id, lang.key, event.target.value)}
                      />
                    </label>
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
                        handleReplace(slot, selectedFile)
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className="admin-primary-btn"
                    onClick={() => handleSaveAlt(slot)}
                    disabled={busy || !item?.id}
                  >
                    {busy ? 'Saglabā...' : 'Saglabāt'}
                  </button>
                  <span className="admin-slot-status">{slotStatus[slot.id]}</span>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
