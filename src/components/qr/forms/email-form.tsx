"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { emailContentSchema, type EmailContent } from "@/lib/qr/schemas";
import { useQrEditorStore } from "@/stores/qr-editor";

export function EmailForm() {
  const content = useQrEditorStore((s) => s.contentByType.email);
  const setContent = useQrEditorStore((s) => s.setContent);

  const form = useForm<EmailContent>({
    resolver: zodResolver(emailContentSchema),
    defaultValues: content,
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      setContent("email", {
        to: values.to ?? "",
        subject: values.subject ?? "",
        body: values.body ?? "",
      });
    });
    return () => subscription.unsubscribe();
  }, [form, setContent]);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email-to">Adresse email</Label>
        <Input id="email-to" type="email" autoComplete="off" {...form.register("to")} />
        {form.formState.errors.to && (
          <p className="text-destructive text-sm">{form.formState.errors.to.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email-subject">Sujet (facultatif)</Label>
        <Input id="email-subject" autoComplete="off" {...form.register("subject")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email-body">Message (facultatif)</Label>
        <Textarea id="email-body" rows={4} {...form.register("body")} />
      </div>
    </div>
  );
}
