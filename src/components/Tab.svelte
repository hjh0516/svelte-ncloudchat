<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let tabItems: string[];
  export let activeItem: string;
</script>

<div class="chat_case">
  <ul class="clear aggro w-full">
    {#each tabItems as item}
      <li on:click={() => dispatch("tabChange", item)}>
        <!-- svelte-ignore a11y-missing-attribute -->
        <a class={item === activeItem ? "on" : ""}><span>{item}</span></a>
      </li>
    {/each}
  </ul>
</div>
