<script lang="ts">
  import type { Channel } from "$lib/types/type";

  import { convertLastChat } from "$lib/Date";
  import { subscribe } from "$lib/NcloudChat";
  import { apiSubscribe } from "$lib/api";
  import Spinner from "$components/Spinner.svelte";

  export let item: Channel;

  let loading = false;

  async function clickItem(channel_id: string) {
    loading = true;
    try {
      await subscribe(channel_id);
      await apiSubscribe(channel_id);
    } catch (err) {
      console.error(err);
    }
    loading = false;
    location.href = `/#/chat/${channel_id}`;
  }
</script>

<div
  class="w-full mb-5 flex items-center gap-4 pt-7 pb-7 pl-5 pr-5 border border-gray-100 rounded-lg shadow-lg hover:bg-gray-50"
  on:click={async () => await clickItem(item.channel_id)}
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
      src="src/assets/default_channel_image.svg"
      alt="channel_image"
    />
  {/if}
  <div class="w-full flex flex-col">
    <div class="flex justify-between items-center">
      <div class="flex justify-center items-center">
        <strong>{item.name}</strong>
        <div
          class="h-5 bg-gray-500 text-gray-100 rounded-md flex items-center text-sm pl-1 pr-1 ml-2"
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
