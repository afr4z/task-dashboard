import type { KeyboardEvent } from "react";

type Options = {
  onSubmit: () => void;
  onCancel?: () => void;
};

export function useTaskKeyboard({ onSubmit, onCancel }: Options) {
  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }

    if (e.key === "Escape") {
      console.log("Escape pressed");
      e.preventDefault();
      e.stopPropagation();
      onCancel?.();
    }
  };

  return { handleKeyDown };
}
