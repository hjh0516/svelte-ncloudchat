<script lang="ts">
  import Spinner from "./Spinner.svelte";
  import { onMount } from "svelte";

  export let src: string;

  let loading = false;
  let failed = false;

  onMount(() => {
    const img = new Image();
    loading = true;

    img.onload = () => {
      loading = false;
      failed = false;
    };

    img.onerror = () => {
      loading = false;
      failed = true;
    };

    img.src = src;
  });
</script>

{#if loading}
  <div class="w-12 h-12 mr-5 ml-5">
    <Spinner />
  </div>
{:else if failed}
  <img
    src="default.jpg"
    alt="error_image"
    class="rounded-2xl"
    style="height: -webkit-fill-available"
  />
{:else}
  <img
    {src}
    alt="sended_image"
    class="rounded-2xl"
    style="height: -webkit-fill-available"
    loading="lazy"
  />
{/if}
