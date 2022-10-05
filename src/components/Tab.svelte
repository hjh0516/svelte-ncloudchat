<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let tabItems: string[];
  export let activeItem: string;
</script>

<div class="w-full h-10">
  <ul class="flex justify-around">
    {#each tabItems as item}
      <li
        class="w-full text-center text-lg font-bold"
        on:click={() => dispatch("tabChange", item)}
      >
        <div
          class={item === activeItem
            ? "border-b-2 leading-10 border-b-cyan-500"
            : "border-b-2 leading-10 border-b-gray-100"}
        >
          {item}
        </div>
      </li>
    {/each}
  </ul>
</div>
