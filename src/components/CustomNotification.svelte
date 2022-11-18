<script lang="ts">
  import { fade } from "svelte/transition";

  export let notification: { text?: string } = {};
</script>

<div
  transition:fade
  class="w-max mb-48 -mt-48 pt-2 pb-3 pr-6 pl-6 bg-gray-700 rounded-2xl"
>
  <span class="text-gray-100 text-2xl">{notification.text}</span>
</div>
