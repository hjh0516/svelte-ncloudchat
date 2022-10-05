<script lang="ts">
  import { bind, unbindall } from "../lib/NcloudChat";
  import { onDestroy, onMount } from "svelte";
  import { convertDate } from "../lib/Date";
  import type { ChannelType } from "../lib/types/ChannelType";
  import type { MessageType } from "../lib/types/MessageType";

  export let channel: ChannelType;

  async function clickItem(id: string) {
    location.href = `/#/chat/${id}`;
  }

  onMount(() => {
    bind(
      "onMessageReceived",
      function (_channel: string, message: MessageType) {
        channel.last_message = message;
      }
    );
  });

  onDestroy(() => {
    unbindall("onMessageReceived");
  });
</script>

<div
  class="h-24 mt-5 ml-5 mr-5 flex items-center gap-4 p-4 border border-gray-100 rounded-lg shadow-lg hover:bg-gray-50"
  on:click={async () => await clickItem(channel.id)}
>
  {#if channel.image_url}
    <img
      class="w-12 h-12 rounded-full"
      src={channel.image_url}
      alt="channel_image"
    />
  {:else}
    <img
      class="w-12 h-12 rounded-full"
      src="/src/assets/default_channel.svg"
      alt="channel_image"
    />
  {/if}
  <div class="w-full flex flex-col">
    <div class="flex justify-between items-center">
      <strong>{channel.name}</strong>
      <span class="text-gray-300 text-xs"
        >{convertDate(Number(channel.last_message.sort_id))}</span
      >
    </div>
    {#if channel.last_message}
      <span class="text-gray-400 text-sm">{channel.last_message.content}</span>
    {/if}
  </div>
</div>
