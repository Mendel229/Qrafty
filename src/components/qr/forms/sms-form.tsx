"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { smsContentSchema, type SmsContent } from "@/lib/qr/schemas";
import { useQrEditorStore } from "@/stores/qr-editor";

export function SmsForm() {
  const content = useQrEditorStore((s) => s.contentByType.sms);
  const setContent = useQrEditorStore((s) => s.setContent);

  const form = useForm<SmsContent>({
    resolver: zodResolver(smsContentSchema),
    defaultValues: content,
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      setContent("sms", { phone: values.phone ?? "", message: values.message ?? "" });
    });
    return () => subscription.unsubscribe();
  }, [form, setContent]);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="sms-phone">Numéro de téléphone</Label>
        <Input id="sms-phone" type="tel" autoComplete="off" {...form.register("phone")} />
        {form.formState.errors.phone && (
          <p className="text-destructive text-sm">{form.formState.errors.phone.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="sms-message">Message (facultatif)</Label>
        <Textarea id="sms-message" rows={4} {...form.register("message")} />
      </div>
    </div>
  );
}
