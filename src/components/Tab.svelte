<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let tabItems: string[];
  export let activeItem: string;
</script>

<div class="flex items-center relative h-10">
  <ul class="w-full flex justify-around">
    {#each tabItems as item}
      <li
        class="w-full text-center font-medium"
        on:click={() => dispatch("tabChange", item)}
      >
        <div
          class={item === activeItem
            ? "border-b-2 leading-10 border-b-cyan-400"
            : "border-b-2 leading-10 border-b-gray-100"}
        >
          {item}
        </div>
      </li>
    {/each}
  </ul>
</div>
