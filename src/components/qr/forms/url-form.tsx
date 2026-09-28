"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { urlContentSchema, type UrlContent } from "@/lib/qr/schemas";
import { useQrEditorStore } from "@/stores/qr-editor";

export function UrlForm() {
  const content = useQrEditorStore((s) => s.contentByType.url);
  const setContent = useQrEditorStore((s) => s.setContent);

  const form = useForm<UrlContent>({
    resolver: zodResolver(urlContentSchema),
    defaultValues: content,
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      setContent("url", { url: values.url ?? "" });
    });
    return () => subscription.unsubscribe();
  }, [form, setContent]);

  return (
    <div className="space-y-1.5">
      <Label htmlFor="url-field">Adresse du site</Label>
      <Input
        id="url-field"
        placeholder="exemple.com"
        autoComplete="off"
        {...form.register("url")}
      />
      {form.formState.errors.url && (
        <p className="text-destructive text-sm">{form.formState.errors.url.message}</p>
      )}
    </div>
  );
}
