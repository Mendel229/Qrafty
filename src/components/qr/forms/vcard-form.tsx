"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { vcardContentSchema, type VcardContent } from "@/lib/qr/schemas";
import { useQrEditorStore } from "@/stores/qr-editor";

export function VcardForm() {
  const content = useQrEditorStore((s) => s.contentByType.vcard);
  const setContent = useQrEditorStore((s) => s.setContent);

  const form = useForm<VcardContent>({
    resolver: zodResolver(vcardContentSchema),
    defaultValues: content,
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      setContent("vcard", {
        firstName: values.firstName ?? "",
        lastName: values.lastName ?? "",
        organization: values.organization ?? "",
        title: values.title ?? "",
        phone: values.phone ?? "",
        email: values.email ?? "",
        website: values.website ?? "",
        street: values.street ?? "",
        city: values.city ?? "",
        zip: values.zip ?? "",
        country: values.country ?? "",
      });
    });
    return () => subscription.unsubscribe();
  }, [form, setContent]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="vcard-firstName">Prénom</Label>
          <Input id="vcard-firstName" autoComplete="off" {...form.register("firstName")} />
          {form.formState.errors.firstName && (
            <p className="text-destructive text-sm">{form.formState.errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vcard-lastName">Nom</Label>
          <Input id="vcard-lastName" autoComplete="off" {...form.register("lastName")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="vcard-organization">Entreprise</Label>
          <Input id="vcard-organization" autoComplete="off" {...form.register("organization")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vcard-title">Poste</Label>
          <Input id="vcard-title" autoComplete="off" {...form.register("title")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="vcard-phone">Téléphone</Label>
          <Input id="vcard-phone" type="tel" autoComplete="off" {...form.register("phone")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vcard-email">Email</Label>
          <Input id="vcard-email" type="email" autoComplete="off" {...form.register("email")} />
          {form.formState.errors.email && (
            <p className="text-destructive text-sm">{form.formState.errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="vcard-website">Site web</Label>
        <Input id="vcard-website" autoComplete="off" {...form.register("website")} />
      </div>

      <Separator />

      <div className="space-y-1.5">
        <Label htmlFor="vcard-street">Adresse</Label>
        <Input id="vcard-street" autoComplete="off" {...form.register("street")} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="vcard-city">Ville</Label>
          <Input id="vcard-city" autoComplete="off" {...form.register("city")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vcard-zip">Code postal</Label>
          <Input id="vcard-zip" autoComplete="off" {...form.register("zip")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vcard-country">Pays</Label>
          <Input id="vcard-country" autoComplete="off" {...form.register("country")} />
        </div>
      </div>
    </div>
  );
}
