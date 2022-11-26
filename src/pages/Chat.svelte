<script lang="ts">
  import type { Channel, Chat } from "$lib/types/type";
  import type { MessageType } from "$lib/types/MessageType";

  import ChatHeader from "$components/ChatHeader.svelte";
  import InfiniteScroll from "$components/InfiniteScroll.svelte";
  import ChatSendItem from "$components/ChatSendItem.svelte";
  import ChatReceiveItem from "$components/ChatReceiveItem.svelte";
  import ChatDateItem from "$components/ChatDateItem.svelte";
  import MessageInput from "$components/MessageInput.svelte";
  import ChatSettingModal from "$components/modals/ChatSettingModal.svelte";
  import ChatProfileModal from "$components/modals/ChatProfileModal.svelte";
  import ImageDownloadModal from "$components/modals/ImageDownloadModal.svelte";
  import ChatSystemItem from "$components/ChatSystemItem.svelte";
  import Spinner from "$components/Spinner.svelte";
  import { onMount, onDestroy } from "svelte";
  import { store } from "$store/store";
  import { sendMessage, bind, unbindall, sendImage } from "$lib/NcloudChat";
  import {
    apiGetMessages,
    apiCreateMessage,
    apiCreateChatRead,
    apiGetChatBans,
    apiSendPush,
    apiGetChannel,
  } from "$lib/api";
  import { updateChatItems } from "$lib/Chat";
  import { convertChatDate } from "$lib/Date";
  import { querystring } from "svelte-spa-router";
  import { apiGetUser } from "$lib/api";
  import { connect, initialize } from "$lib/NcloudChat";
  import { getNotificationsContext } from "svelte-notifications";

  export let params: any;

  const { addNotification, clearNotifications } = getNotificationsContext();

  let channel: Channel;
  let input: string;
  let emojiPath: string;
  let page = 1;
  let data: Chat[] = [];
  let newData: Chat[] = [];
  let element: HTMLElement;
  let showSettingModal = false;
  let showImageDownloadModal = false;
  let showChatProfileModal = false;
  let showEmojiArea = false;
  let chatItem = null;
  let bans = [];
  let refresh = false;
  let messageInput: HTMLElement;
  let user: any;
  let id: string;
  let activeInput = true;
  let loading = false;

  $: data = updateChatItems(data);

  function send() {
    let message = "";
    showEmojiArea = false;

    if (emojiPath) {
      message = "이미지";
      sendEmoji();
    } else if (input) {
      message = input;
      sendText();
    }

    try {
      if (message) {
        apiSendPush(params.id, message);
      }
    } catch (err) {
      console.error(err);
    }

    messageInput.focus();
  }

  async function sendEmoji() {
    const inputEmoji = emojiPath;
    input = "";
    emojiPath = "";

    const res = await fetch(inputEmoji);
    const blob = await res.blob();
    const file = new File([blob], "emoji", { type: "image/jpg" });

    try {
      sendImage(params.id, file);
      apiCreateMessage(params.id, "image", null, file);
    } catch (err) {
      console.error(err);
    }
  }

  function sendText() {
    const inputMessage = input;
    input = "";
    emojiPath = "";

    try {
      sendMessage(params.id, "text", inputMessage);
      apiCreateMessage(params.id, "text", inputMessage);
    } catch (err) {
      console.error(err);
    }
  }

  async function uploadImage(e) {
    const image = e.target.files[0];
    input = "";
    try {
      const file = new File([image], "image", { type: "image/jpg" });
      sendImage(params.id, file);
      apiCreateMessage(params.id, "image", null, file);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadMessages() {
    try {
      await login();

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

  async function login() {
    const params = new URLSearchParams($querystring);
    if (params.has("token")) {
      $store.token = params.get("token");

      try {
        user = await apiGetUser();
        id = "chat_" + user.idx;

        $store.user = {
          id: user.idx,
          name: user.nickname,
          profile: user.profile,
          level: user.level,
          use_chat: user.use_chat,
          chat_notification: user.chat_notification,
        };

        window.sessionStorage.setItem("store", JSON.stringify($store));
      } catch (err) {
        location.href = "/#/error";
        return;
      }

      try {
        initialize();
        connect(id, user.nickname, user.profile);
      } catch (err) {
        location.href = "/#/error";
        return;
      }

      // if (isMobile.Android()) {
      //   window.emoApp?.godetail();
      // } else if (isMobile.iOS()) {
        location.href = "godetail://";
      // }
    }
  }

  onMount(async () => {
    bind(
      "onMessageReceived",
      function (_channel: string, message: MessageType) {
        element.scrollTop = 0;

        if (channel.channel_id === _channel) {
          if (message.message_type.split("_")[0] === "system") {
            const target = message.message_type.split("_")[1];
            if (target === $store.user.id.toString()) {
              history.back();
            } else if (target === channel.user_idx.toString()) {
              activeInput = false;
            }
          }
        }

        let chat: Chat;
        const sender_user_idx = Number(message.sender.id.split("_")[1]);

        const banUsers = bans.map((x) => x.target);
        if (banUsers.includes(sender_user_idx)) {
          return;
        }

        if (message.message_type === "text") {
          chat = {
            user_idx: sender_user_idx,
            nickname: message.sender.name,
            profile: message.sender.profile,
            type: message.message_type,
            message: message.content,
            created_at: message.created_at,
          };
        } else if (message.message_type === "file") {
          chat = {
            user_idx: sender_user_idx,
            nickname: message.sender.name,
            profile: message.sender.profile,
            type: "file",
            image_url: message.content.replace("http:", ""),
            created_at: message.created_at,
          };
        } else if (message.message_type.split("_")[0] === "system") {
          chat = {
            type: "system",
            message: message.content,
            created_at: message.created_at,
          };
        }

        if (channel.channel_id === _channel) {
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

        try {
          apiCreateChatRead(params.id);
        } catch (err) {
          console.error(err);
        }
      }
    );

    bind("onConnected", function () {
      loading = false;
    });

    bind("onDisconnected", function (reason: string) {
      loading = true;
      console.error(reason);
    });

    loading = true;
    try {
      channel = await apiGetChannel(params.id);
      $store.channel = channel;
      window.sessionStorage.setItem("store", JSON.stringify($store));

      setTimeout(() => {
        const p = new URLSearchParams($querystring);
        if (p.has("subscribe") && p.get("subscribe") === "true") {
          const message = `${$store.user.name}님이 입장했어요.`;
          sendMessage(params.id, "system", message);
          apiCreateMessage(params.id, "system", message);
        }
      }, 500);

      if (
        channel.subscriptions.findIndex(
          (v) => v.user_idx === channel.user_idx
        ) === -1
      ) {
        clearNotifications();
        addNotification({
          text: "대화목록에는 존재하지만 참여자가 진입 시 참여할 수 없는 방이에요. ",
          position: "bottom-center",
          removeAfter: 1500,
        });
        activeInput = false;
      }

      apiCreateChatRead(params.id);
      bans = await apiGetChatBans(params.id);
    } catch (err) {
      console.error(err);
    }
    loading = false;
  });

  onDestroy(() => {
    unbindall("onConnected");
    unbindall("onDisconnected");
    unbindall("onMessageReceived");
  });
</script>

<ChatHeader {channel} bind:showSettingModal />
<div
  id="chatRoom"
  class="chatting chat_room"
  on:click={() => (showEmojiArea = false)}
>
  <div class="section">
    <div class="size">
      <div class="inner">
        <div
          class="chat_area w-full flex flex-col-reverse scrollbar-hide"
          bind:this={element}
        >
          <div class="chat_info flex flex-col-reverse">
            {#await loadMessages()}
              <div
                class="fixed top-0 left-0 w-full h-full bg-gray-400 bg-opacity-10"
                style="z-index: 200;"
              >
                <div
                  class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <Spinner />
                </div>
              </div>
            {:then}
              {#each data as item}
                {#if item.type === "date"}
                  <ChatDateItem message={item.message} />
                {:else if item.type === "system"}
                  <ChatSystemItem message={item.message} />
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
            {/await}
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
  {activeInput}
  bind:input
  bind:messageInput
  bind:showEmojiArea
  bind:emojiPath
/>

{#if showSettingModal}
  <ChatSettingModal
    channel_id={params.id}
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
    {channel}
    item={chatItem}
    bind:refresh
    on:close={closeChatProfileModal}
  />
{/if}

{#if loading}
  <div
    class="fixed top-0 left-0 w-full h-full bg-gray-400 bg-opacity-10"
    style="z-index: 200;"
  >
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Spinner />
    </div>
  </div>
{/if}
