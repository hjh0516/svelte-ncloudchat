<script lang="ts">
  import Spinner from "./Spinner.svelte";
  import { onMount } from "svelte";

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
  <div class="w-12 h-12">
    <Spinner />
  </div>
{:else if failed}
  <img src="default.jpg" alt="error_image" class="rounded-2xl" />
{:else}
  <img
    {src}
    alt="image_url"
    class={className}
    style="height: -webkit-fill-available"
  />
{/if}
