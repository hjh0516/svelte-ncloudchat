<script lang="ts">
  import { onMount } from "svelte";
  import Spinner from "./Spinner.svelte";

  export let src: string;
  export let className: string;

  let loading = false;
  let failed = false;

  onMount(() => {
    const img = new Image();
    img.src = src;
    loading = true;

    img.onload = () => {
      loading = false;
      failed = false;
    };

    img.onerror = () => {
      loading = false;
      failed = true;
    };
  });
</script>

{#if loading}
  <div class="w-10 h-24">
    <Spinner />
  </div>
{:else if failed}
  <img src="default.jpg" alt="error_image" class={className} />
{:else}
  <img {src} alt="image_url" class={className} />
{/if}
