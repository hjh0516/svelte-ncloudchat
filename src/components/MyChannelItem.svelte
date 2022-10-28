<script lang="ts">
  import type { Channel } from "$lib/types/type";

  import { store } from "$store/store";
  import { convertDate } from "$lib/Date";

  export let item: Channel;

  async function clickItem(channel_id: string) {
    $store.channel = item;
    window.sessionStorage.setItem("store", JSON.stringify($store));
    location.href = `/#/chat/${channel_id}`;
  }
</script>

<div
  class="w-full mb-5 flex items-center pt-7 pb-7 pl-5 pr-5 border border-gray-100 rounded-lg shadow-lg hover:bg-gray-50"
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
      src="/default_channel_image.svg"
      alt="channel_image"
    />
  {/if}
  <div class="w-full flex flex-col ml-4">
    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <span class="font-recipekorea text-base">{item.name}</span>
        {#if item.type === "PUBLIC"}
          <span class="font-recipekorea text-base text-gray-500 ml-1"
            >({item.subscriptions_count}명)</span
          >
        {/if}
      </div>
      <span class="text-gray-400 text-xs"
        >{item.last_chat_at
          ? convertDate(item.last_chat_at)
          : convertDate(item.created_at)}</span
      >
    </div>
    <div class="flex justify-between items-center">
      <span
        class="max-w-[calc(100vw-12rem)] break-words h-auto text-gray-400 text-sm"
      >
        {#if item.message}
          {item.message.length >= 50
            ? item.message.substring(0, 50) + "..."
            : item.message}
        {/if}
      </span>
      <span
        class="w-auto h-4 pr-1 pl-1 bg-gray-600 rounded-full text-center text-gray-50 text-xs font-semibold"
        >{item.unread_count ? item.unread_count : 0}</span
      >
    </div>
  </div>
</div>
