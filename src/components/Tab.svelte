<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let tabItems: string[];
  export let activeItem: string;
</script>

<!-- <div class="fixed top-0 w-full h-full pt-2 pl-5 pr-5">
  <ul class="flex justify-around">
    {#each tabItems as item}
      <li
        class="w-full text-center text-base font-sbaggrob"
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
</div> -->

<div class="chat_case">
  <ul class="clear aggro">
    {#each tabItems as item}
      <li on:click={() => dispatch("tabChange", item)}>
        <!-- svelte-ignore a11y-missing-attribute -->
        <a class={item === activeItem ? "on" : ""}><span>{item}</span></a>
      </li>
    {/each}
  </ul>
</div>
