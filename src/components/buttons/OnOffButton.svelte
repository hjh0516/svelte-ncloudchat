<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let id: string;
  export let checked: boolean;

  const dispatch = createEventDispatcher();
  const change = () => dispatch("change");
</script>

<label for={id}>
  <input {id} type="checkbox" class="sr-only" bind:checked on:change={change} />
  {#if checked}
    <div
      class="w-14 bg-yellow-300 p-1 rounded-md flex justify-between items-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="3"
        stroke="currentColor"
        class="w-4 text-gray-50"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4.5 12.75l6 6 9-13.5"
        />
      </svg>
      <span
        class="text-gray-50 font-semibold text-sm drop-shadow-xl shadow-black"
        >ON</span
      >
    </div>
  {:else}
    <div
      class="w-14 bg-gray-300 p-1 rounded-md flex justify-between items-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="3"
        stroke="currentColor"
        class="w-4 text-gray-400"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4.5 12.75l6 6 9-13.5"
        />
      </svg>
      <span
        class="text-gray-50 font-semibold text-sm drop-shadow-lg shadow-black"
        >OFF</span
      >
    </div>
  {/if}
</label>
