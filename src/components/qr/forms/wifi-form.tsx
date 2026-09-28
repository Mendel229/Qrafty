"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { wifiContentSchema, type WifiContent } from "@/lib/qr/schemas";
import { useQrEditorStore } from "@/stores/qr-editor";

const ENCRYPTION_LABELS: Record<WifiContent["encryption"], string> = {
  WPA: "WPA / WPA2",
  WEP: "WEP",
  nopass: "Réseau ouvert (sans mot de passe)",
};

export function WifiForm() {
  const content = useQrEditorStore((s) => s.contentByType.wifi);
  const setContent = useQrEditorStore((s) => s.setContent);

  const form = useForm<WifiContent>({
    resolver: zodResolver(wifiContentSchema),
    defaultValues: content,
    mode: "onChange",
  });

  const encryption = form.watch("encryption");

  useEffect(() => {
    const subscription = form.watch((values) => {
      setContent("wifi", {
        ssid: values.ssid ?? "",
        password: values.password ?? "",
        encryption: values.encryption ?? "WPA",
        hidden: values.hidden ?? false,
      });
    });
    return () => subscription.unsubscribe();
  }, [form, setContent]);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="wifi-ssid">Nom du réseau (SSID)</Label>
        <Input id="wifi-ssid" autoComplete="off" {...form.register("ssid")} />
        {form.formState.errors.ssid && (
          <p className="text-destructive text-sm">{form.formState.errors.ssid.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="wifi-encryption">Sécurité</Label>
        <Controller
          control={form.control}
          name="encryption"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="wifi-encryption" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ENCRYPTION_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {encryption !== "nopass" && (
        <div className="space-y-1.5">
          <Label htmlFor="wifi-password">Mot de passe</Label>
          <Input id="wifi-password" type="text" autoComplete="off" {...form.register("password")} />
          {form.formState.errors.password && (
            <p className="text-destructive text-sm">{form.formState.errors.password.message}</p>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Controller
          control={form.control}
          name="hidden"
          render={({ field }) => (
            <Switch id="wifi-hidden" checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
        <Label htmlFor="wifi-hidden" className="font-normal">
          Réseau caché
        </Label>
      </div>
    </div>
  );
}
