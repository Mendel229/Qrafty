import type {
  EmailContent,
  SmsContent,
  TextContent,
  UrlContent,
  VcardContent,
  WifiContent,
} from "./schemas";
import type { QrType } from "./types";

// Échappement requis par le format WiFi : \ ; , : "
const escapeWifi = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");

// Échappement vCard : \ , ; et retours à la ligne
const escapeVcard = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\r?\n/g, "\\n");

export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function encodeWifi(d: {
  ssid: string;
  password?: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden?: boolean;
}) {
  const parts = [`T:${d.encryption}`, `S:${escapeWifi(d.ssid)}`];
  if (d.encryption !== "nopass" && d.password) parts.push(`P:${escapeWifi(d.password)}`);
  if (d.hidden) parts.push("H:true");
  return `WIFI:${parts.join(";")};;`;
}

export function encodeEmail(d: { to: string; subject?: string; body?: string }) {
  const params = new URLSearchParams();
  if (d.subject) params.set("subject", d.subject);
  if (d.body) params.set("body", d.body);
  const qs = params.toString().replace(/\+/g, "%20");
  return `mailto:${d.to}${qs ? `?${qs}` : ""}`;
}

export function encodeSms(d: { phone: string; message?: string }) {
  return `SMSTO:${d.phone}:${d.message ?? ""}`;
}

export function encodeVcard(d: {
  firstName: string;
  lastName?: string;
  organization?: string;
  title?: string;
  phone?: string;
  email?: string;
  website?: string;
  street?: string;
  city?: string;
  zip?: string;
  country?: string;
}) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVcard(d.lastName ?? "")};${escapeVcard(d.firstName)};;;`,
    `FN:${escapeVcard([d.firstName, d.lastName].filter(Boolean).join(" "))}`,
  ];
  if (d.organization) lines.push(`ORG:${escapeVcard(d.organization)}`);
  if (d.title) lines.push(`TITLE:${escapeVcard(d.title)}`);
  if (d.phone) lines.push(`TEL;TYPE=CELL:${d.phone}`);
  if (d.email) lines.push(`EMAIL:${d.email}`);
  if (d.website) lines.push(`URL:${normalizeUrl(d.website)}`);
  if (d.street || d.city || d.zip || d.country) {
    lines.push(
      `ADR;TYPE=WORK:;;${escapeVcard(d.street ?? "")};${escapeVcard(d.city ?? "")};;${escapeVcard(d.zip ?? "")};${escapeVcard(d.country ?? "")}`,
    );
  }
  lines.push("END:VCARD");
  return lines.join("\r\n");
}

/** Transforme le contenu (validé) d'un formulaire en chaîne à encoder dans le QR code. */
export function buildQrData(type: QrType, content: unknown): string {
  switch (type) {
    case "url":
      return normalizeUrl((content as UrlContent).url);
    case "text":
      return (content as TextContent).text;
    case "wifi":
      return encodeWifi(content as WifiContent);
    case "email":
      return encodeEmail(content as EmailContent);
    case "sms":
      return encodeSms(content as SmsContent);
    case "vcard":
      return encodeVcard(content as VcardContent);
  }
}
