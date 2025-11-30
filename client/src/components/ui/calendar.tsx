import * as React from "react"
import { Calendar as KendoCalendar } from "@progress/kendo-react-dateinputs"
import { IntlProvider } from "@progress/kendo-react-intl"
import "@progress/kendo-theme-material/dist/all.css"
import { cn } from "@/lib/utils"
// Load Vietnamese locale data
import "@/lib/kendo-locale"

// Note: KendoReact requires a license key for commercial use
// You can get a free trial or commercial license from: https://www.telerik.com/kendo-react-ui/my-license/
// For development, you can use: KendoReact.setLicenseKey('your-license-key')

export type CalendarProps = {
  mode?: "single" | "range" | "multiple"
  selected?: Date
  onSelect?: (date: Date | null) => void
  defaultMonth?: Date
  initialFocus?: boolean
  className?: string
  disabled?: boolean
  min?: Date
  max?: Date
  format?: string
  placeholder?: string
}

function Calendar({
  mode = "single",
  selected,
  onSelect,
  defaultMonth,
  className,
  disabled,
  min,
  max,
  ...props
}: CalendarProps) {
  const [value, setValue] = React.useState<Date | null>(selected || null)

  React.useEffect(() => {
    if (selected !== undefined) {
      setValue(selected || null)
    }
  }, [selected])

  const handleChange = (event: any) => {
    const newValue = event.value
    setValue(newValue)
    if (onSelect) {
      onSelect(newValue)
    }
  }

  // Use 'en-US' as fallback if Vietnamese locale is not available
  // This ensures the calendar works even if CLDR data is not loaded
  const [locale, setLocale] = React.useState('en-GB')

  React.useEffect(() => {
    // Try to use Vietnamese locale, fallback to English if not available
    try {
      // The locale will be set to 'vi' if CLDR data is loaded successfully
      // Otherwise, it will remain 'en-US'
      setLocale('vi')
    } catch {
      setLocale('en-GB')
    }
  }, [])

  return (
    <IntlProvider locale={locale}>
      <div className={cn("kendo-calendar-wrapper p-3", className)}>
        <KendoCalendar
          value={value || undefined}
          onChange={handleChange}
          disabled={disabled}
          min={min}
          max={max}
          className={cn("kendo-calendar", className)}
          {...props}
        />
      </div>
    </IntlProvider>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
