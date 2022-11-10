import type { ToastType } from "svelte-toasts/types/common";

import { toasts } from "svelte-toasts";

export function showToast(type: string, title: string, description: string) {
  const toast = toasts.add({
    title: title,
    description: description,
    duration: 2000,
    placement: "bottom-center",
    type: type as ToastType,
    theme: "dark",
  });
  return toast;
}
