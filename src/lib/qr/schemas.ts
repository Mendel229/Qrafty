import { z } from "zod";

import type { QrType } from "./types";

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Couleur hexadécimale invalide (ex: #80EF80)");

// ---------------------------------------------------------------------------
// Contenu par type de QR code
// ---------------------------------------------------------------------------

export const urlContentSchema = z.object({
  url: z.string().min(1, "L'URL est requise"),
});

export const textContentSchema = z.object({
  text: z.string().min(1, "Le texte est requis").max(2000, "2000 caractères maximum"),
});

export const wifiContentSchema = z.object({
  ssid: z.string().min(1, "Le nom du réseau est requis").max(64, "64 caractères maximum"),
  password: z.string().max(64, "64 caractères maximum").optional(),
  encryption: z.enum(["WPA", "WEP", "nopass"]),
  hidden: z.boolean(),
});

export const emailContentSchema = z.object({
  to: z.string().email("Adresse email invalide"),
  subject: z.string().max(200, "200 caractères maximum").optional(),
  body: z.string().max(2000, "2000 caractères maximum").optional(),
});

export const smsContentSchema = z.object({
  phone: z.string().min(1, "Le numéro est requis").max(20, "20 caractères maximum"),
  message: z.string().max(300, "300 caractères maximum").optional(),
});

export const vcardContentSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis").max(100, "100 caractères maximum"),
  lastName: z.string().max(100, "100 caractères maximum").optional(),
  organization: z.string().max(100, "100 caractères maximum").optional(),
  title: z.string().max(100, "100 caractères maximum").optional(),
  phone: z.string().max(30, "30 caractères maximum").optional(),
  email: z.union([z.string().email("Adresse email invalide"), z.literal("")]).optional(),
  website: z.string().max(200, "200 caractères maximum").optional(),
  street: z.string().max(200, "200 caractères maximum").optional(),
  city: z.string().max(100, "100 caractères maximum").optional(),
  zip: z.string().max(20, "20 caractères maximum").optional(),
  country: z.string().max(100, "100 caractères maximum").optional(),
});

export type UrlContent = z.infer<typeof urlContentSchema>;
export type TextContent = z.infer<typeof textContentSchema>;
export type WifiContent = z.infer<typeof wifiContentSchema>;
export type EmailContent = z.infer<typeof emailContentSchema>;
export type SmsContent = z.infer<typeof smsContentSchema>;
export type VcardContent = z.infer<typeof vcardContentSchema>;

export const contentSchemaByType = {
  url: urlContentSchema,
  text: textContentSchema,
  wifi: wifiContentSchema,
  email: emailContentSchema,
  sms: smsContentSchema,
  vcard: vcardContentSchema,
} satisfies Record<QrType, z.ZodTypeAny>;

export const defaultContentByType: {
  url: UrlContent;
  text: TextContent;
  wifi: WifiContent;
  email: EmailContent;
  sms: SmsContent;
  vcard: VcardContent;
} = {
  url: { url: "" },
  text: { text: "" },
  wifi: { ssid: "", password: "", encryption: "WPA", hidden: false },
  email: { to: "", subject: "", body: "" },
  sms: { phone: "", message: "" },
  vcard: {
    firstName: "",
    lastName: "",
    organization: "",
    title: "",
    phone: "",
    email: "",
    website: "",
    street: "",
    city: "",
    zip: "",
    country: "",
  },
};

export type ContentByType = typeof defaultContentByType;

// ---------------------------------------------------------------------------
// Design (couleurs, formes, logo)
// ---------------------------------------------------------------------------

export const designSchema = z.object({
  dotsColor: hex.default("#000000"),
  backgroundColor: hex.default("#ffffff"),
  dotsType: z
    .enum(["square", "dots", "rounded", "extra-rounded", "classy", "classy-rounded"])
    .default("square"),
  cornersSquareType: z.enum(["square", "dot", "extra-rounded"]).default("square"),
  cornersDotType: z.enum(["square", "dot"]).default("square"),
  logoUrl: z.string().nullable().default(null),
  logoSize: z.number().min(0.1).max(0.4).default(0.25),
  margin: z.number().int().min(0).max(40).default(10),
});

export type QrDesign = z.infer<typeof designSchema>;
