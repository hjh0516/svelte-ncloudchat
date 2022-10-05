<script lang="ts">
  import { bind, unbindall } from "../lib/NcloudChat";
  import { onDestroy, onMount } from "svelte";
  import { convertDate } from "../lib/Date";
  import type { ChannelType } from "../lib/types/ChannelType";
  import type { MessageType } from "../lib/types/MessageType";

  export let item: ChannelType;

  async function clickItem(id: string) {
    location.href = `/#/chat/${id}`;
  }

  onMount(() => {
    bind(
      "onMessageReceived",
      function (_channel: string, message: MessageType) {
        item.last_message = message;
      }
    );
  });

  onDestroy(() => {
    unbindall("onMessageReceived");
  });
</script>

<div
  class="h-24 mb-5 flex items-center gap-4 p-4 border border-gray-100 rounded-lg shadow-lg hover:bg-gray-50"
  on:click={async () => await clickItem(item.id)}
>
  <div>
    {#if item.image_url}
      <img
        class="w-12 h-auto rounded-full"
        src={item.image_url}
        alt="channel_image"
      />
    {:else}
      <img
        class="w-12 h-12 rounded-full"
        src="/src/assets/default_channel.svg"
        alt="channel_image"
      />
    {/if}
  </div>
  <div class="w-full flex flex-col">
    <div class="flex justify-between items-center">
      <strong>{item.name}</strong>
      <span class="text-gray-300 text-xs"
        >{convertDate(Number(item.last_message.sort_id))}</span
      >
    </div>
    {#if item.last_message}
      <span class="text-gray-400 text-sm">{item.last_message.content}</span>
    {/if}
  </div>
</div>
