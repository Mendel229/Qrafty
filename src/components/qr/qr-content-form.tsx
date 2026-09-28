"use client";

import { EmailForm } from "@/components/qr/forms/email-form";
import { SmsForm } from "@/components/qr/forms/sms-form";
import { TextForm } from "@/components/qr/forms/text-form";
import { UrlForm } from "@/components/qr/forms/url-form";
import { VcardForm } from "@/components/qr/forms/vcard-form";
import { WifiForm } from "@/components/qr/forms/wifi-form";
import type { QrType } from "@/lib/qr/types";

/** Affiche le formulaire correspondant au type de QR actif. Chaque formulaire garde son propre état (un remount par changement d'onglet est volontaire : les données sont déjà sauvegardées dans le store). */
export function QrContentForm({ type }: { type: QrType }) {
  switch (type) {
    case "url":
      return <UrlForm />;
    case "text":
      return <TextForm />;
    case "wifi":
      return <WifiForm />;
    case "email":
      return <EmailForm />;
    case "sms":
      return <SmsForm />;
    case "vcard":
      return <VcardForm />;
  }
}
