<script lang="ts">
  import type { ToastProps } from "svelte-toasts/types/common";

  export let data: ToastProps;
</script>

<div
  class="w-full fixed bottom-1/2 left-1/2 -translate-x-1/2 pt-3 pb-3 pr-5 pl-5 flex bg-gray-500 items-center rounded-md {data.type}"
>
  <div class="p-1 rounded-full bg-red-500 mr-5 text-center align-middle">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      class="w-4 h-4"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </div>
  <div class="flex flex-col">
    <span class="text-gray-50 text-base font-bold">{data.title}</span>
    <span class="text-gray-50 text-base font-semibold text-right"
      >{data.description}</span
    >
  </div>
</div>
