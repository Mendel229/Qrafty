import { describe, expect, it } from "vitest";

import {
  encodeEmail,
  encodeSms,
  encodeVcard,
  encodeWifi,
  normalizeUrl,
} from "./encoders";

describe("normalizeUrl", () => {
  it("ajoute https:// si aucun protocole n'est présent", () => {
    expect(normalizeUrl("example.com")).toBe("https://example.com");
  });

  it("conserve http:// tel quel", () => {
    expect(normalizeUrl("http://example.com")).toBe("http://example.com");
  });

  it("conserve https:// tel quel", () => {
    expect(normalizeUrl("https://example.com")).toBe("https://example.com");
  });

  it("retire les espaces autour de la valeur", () => {
    expect(normalizeUrl("  example.com  ")).toBe("https://example.com");
  });
});

describe("encodeWifi", () => {
  it("encode un réseau WPA avec mot de passe", () => {
    expect(encodeWifi({ ssid: "MonWifi", password: "secret123", encryption: "WPA" })).toBe(
      "WIFI:T:WPA;S:MonWifi;P:secret123;;",
    );
  });

  it("omet le mot de passe pour un réseau ouvert", () => {
    expect(encodeWifi({ ssid: "Cafe", encryption: "nopass" })).toBe("WIFI:T:nopass;S:Cafe;;");
  });

  it("ajoute H:true pour un réseau caché", () => {
    expect(
      encodeWifi({ ssid: "Cafe", password: "abc", encryption: "WEP", hidden: true }),
    ).toBe("WIFI:T:WEP;S:Cafe;P:abc;H:true;;");
  });

  it("échappe les caractères spéciaux du SSID (point-virgule, virgule, deux-points, antislash)", () => {
    expect(encodeWifi({ ssid: 'Wifi;a,b:c\\d"e', encryption: "nopass" })).toBe(
      'WIFI:T:nopass;S:Wifi\\;a\\,b\\:c\\\\d\\"e;;',
    );
  });

  it("échappe les caractères spéciaux du mot de passe", () => {
    expect(encodeWifi({ ssid: "Cafe", password: "a;b,c", encryption: "WPA" })).toBe(
      "WIFI:T:WPA;S:Cafe;P:a\\;b\\,c;;",
    );
  });
});

describe("encodeEmail", () => {
  it("encode une adresse seule", () => {
    expect(encodeEmail({ to: "test@example.com" })).toBe("mailto:test@example.com");
  });

  it("ajoute le sujet et le corps encodés, espaces en %20", () => {
    expect(
      encodeEmail({ to: "test@example.com", subject: "Bonjour toi", body: "Comment ça va" }),
    ).toBe("mailto:test@example.com?subject=Bonjour%20toi&body=Comment%20%C3%A7a%20va");
  });

  it("n'ajoute pas de point d'interrogation si sujet et corps sont absents", () => {
    expect(encodeEmail({ to: "test@example.com" })).not.toContain("?");
  });
});

describe("encodeSms", () => {
  it("encode un numéro avec message", () => {
    expect(encodeSms({ phone: "+33612345678", message: "Salut" })).toBe(
      "SMSTO:+33612345678:Salut",
    );
  });

  it("encode un numéro sans message", () => {
    expect(encodeSms({ phone: "+33612345678" })).toBe("SMSTO:+33612345678:");
  });
});

describe("encodeVcard", () => {
  it("encode une vCard minimale (prénom uniquement)", () => {
    const result = encodeVcard({ firstName: "Alice" });
    expect(result).toContain("BEGIN:VCARD");
    expect(result).toContain("VERSION:3.0");
    expect(result).toContain("N:;Alice;;;");
    expect(result).toContain("FN:Alice");
    expect(result).toContain("END:VCARD");
  });

  it("encode une vCard complète", () => {
    const result = encodeVcard({
      firstName: "Alice",
      lastName: "Martin",
      organization: "Acme",
      title: "Développeuse",
      phone: "+33612345678",
      email: "alice@example.com",
      website: "example.com",
      street: "1 rue de Paris",
      city: "Paris",
      zip: "75001",
      country: "France",
    });
    expect(result).toContain("N:Martin;Alice;;;");
    expect(result).toContain("FN:Alice Martin");
    expect(result).toContain("ORG:Acme");
    expect(result).toContain("TITLE:Développeuse");
    expect(result).toContain("TEL;TYPE=CELL:+33612345678");
    expect(result).toContain("EMAIL:alice@example.com");
    expect(result).toContain("URL:https://example.com");
    expect(result).toContain("ADR;TYPE=WORK:;;1 rue de Paris;Paris;;75001;France");
  });

  it("échappe la virgule et le point-virgule dans les champs", () => {
    const result = encodeVcard({ firstName: "Alice", organization: "Acme, Inc; Paris" });
    expect(result).toContain("ORG:Acme\\, Inc\\; Paris");
  });

  it("échappe les retours à la ligne", () => {
    const result = encodeVcard({ firstName: "Alice", title: "Ligne1\nLigne2" });
    expect(result).toContain("TITLE:Ligne1\\nLigne2");
  });

  it("n'ajoute pas de ligne ADR si aucun champ d'adresse n'est renseigné", () => {
    const result = encodeVcard({ firstName: "Alice" });
    expect(result).not.toContain("ADR;TYPE=WORK");
  });
});
