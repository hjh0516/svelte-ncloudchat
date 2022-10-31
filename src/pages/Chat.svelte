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
  import { sendMessage, bind, unbindall, sendImage } from "$lib/NcloudChat";
  import {
    apiGetMessages,
    apiCreateMessage,
    apiCreateChatRead,
  } from "$lib/api";
  import { updateChatItems } from "$lib/Chat";
  import { convertChatDate } from "$lib/Date";

  export let params: any;

  let input: string;
  let page = 1;
  let data: Chat[] = [];
  let newData: Chat[] = [];
  let element: HTMLElement;
  let showSettingModal = false;

  $: data = updateChatItems(data);

  async function send() {
    if (!input) {
      return;
    }

    const inputMessage = input;
    input = "";
    try {
      await sendMessage(params.id, "text", inputMessage);
      await apiCreateMessage(params.id, "text", inputMessage);
    } catch (err) {
      console.error(err);
    }
  }

  async function uploadImage(e) {
    const image = e.target.files[0];
    input = "";
    try {
      await sendImage(params.id, image);
      await apiCreateMessage(params.id, "image", null, image);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadMessages() {
    try {
      const res = await apiGetMessages(params.id, page);
      newData = res.data;

      if (newData.length > 0 && !res.next_page_url) {
        newData.push({
          idx: 0,
          user_idx: 0,
          channel_idx: newData[newData.length - 1].channel_idx,
          type: "date",
          message: convertChatDate(newData[newData.length - 1].created_at),
          created_at: "",
        });
      }

      data = [...data, ...newData];
    } catch (err) {
      console.error(err);
    }
  }

  function closeSettingModal() {
    showSettingModal = false;
  }

  async function handleFocus() {
    await apiCreateChatRead(params.id);
  }

  onMount(async () => {
    bind(
      "onMessageReceived",
      async function (_channel: string, message: MessageType) {
        let chat: Chat;
        element.scrollTop = element.scrollHeight;

        if (message.message_type === "text") {
          chat = {
            user_idx: Number(message.sender.id.split("_")[1]),
            nickname: message.sender.name,
            profile: message.sender.profile,
            type: message.message_type,
            message: message.content,
            created_at: message.created_at,
          };
        } else if (message.message_type === "file") {
          chat = {
            user_idx: Number(message.sender.id.split("_")[1]),
            nickname: message.sender.name,
            profile: message.sender.profile,
            type: "file",
            image_url: message.content,
            created_at: message.created_at,
          };
        }

        if (data.length === 0) {
          data.push({
            idx: 0,
            user_idx: 0,
            channel_idx: 0,
            type: "date",
            message: convertChatDate(chat.created_at),
            created_at: "",
          });
        }

        data = [chat, ...data];
      }
    );

    await loadMessages();
    await apiCreateChatRead(params.id);
  });

  onDestroy(() => {
    unbindall("onMessageReceived");
  });
</script>

<svelte:window
  on:focus={async () => {
    await handleFocus();
  }}
/>

<ChatHeader bind:showSettingModal />
<div
  class="fixed w-full h-full bg-gray-100 pt-5 pl-5 pr-5 mt-16 pb-32 flex flex-col-reverse overflow-scroll scrollbar-hide"
  bind:this={element}
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
<MessageInput {send} {uploadImage} bind:input />

{#if showSettingModal}
  <ChatSettingModal channelId={params.id} on:close={closeSettingModal} />
{/if}
