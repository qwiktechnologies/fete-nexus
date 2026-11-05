export function gbp(pence: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(pence / 100);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(date);
}

export function formatWhen(date: Date, time: string) {
  return `${formatDate(date)} at ${time}`;
}

export function formatStamp(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  }).format(date);
}

export function poundsToPence(value: string) {
  const normalised = value.replace(/,/g, "").trim();
  if (!normalised) return null;
  const amount = Number(normalised);
  if (!Number.isFinite(amount) || amount < 0) return null;
  return Math.round(amount * 100);
}

export function priceLabel(pricePence: number | null, purchasable: boolean) {
  if (!purchasable || pricePence == null) return "Quote on request";
  return gbp(pricePence);
}

export function todayInLondon() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function safeNextPath(value: FormDataEntryValue | null) {
  const next = String(value ?? "");
  if (!next.startsWith("/") || next.startsWith("//")) return null;
  return next;
}
