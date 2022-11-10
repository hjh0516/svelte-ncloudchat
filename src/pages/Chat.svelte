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
  import ImageDownloadModal from "$components/modals/ImageDownloadModal.svelte";
  import Spinner from "$components/Spinner.svelte";
  import { onMount, onDestroy } from "svelte";
  import { store } from "$store/store";
  import { sendMessage, bind, unbindall, sendImage } from "$lib/NcloudChat";
  import {
    apiGetMessages,
    apiCreateMessage,
    apiCreateChatRead,
    apiGetChatBans,
  } from "$lib/api";
  import { updateChatItems } from "$lib/Chat";
  import { convertChatDate } from "$lib/Date";
  import ChatProfileModal from "$components/modals/ChatProfileModal.svelte";

  export let params: any;

  let input: string;
  let emoticonPath: string;
  let page = 1;
  let data: Chat[] = [];
  let newData: Chat[] = [];
  let element: HTMLElement;
  let showSettingModal = false;
  let showImageDownloadModal = false;
  let showChatProfileModal = false;
  let showEmojiArea = false;
  let chatItem = null;
  let loading = false;
  let bans = [];
  let refresh = false;

  $: data = updateChatItems(data);

  function send() {
    if (emoticonPath) {
      sendEmoji();
      return;
    }

    if (input) {
      sendText();
      return;
    }
  }

  async function sendEmoji() {
    if (!emoticonPath) {
      return;
    }
    input = "";

    const res = await fetch(emoticonPath);
    const blob = await res.blob();
    const file = new File([blob], "emoji", { type: "image/jpg" });

    try {
      sendImage(params.id, file);
      apiCreateMessage(params.id, "image", null, file);
    } catch (err) {
      console.error(err);
    }

    showEmojiArea = false;
  }

  function sendText() {
    if (!input) {
      return;
    }
    showEmojiArea = false;

    const inputMessage = input;
    input = "";
    try {
      sendMessage(params.id, "text", inputMessage);
      apiCreateMessage(params.id, "text", inputMessage);
    } catch (err) {
      console.error(err);
    }
  }

  function uploadImage(e) {
    const image = e.target.files[0];
    input = "";
    try {
      sendImage(params.id, image);
      apiCreateMessage(params.id, "image", null, image);
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

  function handleFocus() {
    try {
      apiCreateChatRead(params.id);
    } catch (err) {
      console.error(err);
    }
  }

  function closeChatSettingModal() {
    showSettingModal = false;
    if (refresh) {
      location.reload();
    }
  }

  function closeChatProfileModal() {
    showChatProfileModal = false;
    if (refresh) {
      location.reload();
    }
  }

  onMount(async () => {
    bind(
      "onMessageReceived",
      function (_channel: string, message: MessageType) {
        let chat: Chat;
        element.scrollTop = element.scrollHeight;

        const banUsers = bans.map((x) => x.target);
        if (banUsers.includes(Number(message.sender.id.split("_")[1]))) {
          return;
        }

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

    loading = true;
    try {
      await loadMessages();
      apiCreateChatRead(params.id);
      bans = await apiGetChatBans(params.id);
    } catch (err) {
      console.error(err);
    }
    loading = false;
  });

  onDestroy(() => {
    unbindall("onMessageReceived");
  });
</script>

<svelte:window on:focus={handleFocus} />

<ChatHeader bind:showSettingModal />
<div
  id="sub"
  class="chatting chat_room"
  on:click={() => (showEmojiArea = false)}
>
  <div class="section">
    <div class="size">
      <div class="inner">
        <div
          class="chat_area absolute top-0 w-full h-full flex flex-col-reverse scrollbar-hide"
          bind:this={element}
        >
          <div class="chat_info flex flex-col-reverse">
            {#each data as item}
              {#if item.type === "date"}
                <ChatDateItem message={item.message} />
              {:else if item.user_idx === Number($store.user.id)}
                <ChatSendItem
                  {item}
                  on:open={(e) => {
                    showImageDownloadModal = true;
                    chatItem = e.detail.item;
                  }}
                />
              {:else}
                <ChatReceiveItem
                  {item}
                  on:open={(e) => {
                    showImageDownloadModal = true;
                    chatItem = e.detail.item;
                  }}
                  on:profile={(e) => {
                    showChatProfileModal = true;
                    chatItem = e.detail.item;
                  }}
                />
              {/if}
            {/each}
          </div>
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
      </div>
    </div>
  </div>
</div>
<MessageInput
  {send}
  {uploadImage}
  bind:input
  bind:showEmojiArea
  bind:emoticonPath
/>

{#if showSettingModal}
  <ChatSettingModal
    channelId={params.id}
    bind:refresh
    on:close={closeChatSettingModal}
  />
{/if}

{#if showImageDownloadModal}
  <ImageDownloadModal
    item={chatItem}
    on:close={() => (showImageDownloadModal = false)}
  />
{/if}

{#if showChatProfileModal}
  <ChatProfileModal
    channelId={params.id}
    item={chatItem}
    bind:refresh
    on:close={closeChatProfileModal}
  />
{/if}

{#if loading}
  <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <Spinner />
  </div>
{/if}
