<script lang="ts">
  import type { Chat } from "$lib/types/type";
  import type { MessageType } from "$types/MessageType";

  import { onMount, onDestroy } from "svelte";
  import InfiniteScroll from "$components/InfiniteScroll.svelte";
  import ChatSendItem from "$components/ChatSendItem.svelte";
  import ChatReceiveItem from "$components/ChatReceiveItem.svelte";
  import MessageInput from "$components/MessageInput.svelte";
  import { sendMessage, bind, unbindall } from "$lib/NcloudChat";
  import { store } from "$store/store";
  import { apiGetMessages, apiCreateMessage } from "$lib/api";

  export let params: any;

  let input: string;
  let element: HTMLElement;

  let page = 1;
  let data: Chat[] = [];
  let newData: Chat[] = [];

  async function send() {
    const inputMessage = input;
    input = "";
    try {
      const message = await sendMessage(params.id, "text", inputMessage);
      await apiCreateMessage(message.channelId, message.type, message.message);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadMessages() {
    try {
      const res = await apiGetMessages(params.id, page);
      newData = res.data;
      data = [...data, ...newData];
    } catch (err) {
      console.error(err);
    }
  }

  onMount(async () => {
    bind(
      "onMessageReceived",
      async function (_channel: string, message: MessageType) {
        const chat: Chat = {
          user_idx: Number(message.sender.id.split("_")[1]),
          nickname: message.sender.name,
          profile: message.sender.profile,
          type: message.message_type,
          message: message.content,
          created_at: message.created_at,
        };

        data = [chat, ...data];
      }
    );

    await loadMessages();
  });

  onDestroy(() => {
    unbindall("onMessageReceived");
  });
</script>

<div
  class="fixed w-full h-full bg-gray-100 pl-5 pr-5 pb-20 flex flex-col-reverse overflow-scroll scrollbar-hide"
  bind:this={element}
>
  {#each data as item}
    {#if item.user_idx !== Number($store.user.id)}
      <ChatReceiveItem {item} />
    {:else}
      <ChatSendItem {item} />
    {/if}
  {/each}

  <InfiniteScroll
    hasMore={newData.length > 0}
    threshold={200}
    on:loadMore={async () => {
      page++;
      await loadMessages();
    }}
  />
</div>
<MessageInput {send} bind:input />
