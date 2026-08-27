const GUATEMALA_LOCALE = "es-GT";

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat(GUATEMALA_LOCALE, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const LONG_DATE_FORMATTER = new Intl.DateTimeFormat(GUATEMALA_LOCALE, {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const SHORT_DATE_WITHOUT_YEAR_FORMATTER = new Intl.DateTimeFormat(
  GUATEMALA_LOCALE,
  {
    day: "numeric",
    month: "short",
  },
);

const TIME_FORMATTER = new Intl.DateTimeFormat(GUATEMALA_LOCALE, {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatAppointmentTime(value: string): string {
  return TIME_FORMATTER.format(new Date(value));
}

export function formatAppointmentDate(value: string): string {
  return LONG_DATE_FORMATTER.format(new Date(value));
}

/**
 * Formats a date-only value such as "2026-06-04".
 *
 * Date-only values must not be parsed through new Date(value),
 * because JavaScript interprets ISO date-only strings as UTC.
 */
export function formatDateOnly(value: string): string {
  const [year, month, day] = value.split("-").map(Number);

  return SHORT_DATE_FORMATTER.format(new Date(year, month - 1, day));
}

export function formatShortDate(value: string): string {
  const [year, month, day] = value.split("-").map(Number);

  return SHORT_DATE_WITHOUT_YEAR_FORMATTER.format(
    new Date(year, month - 1, day),
  );
}

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isToday(date: string): boolean {
  return date === toDateInputValue(new Date());
}

export function addDays(date: string, amount: number): string {
  const result = new Date(`${date}T00:00:00`);

  result.setDate(result.getDate() + amount);

  return toDateInputValue(result);
}

export function combineDateAndTime(date: string, time: string): string {
  return `${date}T${time}:00`;
}

export function extractDate(value: string): string {
  return value.slice(0, 10);
}

export function extractTime(value: string): string {
  return value.slice(11, 16);
}

export function toLocalDateTimeString(date: Date): string {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");

  const minutes = String(date.getMinutes()).padStart(2, "0");

  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export function formatRecordDate(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return formatShortDate(value);
  }

  return formatShortDate(extractDate(value));
}

const MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat(GUATEMALA_LOCALE, {
  month: "long",
  year: "numeric",
});

export function toMonthStart(date: string): string {
  return `${date.slice(0, 7)}-01`;
}

export function addMonths(date: string, amount: number): string {
  const [year, month] = date.split("-").map(Number);

  return toDateInputValue(new Date(year, month - 1 + amount, 1));
}

export function formatMonthYear(date: string): string {
  const [year, month] = date.split("-").map(Number);

  return MONTH_YEAR_FORMATTER.format(new Date(year, month - 1, 1));
}
