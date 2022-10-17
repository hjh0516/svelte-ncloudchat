<script lang="ts">
  import type { Chat } from "$lib/types/type";
  import type { MessageType } from "$lib/types/MessageType";

  import InfiniteScroll from "$components/InfiniteScroll.svelte";
  import ChatSendItem from "$components/ChatSendItem.svelte";
  import ChatReceiveItem from "$components/ChatReceiveItem.svelte";
  import MessageInput from "$components/MessageInput.svelte";
  import ChatHeader from "$components/ChatHeader.svelte";
  import ChatSettingModal from "$components/modals/ChatSettingModal.svelte";
  import ChatDateItem from "$components/ChatDateItem.svelte";
  import { onMount, onDestroy } from "svelte";
  import { store } from "$store/store";
  import { sendMessage, bind, unbindall } from "$lib/NcloudChat";
  import { apiGetMessages, apiCreateMessage } from "$lib/api";
  import { updateChatItems } from "$lib/Chat";

  export let params: any;

  let input: string;

  let page = 1;
  let data: Chat[] = [];
  let newData: Chat[] = [];

  let showSettingModal = false;

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
      newData = updateChatItems(res.data);
      data = [...data, ...newData];
    } catch (err) {
      console.error(err);
    }
  }

  function closeSettingModal() {
    showSettingModal = false;
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

        data = updateChatItems([chat, ...data]);
      }
    );

    await loadMessages();
  });

  onDestroy(() => {
    unbindall("onMessageReceived");
  });
</script>

<ChatHeader bind:showSettingModal />
<div
  class="fixed w-full h-full bg-gray-100 pt-5 pl-5 pr-5 mt-16 pb-32 flex flex-col-reverse overflow-scroll scrollbar-hide"
>
  {#each data as item}
    {#if item.type === "date"}
      <ChatDateItem message={item.message} />
    {:else if item.user_idx === Number($store.user.id)}
      <ChatSendItem {item} />
    {:else}
      <ChatReceiveItem {item} />
    {/if}
  {/each}

  <InfiniteScroll
    reverse
    hasMore={newData.length > 0}
    threshold={200}
    on:loadMore={async () => {
      page++;
      await loadMessages();
    }}
  />
</div>
<MessageInput {send} bind:input />

{#if showSettingModal}
  <ChatSettingModal channel_id={params.id} on:close={closeSettingModal} />
{/if}
