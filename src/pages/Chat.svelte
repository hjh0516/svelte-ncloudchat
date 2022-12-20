<script lang="ts">
  import type { Channel, Chat, Content, Message } from "$lib/types/type";

  import ChatHeader from "$components/ChatHeader.svelte";
  import InfiniteScroll from "$components/InfiniteScroll.svelte";
  import ChatSendItem from "$components/ChatSendItem.svelte";
  import ChatReceiveItem from "$components/ChatReceiveItem.svelte";
  import ChatDateItem from "$components/ChatDateItem.svelte";
  import ChatSystemItem from "$components/ChatSystemItem.svelte";
  import MessageInput from "$components/MessageInput.svelte";
  import ChatSettingModal from "$components/modals/ChatSettingModal.svelte";
  import ChatProfileModal from "$components/modals/ChatProfileModal.svelte";
  import ImageDownloadModal from "$components/modals/ImageDownloadModal.svelte";
  import SendImageModal from "$components/modals/SendImageModal.svelte";
  import Spinner from "$components/Spinner.svelte";
  import { onMount, onDestroy, tick } from "svelte";
  import { querystring } from "svelte-spa-router";
  import { getNotificationsContext } from "svelte-notifications";
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
    apiGetChannel,
    apiSendChatPush,
    apiGetProfileAll,
  } from "$lib/api";
  import { updateChatItems } from "$lib/Chat";
  import { convertChatDate } from "$lib/Date";
  import { apiGetUser } from "$lib/api";
  import { connect, initialize } from "$lib/NcloudChat";

  export let params: any;

  const { addNotification, clearNotifications } = getNotificationsContext();

  let channel: Channel;
  let input: string;
  let cursor: string;
  let data: Chat[] = [];
  let newData: Chat[] = [];
  let element: HTMLElement;
  let elementDiv: HTMLElement;
  let showSettingModal = false;
  let showImageDownloadModal = false;
  let showChatProfileModal = false;
  let showEmojiArea = false;
  let showSendImageModal = false;
  let showContentArea = false;
  let emojiPath: string;
  let contentPath: string;
  let contents: Content[];
  let chatItem = null;
  let bans = [];
  let refresh = false;
  let messageInput: HTMLElement;
  let messageDiv: HTMLElement;
  let hiddenInput: HTMLElement;
  let user: any;
  let id: string;
  let activeInput = true;
  let loading = false;

  $: data = updateChatItems(data);

  function send() {
    let message = "";
    showEmojiArea = false;
    showContentArea = false;

    if (emojiPath) {
      message = "사진을 보냈습니다.";
      sendEmoji();
    } else if (contentPath) {
      message = "사진을 보냈습니다.";
      sendContent();
    } else if (input) {
      message = input;
      sendText();
    }

    messageInput.focus();
  }

  function resizeContent(val) {
    if (isMobile.iOS()) {
      if (val == "on") {
        setTimeout(() => {
          elementDiv.style.height =
            messageDiv.getBoundingClientRect().y + 54 + "px";
        }, 200);
      } else if (val == "off") {
        elementDiv.style.height = "";
      }
    }
  }
  async function sendEmoji() {
    const inputEmoji = emojiPath;
    input = "";
    emojiPath = "";

    loading = true;
    try {
      const res = await fetch(inputEmoji);
      const blob = await res.blob();
      const file = new File([blob], "emoji", { type: blob.type });
      await sendImage(params.id, file);
    } catch (err) {
      console.error(err);
    }
    loading = false;
  }

  async function sendContent() {
    const inputContent = contentPath;
    input = "";
    contentPath = "";

    loading = true;
    try {
      const res = await fetch(inputContent);
      const blob = await res.blob();
      const file = new File([blob], "content", { type: blob.type });
      await sendImage(params.id, file);
    } catch (err) {
      console.error(err);
    }
    loading = false;
  }

  async function sendText() {
    const inputMessage = input;
    input = "";
    emojiPath = "";

    const message = JSON.stringify({
      user_idx: $store.user.id,
      type: "text",
      content: inputMessage,
    });

    try {
      await sendMessage(params.id, "text", message);
    } catch (err) {
      console.error(err);
    }
  }

  async function uploadImage(e) {
    const image = e.target.files[0] as File;
    input = "";

    loading = true;
    try {
      await sendImage(params.id, image);
    } catch (err) {
      console.error(err);
    }
    loading = false;
  }

  async function loadMessages() {
    try {
      await login();

      const res = await apiGetMessages(params.id, cursor);
      newData = res.data;
      cursor = res.next_cursor;

      if (newData.length > 0 && !cursor) {
        newData.push({
          idx: 0,
          user_idx: 0,
          channel_idx: newData[newData.length - 1].channel_idx,
          type: "date",
          message: convertChatDate(newData[newData.length - 1].created_at),
          created_at: "",
        });
      }
      data = [...newData.reverse(), ...data];
    } catch (err) {
      console.error(err);
    }
  }

  function closeChatSettingModal() {
    showSettingModal = false;
    if (refresh) {
      if (isMobile.Android() && window.emoApp) {
        window.emoApp?.goreload();
      }else{
        location.reload();
      }
    }
  }

  function closeChatProfileModal() {
    showChatProfileModal = false;
    if (refresh) {
      if (isMobile.Android() && window.emoApp) {
        window.emoApp?.goreload();
      }else{
        location.reload();
      }
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

      if (isMobile.Android() && window.emoApp) {
        window.emoApp?.godetail();
      } else if (isMobile.iOS()) {
        location.href = "godetail://";
      }
    }
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

      if (channel.type === "PRIVATE") {
        if (channel.subscriptions_count === 1) {
          showToast("대화 상대가 없어요.");
          activeInput = false;
        }
      } else {
        if (
          channel.subscriptions.findIndex(
            (v) => v.user_idx === channel.user_idx
          ) === -1
        ) {
          showToast(
            "대화목록에는 존재하지만 참여자가 진입 시 참여할 수 없는 방이에요."
          );
          activeInput = false;
        }
      }

      var unread = await apiCreateChatRead(params.id);
      if (unread.unread_count > 0) {
        if (isMobile.Android() && window.emoApp) {
          window.emoApp?.gohidenew();
        } else if (isMobile.iOS()) {
          location.href = "gohidenew://";
        }
      }
      bans = await apiGetChatBans(params.id);
    } catch (err) {
      console.error(err);
    }

    element.scrollTop = element.scrollHeight;
    loading = false;

    bind(
      "onMessageReceived",
      async function (channel_id: string, message: Message) {
        const sender_user_idx = Number(message.sender.id.split("_")[1]);
        const content =
          message.message_type === "text"
            ? JSON.parse(message.content)
            : {
                user_idx: sender_user_idx,
                type: "file",
                content: message.attachment_filenames.url,
              };

        if (params.id === channel_id) {
          if (content.type === "system") {
            if (content.target === $store.user.id) {
              history.back();
            } else if (channel && channel.type === "PRIVATE") {
              showToast("대화상대가 없어요.");
              activeInput = false;
            } else if (channel && channel.user_idx === content.user_idx) {
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

        if (params.id === channel_id) {
          if (data.length === 0) {
            data = [
              ...data,
              {
                idx: 0,
                user_idx: 0,
                channel_idx: 0,
                type: "date",
                message: convertChatDate(chat.created_at),
                created_at: "",
              },
            ];
          }
          data = [...data, chat];
        }

        try {
          if (params.id === channel_id && $store.user.id === content.user_idx) {
            let response = await apiCreateMessage(
              params.id,
              content.type,
              content.content, 
              message.message_id
            );

            try {
              if (response) {
                setTimeout(function () {
                  apiSendChatPush(response.idx);
                }, 1000);
              }
            } catch (err) {
              console.error(err);
            }
          }
          var unread = await apiCreateChatRead(params.id);
          if (unread.unread_count > 0) {
            if (isMobile.Android() && window.emoApp) {
              window.emoApp?.gohidenew();
            } else if (isMobile.iOS()) {
              location.href = "gohidenew://";
            }
          }
        } catch (err) {
          console.error(err);
        }

        await tick();
        element.scrollTop = element.scrollHeight;
      }
    );

    bind("onConnected", function () {
      loading = false;
    });

    bind("onDisconnected", function (reason: string) {
      loading = true;
      console.error(reason);
    });

    bind("onMemberJoined", async function (data: any) {
      const user_idx = Number(data.user_id.split("_")[1]);
      if (
        channel &&
        channel.type !== "PRIVATE" &&
        user_idx === Number($store.user.id)
      ) {
        const user = await apiGetUser(user_idx);
        const message = JSON.stringify({
          user_idx: user_idx,
          type: "system",
          content: `${user.nickname}님이 입장했어요.`,
        });
        await sendMessage(data.channel_id, "text", message);
      }
    });

    bind("onMemberLeaved", async function (data: any) {
      const user_idx = Number(data.user_id.split("_")[1]);
      const user = await apiGetUser(user_idx);
      const content = `${user.nickname}님이 퇴장했어요.`;
      const message = JSON.stringify({
        user_idx: user_idx,
        type: "system",
        content: content,
      });
      await sendMessage(data.channel_id, "text", message);
      await apiCreateMessage(data.channel_id, "system", content, null);
    });
  });

  onDestroy(() => {
    unbindall("onConnected");
    unbindall("onDisconnected");
    unbindall("onMessageReceived");
    unbindall("onMemberJoined");
    unbindall("onMemberLeaved");
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
      <div
        bind:this={elementDiv}
        class="inner"
        style={showEmojiArea || showContentArea ? "padding-bottom: 290px;" : ""}
        on:click={() => {
          emojiPath = "";
          contentPath = "";
          showEmojiArea = false;
          showContentArea = false;
        }}
      >
        <div class="scroll chat_area w-full" bind:this={element}>
          <div class="chat_info">
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
                      apiGetProfileAll(e.detail.item.user_idx)
                        .then((result) => {
                          if (result.withdraw == 1) {
                            alert("탈퇴한 사용자에요.");
                          } else {
                            showChatProfileModal = true;
                            chatItem = e.detail.item;
                          }
                        })
                        .catch((result) => {
                          console.error(result);
                        });
                    }}
                  />
                {/if}
              {/each}
            {/await}
          </div>
          <InfiniteScroll
            reverse
            hasMore={cursor !== null}
            threshold={100}
            on:loadMore={async () => {
              const beforeScrollHeight = element.scrollHeight;
              const beforeScrollTop = element.scrollTop;
              await loadMessages();
              await tick();
              element.scrollTop =
                element.scrollHeight - beforeScrollHeight + beforeScrollTop;
            }}
          />
        </div>
      </div>
    </div>
  </div>
</div>
<MessageInput
  {send}
  {resizeContent}
  {activeInput}
  {contents}
  bind:input
  bind:messageInput
  bind:messageDiv
  bind:hiddenInput
  bind:showEmojiArea
  bind:showSendImageModal
  bind:showContentArea
  bind:emojiPath
  bind:contentPath
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

{#if showSendImageModal}
  <SendImageModal
    {uploadImage}
    bind:contents
    bind:showContentArea
    bind:showEmojiArea
    bind:emojiPath
    on:close={() => (showSendImageModal = false)}
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
