<script lang="ts">
  import { drawImage } from "$lib/Image";
  import { onMount } from "svelte";

  export let item;
  export let ban = (target: number) => {};
  export let unban = (target: number) => {};

  let canvas: HTMLCanvasElement;

  onMount(() => {
    drawImage(canvas, item.profile);
  });
</script>

<div
  class="w-full h-auto p-3 mt-3 border border-gray-100 flex items-center rounded-3xl shadow-md"
>
  <canvas
    class="w-12 h-12 border border-gray-200 rounded-full"
    bind:this={canvas}
  />
  <span class="w-full ml-5 mt-1 text-left font-sbaggrom text-base"
    >{item.nickname}</span
  >
  {#if item.is_ban}
    <span
      class="w-12 mr-5 text-right text-base font-semibold text-gray-400"
      on:click={() => {
        item.is_ban = 0;
        unban(item.user_idx);
      }}>해제</span
    >
  {:else}
    <span
      class="w-12 mr-5 text-right text-base font-semibold text-gray-400"
      on:click={() => {
        item.is_ban = 1;
        ban(item.user_idx);
      }}>차단</span
    >
  {/if}
</div>
