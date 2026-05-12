import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_LOCALE,
  LOCALE_OPTIONS,
  SUPPORTED_LOCALES,
  getLocaleText,
} from '../content/publicTranslations'
import { getActiveTextOverrides } from './cmsApi'

const STORAGE_KEY = 'canadasleigh_public_locale'

const legacyLocaleMap = {
  LAT: 'lv',
  LV: 'lv',
  ENG: 'en',
  EN: 'en',
  RUS: 'ru',
  RU: 'ru',
}

const LocaleContext = createContext(null)

function isNumericSegment(segment) {
  return /^\d+$/.test(segment)
}

function cloneTranslationValue(value) {
  if (Array.isArray(value)) {
    return value.map(cloneTranslationValue)
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((copy, [key, child]) => {
      copy[key] = cloneTranslationValue(child)
      return copy
    }, {})
  }

  return value
}

function applyTextOverride(target, textKey, nextValue) {
  if (typeof nextValue !== 'string') return

  const segments = String(textKey || '').split('.').filter(Boolean)
  if (segments.length === 0) return

  let current = target

  for (let index = 0; index < segments.length - 1; index += 1) {
    if (!current || typeof current !== 'object') return

    const segment = segments[index]
    const key = isNumericSegment(segment) ? Number(segment) : segment
    current = current[key]
  }

  if (!current || typeof current !== 'object') return

  const leafSegment = segments[segments.length - 1]
  const leafKey = isNumericSegment(leafSegment) ? Number(leafSegment) : leafSegment

  if (typeof current[leafKey] === 'string') {
    current[leafKey] = nextValue
  }
}

function mergeTextOverrides(baseText, overrides, locale) {
  const mergedText = cloneTranslationValue(baseText)
  const valueKey = `value_${normalizeLocale(locale)}`

  overrides.forEach((override) => {
    if (override?.is_active === false) return
    const nextValue = override?.[valueKey]

    if (nextValue !== null && nextValue !== undefined) {
      applyTextOverride(mergedText, override.text_key, nextValue)
    }
  })

  return mergedText
}

export function normalizeLocale(value) {
  if (!value) return DEFAULT_LOCALE

  const raw = String(value).trim()
  const mapped = legacyLocaleMap[raw.toUpperCase()]
  if (mapped) return mapped

  const lower = raw.toLowerCase()
  return SUPPORTED_LOCALES.includes(lower) ? lower : DEFAULT_LOCALE
}

function getInitialLocale() {
  if (typeof window === 'undefined') return DEFAULT_LOCALE

  try {
    return normalizeLocale(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    return DEFAULT_LOCALE
  }
}

export function pickLocalizedField(item, field, locale, fallback = '') {
  if (!item) return fallback || ''

  const normalizedLocale = normalizeLocale(locale)
  const localizedValue = item[`${field}_${normalizedLocale}`]
  const lvValue = item[`${field}_lv`]
  const defaultValue = item[field]

  return localizedValue || lvValue || defaultValue || fallback || ''
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(getInitialLocale)
  const [textOverrides, setTextOverrides] = useState([])

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dataset.locale = locale

    try {
      window.localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      // Ignore storage failures; the current session locale still works.
    }
  }, [locale])

  useEffect(() => {
    let active = true
    setTextOverrides([])

    getActiveTextOverrides(locale)
      .then((rows) => {
        if (active) setTextOverrides(rows)
      })
      .catch(() => {
        if (active) setTextOverrides([])
      })

    return () => {
      active = false
    }
  }, [locale])

  const setLocale = (nextLocale) => {
    setLocaleState(normalizeLocale(nextLocale))
  }

  const text = useMemo(
    () => mergeTextOverrides(getLocaleText(locale), textOverrides, locale),
    [locale, textOverrides],
  )

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      text,
      localeOptions: LOCALE_OPTIONS,
      activeLocaleLabel:
        LOCALE_OPTIONS.find((option) => option.locale === locale)?.label ?? 'LAT',
    }),
    [locale, text],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)

  if (context) return context

  return {
    locale: DEFAULT_LOCALE,
    setLocale: () => {},
    text: getLocaleText(DEFAULT_LOCALE),
    localeOptions: LOCALE_OPTIONS,
    activeLocaleLabel: 'LAT',
  }
}
