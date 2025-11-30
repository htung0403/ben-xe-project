import { load } from '@progress/kendo-react-intl'

// Load CLDR data for Vietnamese locale
// This file is imported at the app level to ensure CLDR data is loaded before components use it

// Try to load CLDR data - if it fails, the calendar will use English locale as fallback
const loadVietnameseLocale = async () => {
  try {
    const [
      likelySubtags,
      weekData,
      currencyData,
      numbers,
      caGregorian,
      timeZoneNames,
      dateFields
    ] = await Promise.all([
      import('cldr-data/supplemental/likelySubtags.json'),
      import('cldr-data/supplemental/weekData.json'),
      import('cldr-data/supplemental/currencyData.json'),
      import('cldr-data/main/vi/numbers.json'),
      import('cldr-data/main/vi/ca-gregorian.json'),
      import('cldr-data/main/vi/timeZoneNames.json'),
      import('cldr-data/main/vi/dateFields.json')
    ])

    load(
      (likelySubtags as any).default || likelySubtags,
      (weekData as any).default || weekData,
      (currencyData as any).default || currencyData,
      (numbers as any).default || numbers,
      (caGregorian as any).default || caGregorian,
      (timeZoneNames as any).default || timeZoneNames,
      (dateFields as any).default || dateFields
    )

    return true
  } catch (error) {
    console.warn('Failed to load CLDR data for Vietnamese locale. Calendar will use English locale as fallback.', error)
    return false
  }
}

// Start loading locale data immediately
loadVietnameseLocale()

export { loadVietnameseLocale }

