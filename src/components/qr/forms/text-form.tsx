"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { textContentSchema, type TextContent } from "@/lib/qr/schemas";
import { useQrEditorStore } from "@/stores/qr-editor";

export function TextForm() {
  const content = useQrEditorStore((s) => s.contentByType.text);
  const setContent = useQrEditorStore((s) => s.setContent);

  const form = useForm<TextContent>({
    resolver: zodResolver(textContentSchema),
    defaultValues: content,
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      setContent("text", { text: values.text ?? "" });
    });
    return () => subscription.unsubscribe();
  }, [form, setContent]);

  return (
    <div className="space-y-1.5">
      <Label htmlFor="text-field">Texte</Label>
      <Textarea
        id="text-field"
        placeholder="Écris le texte à encoder..."
        rows={5}
        {...form.register("text")}
      />
      {form.formState.errors.text && (
        <p className="text-destructive text-sm">{form.formState.errors.text.message}</p>
      )}
    </div>
  );
}
