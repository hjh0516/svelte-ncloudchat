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
  class="mb-5 flex items-center gap-4 pt-7 pb-7 pl-5 pr-5 border border-gray-100 rounded-lg shadow-lg hover:bg-gray-50"
  on:click={async () => await clickItem(item.channel_id)}
>
  <div class="w-20 rounded-full border border-gray-200">
    {#if item.image_url}
      <img class="rounded-full" src={item.image_url} alt="channel_image" />
    {:else}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.25"
        stroke="currentColor"
        class="rounded-full"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
    {/if}
  </div>
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
    <div class="flex justify-start items-center mt-2">
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
