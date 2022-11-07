<script lang="ts">
  import { drawImage } from "$lib/Image";
  import { onMount } from "svelte";

  export let item;
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
  <span
    class="w-12 mr-5 text-right text-base font-semibold text-gray-400"
    on:click={() => {
      unban(item.target);
    }}>해제</span
  >
</div>
