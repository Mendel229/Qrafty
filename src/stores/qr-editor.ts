import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { type ContentByType, defaultContentByType, designSchema, type QrDesign } from "@/lib/qr/schemas";
import type { QrType } from "@/lib/qr/types";

const defaultDesign = designSchema.parse({});

interface QrEditorState {
  type: QrType;
  contentByType: ContentByType;
  design: QrDesign;
  setType: (type: QrType) => void;
  setContent: <T extends QrType>(type: T, content: ContentByType[T]) => void;
  setDesign: (patch: Partial<QrDesign>) => void;
  resetDesign: () => void;
}

export const useQrEditorStore = create<QrEditorState>()(
  persist(
    (set) => ({
      type: "url",
      contentByType: defaultContentByType,
      design: defaultDesign,
      setType: (type) => set({ type }),
      setContent: (type, content) =>
        set((state) => ({
          contentByType: { ...state.contentByType, [type]: content },
        })),
      setDesign: (patch) => set((state) => ({ design: { ...state.design, ...patch } })),
      resetDesign: () => set({ design: defaultDesign }),
    }),
    {
      name: "qr-editor-storage",
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
    },
  ),
);
