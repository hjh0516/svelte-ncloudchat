<script lang="ts">
  import type { Channel } from "$lib/types/type";

  import Spinner from "$components/Spinner.svelte";
  import { convertLastChat } from "$lib/Date";
  import { createEventDispatcher } from "svelte";

  export let item: Channel;

  let loading = false;

  const dispatch = createEventDispatcher();
  function open(item: Channel) {
    dispatch("open", {
      item: item,
    });
  }
</script>

<div
  class="w-full mb-5 flex items-center gap-4 pt-7 pb-7 pl-5 pr-5 border border-gray-100 rounded-lg shadow-lg hover:bg-gray-50"
  on:click={() => {
    open(item);
  }}
>
  {#if item.image_url}
    <img
      class="w-12 h-12 border border-gray-200 rounded-full"
      src={item.image_url}
      alt="channel_image"
    />
  {:else}
    <img
      class="w-12 h-12 border border-gray-200 rounded-full"
      src="/default.jpg"
      alt="channel_image"
    />
  {/if}
  <div class="w-full flex flex-col">
    <div class="flex justify-between items-center">
      <div class="h-4 flex justify-center items-center">
        <span class="font-sbaggrom text-base">{item.name}</span>
        <div
          class="h-4 bg-gray-500 text-gray-100 rounded-md flex items-center text-sm ml-1 p-1"
        >
          {item.subscriptions_count}명
        </div>
      </div>
    </div>
    {#if item.tags}
      <div class="text-gray-400 text-sm">
        {item.tags.map((t) => "#" + t.tag).join(" ")}
      </div>
    {/if}
    <div class="flex justify-start items-center mt-1">
      {#if item.profile}
        <img class="w-5 rounded-full" src={item.profile} alt="channel_image" />
      {/if}
      <span class="text-sm ml-1">{item.nickname}</span>
      <span class="text-gray-400 text-sm ml-1"
        >| {convertLastChat(item.last_chat_at)}</span
      >
    </div>
  </div>

  {#if loading}
    <div class="fixed top-[calc(50%-2.25rem)] left-[calc(50%-1rem)]">
      <Spinner />
    </div>
  {/if}
</div>
