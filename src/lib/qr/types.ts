export const QR_TYPES = [
  { key: "url", slug: "url", label: "URL" },
  { key: "text", slug: "texte", label: "Texte" },
  { key: "wifi", slug: "wifi", label: "WiFi" },
  { key: "email", slug: "email", label: "Email" },
  { key: "sms", slug: "sms", label: "SMS" },
  { key: "vcard", slug: "vcard", label: "vCard" },
] as const;

export type QrType = (typeof QR_TYPES)[number]["key"];
export type QrTypeSlug = (typeof QR_TYPES)[number]["slug"];

export function slugToType(slug: string): QrType | undefined {
  return QR_TYPES.find((entry) => entry.slug === slug)?.key;
}

export function typeToSlug(type: QrType): QrTypeSlug {
  return QR_TYPES.find((entry) => entry.key === type)!.slug;
}

export function typeLabel(type: QrType): string {
  return QR_TYPES.find((entry) => entry.key === type)!.label;
}
