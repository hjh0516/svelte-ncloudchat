import { toasts } from "svelte-toasts";

export function showToast(title: string, description: string) {
  const toast = toasts.add({
    title: title,
    description: description,
    duration: 2000,
    placement: "bottom-center",
    type: "error",
    theme: "dark",
  });
  return toast;
}
