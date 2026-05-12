import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_LOCALE,
  LOCALE_OPTIONS,
  SUPPORTED_LOCALES,
  getLocaleText,
} from '../content/publicTranslations'

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

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dataset.locale = locale

    try {
      window.localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      // Ignore storage failures; the current session locale still works.
    }
  }, [locale])

  const setLocale = (nextLocale) => {
    setLocaleState(normalizeLocale(nextLocale))
  }

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      text: getLocaleText(locale),
      localeOptions: LOCALE_OPTIONS,
      activeLocaleLabel:
        LOCALE_OPTIONS.find((option) => option.locale === locale)?.label ?? 'LAT',
    }),
    [locale],
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
