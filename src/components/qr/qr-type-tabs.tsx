"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QR_TYPES } from "@/lib/qr/types";
import { useQrEditorStore } from "@/stores/qr-editor";

export function QrTypeTabs() {
  const type = useQrEditorStore((s) => s.type);
  const setType = useQrEditorStore((s) => s.setType);

  return (
    <Tabs value={type} onValueChange={(value) => setType(value as typeof type)}>
      <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
        {QR_TYPES.map((entry) => (
          <TabsTrigger key={entry.key} value={entry.key}>
            {entry.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
