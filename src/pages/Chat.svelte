<script lang="ts">
  import type { Channel, Chat, Message } from "$lib/types/type";

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
  import {
    sendMessage,
    bind,
    unbindall,
    sendImage,
    subscribe,
    getSubscriptions,
  } from "$lib/NcloudChat";
  import {
    apiGetMessages,
    apiCreateMessage,
    apiCreateChatRead,
    apiGetChatBans,
    apiSendPush,
    apiGetChannel,
    apiSendChatPush,
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
      message = "사진을 보냈습니다.";
      sendEmoji();
    } else if (input) {
      message = input;
      sendText();
    }

    messageInput.focus();
  }

  async function sendEmoji() {
    const inputEmoji = emojiPath;
    input = "";
    emojiPath = "";

    const res = await fetch(inputEmoji);
    const blob = await res.blob();
    const file = new File([blob], "emoji", { type: blob.type });

    try {
      sendImage(params.id, file);
    } catch (err) {
      console.error(err);
    }
  }

  function sendText() {
    const inputMessage = input;
    input = "";
    emojiPath = "";

    const message = JSON.stringify({
      user_idx: $store.user.id,
      type: "text",
      content: inputMessage,
    });

    try {
      sendMessage(params.id, "text", message);
    } catch (err) {
      console.error(err);
    }
  }

  async function uploadImage(e) {
    const image = e.target.files[0] as File;
    input = "";
    try {
      sendImage(params.id, image);
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

      location.href = "godetail://";
    }
  }

  function sendEnterMessage() {
    setTimeout(() => {
      const message = JSON.stringify({
        user_idx: $store.user.id,
        type: "system",
        content: `${$store.user.name}님이 입장했어요.`,
      });
      sendMessage(params.id, "text", message);
    }, 500);
  }

  function showToast(message: string) {
    clearNotifications();
    addNotification({
      text: message,
      position: "bottom-center",
      removeAfter: 1500,
    });
  }

  onMount(async () => {
    bind(
      "onMessageReceived",
      async function (_channel: string, message: Message) {
        element.scrollTop = 0;

        const sender_user_idx = Number(message.sender.id.split("_")[1]);

        const content =
          message.message_type === "text"
            ? JSON.parse(message.content)
            : {
                user_idx: sender_user_idx,
                type: "file",
                content: message.attachment_filenames.url,
              };

        if (channel.channel_id === _channel) {
          if (content.type === "system") {
            if (content.target === $store.user.id) {
              history.back();
            } else if (channel.type === "PRIVATE") {
              showToast("대화상대가 없어요.");
              activeInput = false;
            } else if (content.user_idx === channel.user_idx) {
              showToast(
                "대화목록에는 존재하지만 참여자가 진입 시 참여할 수 없는 방이에요."
              );
              activeInput = false;
            }
          }
        }

        const banUsers = bans.map((x) => x.target);
        if (banUsers.includes(sender_user_idx)) {
          return;
        }

        const chat = {
          user_idx: content.user_idx,
          nickname: message.sender.name,
          profile: message.sender.profile,
          type: content.type,
          message: message.message_type === "text" ? content.content : null,
          image_url: message.message_type === "file" ? content.content : null,
          created_at: message.created_at,
        };

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
          if (
            channel.channel_id === _channel &&
            content.user_idx === $store.user.id
          ) {
            var response = await apiCreateMessage(
              channel.channel_id,
              content.type,
              content.content
            );
            console.info(response);

            try {
              if (response) {
                apiSendChatPush(response.idx);
              }
            } catch (err) {
              console.error(err);
            }
          }
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

      if (channel.type === "PRIVATE") {
        const subscriptions = await getSubscriptions({
          channel_id: channel.channel_id,
        });

        if (
          subscriptions.findIndex(
            (v) => v.user_id === `chat_${$store.user.id}`
          ) === -1
        ) {
          await subscribe(channel.channel_id);
        }
      }

      const p = new URLSearchParams($querystring);
      if (p.has("subscribe") && p.get("subscribe") === "true") {
        sendEnterMessage();
      }

      if (channel.type === "PRIVATE" && channel.subscriptions_count === 1) {
        showToast("대화 상대가 없어요.");
        activeInput = false;
      }

      if (
        channel.type !== "PRIVATE" &&
        channel.subscriptions.findIndex(
          (v) => v.user_idx === channel.user_idx
        ) === -1
      ) {
        showToast(
          "대화목록에는 존재하지만 참여자가 진입 시 참여할 수 없는 방이에요."
        );
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
