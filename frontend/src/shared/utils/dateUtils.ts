const GUATEMALA_LOCALE = "es-GT";

export function formatAppointmentTime(value: string): string {
  return new Intl.DateTimeFormat(GUATEMALA_LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

export function formatAppointmentDate(value: string): string {
  return new Intl.DateTimeFormat(GUATEMALA_LOCALE, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat(GUATEMALA_LOCALE, {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
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
