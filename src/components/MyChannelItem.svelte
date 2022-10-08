<script lang="ts">
  import type { Channel } from "$lib/types/type";

  import { convertDate } from "$lib/Date";
  import { activeItem } from "$store/store";

  export let item: Channel;

  let activeItemValue: string;
  activeItem.subscribe((value) => {
    activeItemValue = value;
  });

  async function clickItem(channel_id: string) {
    location.href = `/#/chat/${channel_id}`;
  }
</script>

<div
  class="mb-5 flex items-center gap-4 pt-7 pb-7 pl-5 pr-5 border border-gray-100 rounded-lg shadow-lg hover:bg-gray-50"
  on:click={async () => await clickItem(item.channel_id)}
>
  <div class="w-12 h-auto">
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
      <strong>{item.name}</strong>
      <span class="text-gray-300 text-xs"
        >{item.last_chat_at
          ? convertDate(item.last_chat_at)
          : convertDate(item.created_at)}</span
      >
    </div>
    {#if item.message}
      <span class="text-gray-400 text-sm">{item.message}</span>
    {/if}
  </div>
</div>
