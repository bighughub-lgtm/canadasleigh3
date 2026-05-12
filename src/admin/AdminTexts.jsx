import { useEffect, useMemo, useState } from 'react'
import {
  adminListTexts,
  adminResetTextOverride,
  adminUpsertText,
} from '../lib/cmsApi'
import {
  PUBLIC_TEXT_DEFINITIONS,
  TEXT_GROUPS,
} from '../lib/publicTextDefinitions'

const LANGUAGES = [
  { id: 'lv', label: 'LV' },
  { id: 'en', label: 'EN' },
  { id: 'ru', label: 'RU' },
]

function getDefaultValue(definition, language) {
  return definition[`default_${language}`] ?? ''
}

function mergeDefinitionWithRow(definition, savedRow) {
  return LANGUAGES.reduce(
    (item, language) => {
      const savedValue = savedRow?.[`value_${language.id}`]
      item[`saved_value_${language.id}`] = savedValue ?? null
      item[`value_${language.id}`] = savedValue ?? getDefaultValue(definition, language.id)
      return item
    },
    {
      ...definition,
      text_key: definition.key,
      hasSavedRow: Boolean(savedRow),
    },
  )
}

function buildItems(savedRows = []) {
  const savedByKey = new Map(savedRows.map((row) => [row.text_key, row]))
  return PUBLIC_TEXT_DEFINITIONS.map((definition) =>
    mergeDefinitionWithRow(definition, savedByKey.get(definition.key)),
  )
}

function itemHasOverride(item) {
  return LANGUAGES.some((language) => {
    const currentValue = item[`value_${language.id}`] ?? ''
    const defaultValue = item[`default_${language.id}`] ?? ''
    return currentValue !== defaultValue
  })
}

function buildPayload(item) {
  const values = LANGUAGES.reduce((payload, language) => {
    const currentValue = item[`value_${language.id}`] ?? ''
    const defaultValue = item[`default_${language.id}`] ?? ''
    payload[`value_${language.id}`] = currentValue === defaultValue ? null : currentValue
    return payload
  }, {})

  return {
    text_key: item.key,
    group_id: item.group_id,
    label_lv: item.label_lv,
    description_lv: item.description_lv ?? null,
    input_type: item.input_type,
    default_lv: item.default_lv ?? '',
    default_en: item.default_en ?? '',
    default_ru: item.default_ru ?? '',
    is_active: true,
    ...values,
  }
}

function getSearchText(item) {
  return [
    item.label_lv,
    item.description_lv,
    item.key,
    item.default_lv,
    item.default_en,
    item.default_ru,
    item.value_lv,
    item.value_en,
    item.value_ru,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export default function AdminTexts() {
  const [items, setItems] = useState(() => buildItems())
  const [activeGroup, setActiveGroup] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState('')
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    let active = true

    async function loadTexts() {
      setLoading(true)
      setNotice(null)

      try {
        const savedRows = await adminListTexts()
        if (active) setItems(buildItems(savedRows))
      } catch (error) {
        if (active) {
          setItems(buildItems())
          setNotice({
            type: 'error',
            text:
              error?.message ||
              'Tekstus neizdevās ielādēt. Pārbaudi, vai Supabase shēma ir atjaunināta.',
          })
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadTexts()

    return () => {
      active = false
    }
  }, [])

  const groupCounts = useMemo(() => {
    const counts = PUBLIC_TEXT_DEFINITIONS.reduce((result, item) => {
      result[item.group_id] = (result[item.group_id] ?? 0) + 1
      return result
    }, {})

    return TEXT_GROUPS.map((group) => ({
      ...group,
      count: counts[group.id] ?? 0,
    })).filter((group) => group.count > 0)
  }, [])

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()

    return items.filter((item) => {
      const groupMatches = activeGroup === 'all' || item.group_id === activeGroup
      const searchMatches = !query || getSearchText(item).includes(query)
      return groupMatches && searchMatches
    })
  }, [activeGroup, items, search])

  const updateItemValue = (key, language, value) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.key === key ? { ...item, [`value_${language}`]: value } : item,
      ),
    )
  }

  const replaceItem = (key, savedRow) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.key === key ? mergeDefinitionWithRow(item, savedRow) : item,
      ),
    )
  }

  const handleSave = async (item) => {
    setSavingKey(item.key)
    setNotice(null)

    try {
      const savedRow = await adminUpsertText(buildPayload(item))
      replaceItem(item.key, savedRow)
      setNotice({ type: 'success', text: 'Teksts saglabāts.' })
    } catch (error) {
      setNotice({
        type: 'error',
        text:
          error?.message ||
          'Tekstu neizdevās saglabāt. Pārbaudi Supabase piekļuves tiesības.',
      })
    } finally {
      setSavingKey('')
    }
  }

  const handleReset = async (item) => {
    setSavingKey(item.key)
    setNotice(null)

    try {
      if (item.hasSavedRow) {
        const savedRow = await adminResetTextOverride(item.key)
        replaceItem(item.key, savedRow)
      } else {
        replaceItem(item.key, null)
      }

      setNotice({ type: 'success', text: 'Teksts atjaunots uz noklusējumu.' })
    } catch (error) {
      setNotice({
        type: 'error',
        text:
          error?.message ||
          'Tekstu neizdevās atjaunot. Pārbaudi Supabase piekļuves tiesības.',
      })
    } finally {
      setSavingKey('')
    }
  }

  return (
    <section className="admin-panel admin-texts-panel">
      <div className="admin-panel-head">
        <div>
          <h2>Teksti</h2>
          <p>
            Publiskās vietnes LV, EN un RU teksti. Ja lauks ir noklusējuma vērtībā, vietne
            izmanto tulkojumu no koda.
          </p>
        </div>
        <span className="admin-status-pill admin-status-pill--active">
          {PUBLIC_TEXT_DEFINITIONS.length} teksti
        </span>
      </div>

      {notice && (
        <div className={`admin-alert admin-alert--${notice.type}`}>
          {notice.text}
        </div>
      )}

      <div className="admin-text-toolbar">
        <label className="admin-field admin-text-search">
          <span>Meklēt</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Meklēt pēc nosaukuma, atslēgas vai teksta"
          />
        </label>

        <div className="admin-text-group-tabs" aria-label="Tekstu sadaļas">
          <button
            type="button"
            className={`admin-section-tab${activeGroup === 'all' ? ' admin-section-tab--active' : ''}`}
            onClick={() => setActiveGroup('all')}
          >
            Visi
            <span>{PUBLIC_TEXT_DEFINITIONS.length}</span>
          </button>

          {groupCounts.map((group) => (
            <button
              key={group.id}
              type="button"
              className={`admin-section-tab${activeGroup === group.id ? ' admin-section-tab--active' : ''}`}
              onClick={() => setActiveGroup(group.id)}
            >
              {group.label_lv}
              <span>{group.count}</span>
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="admin-empty-state">Ielādē saglabātās teksta izmaiņas...</div>
      )}

      {!loading && filteredItems.length === 0 && (
        <div className="admin-empty-state">Nav tekstu, kas atbilst filtram.</div>
      )}

      <div className="admin-text-list">
        {filteredItems.map((item) => {
          const hasOverride = itemHasOverride(item)
          const isSaving = savingKey === item.key
          const FieldTag = item.input_type === 'textarea' ? 'textarea' : 'input'

          return (
            <article key={item.key} className="admin-edit-card admin-text-card">
              <div className="admin-text-card-head">
                <div>
                  <h3>{item.label_lv}</h3>
                  <p>{item.description_lv}</p>
                </div>

                <div className="admin-text-meta">
                  <span
                    className={`admin-status-pill${hasOverride ? ' admin-status-pill--active' : ''}`}
                  >
                    {hasOverride ? 'Mainīts' : 'Noklusējums'}
                  </span>
                  <span className="admin-text-key">{item.key}</span>
                </div>
              </div>

              <div className="admin-language-grid admin-text-language-grid">
                {LANGUAGES.map((language) => (
                  <label key={language.id} className="admin-field">
                    <span>{language.label}</span>
                    <FieldTag
                      type={item.input_type === 'textarea' ? undefined : 'text'}
                      rows={item.input_type === 'textarea' ? 3 : undefined}
                      value={item[`value_${language.id}`] ?? ''}
                      placeholder={item[`default_${language.id}`] ?? ''}
                      onChange={(event) =>
                        updateItemValue(item.key, language.id, event.target.value)
                      }
                    />
                  </label>
                ))}
              </div>

              <div className="admin-row-actions admin-row-actions--compact">
                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={() => handleReset(item)}
                  disabled={Boolean(savingKey)}
                >
                  Atjaunot noklusējumu
                </button>
                <button
                  type="button"
                  className="admin-primary-btn"
                  onClick={() => handleSave(item)}
                  disabled={Boolean(savingKey)}
                >
                  {isSaving ? 'Saglabā...' : 'Saglabāt'}
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
