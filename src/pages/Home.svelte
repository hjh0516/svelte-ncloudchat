<script lang="ts">
  import type { Channel, Chat, Message } from "$lib/types/type";

  import Navigation from "$components/Navigation.svelte";
  import MyChat from "$pages/MyChat.svelte";
  import OpenChat from "$pages/OpenChat.svelte";
  import ChannelSettingModal from "$components/modals/ChannelSettingModal.svelte";
  import FloatingActionButton from "$components/FloatingActionButton.svelte";
  import CreateChannelModal from "$components/modals/CreateChannelModal.svelte";
  import Spinner from "$components/Spinner.svelte";
  import { onDestroy, onMount } from "svelte";
  import { getNotificationsContext } from "svelte-notifications";
  import { querystring } from "svelte-spa-router";
  import { store } from "$store/store";
  import { bind, unbindall } from "$lib/NcloudChat";
  import { apiGetUser } from "$lib/api";

  let chat: Chat;
  let newChannel: Channel = null;
  let showSettingModal = false;
  let showCreateChannelModal = false;
  let loading = false;
  let user: any;

  window.setShowSettingModal = (value: boolean) => {
    showCreateChannelModal = false;
    showSettingModal = value;
  };

  const { addNotification, clearNotifications } = getNotificationsContext();

  async function openCreateChannelModal() {
    user = await apiGetUser();
    $store.user = {
      id: user.idx,
      name: user.nickname,
      profile: user.profile,
      level: user.level,
      use_chat: user.use_chat,
      chat_notification: user.chat_notification,
    };

    if ($store.user.level < 2) {
      clearNotifications();
      addNotification({
        text: "레벨 상승 후 채팅방을 개설할 수 있어요.",
        position: "bottom-center",
        removeAfter: 1500,
      });
      return;
    }
    showCreateChannelModal = true;
  }

  function closeCreateChannelModal() {
    showCreateChannelModal = false;
    if (newChannel) {
      setTimeout(() => {
        location.href = `/#/chat/${newChannel.channel_id}`;
        godetail();
      }, 500);
    }
  }

  onMount(() => {
    if (!$store.token) {
      location.href = "/#/error";
    }

    const params = new URLSearchParams($querystring);
    if (params.has("channel_id")) {
      $store.activeItem = "오픈 채팅";
    } else if (params.has("openchat")) {
      showCreateChannelModal = true;
      location.replace("/#/home");
    }

    $store.channel = null;
    window.sessionStorage.setItem("store", JSON.stringify($store));

    bind("onMessageReceived", function (channel: string, message: Message) {
      chat = {
        channel_id: channel,
        nickname: message.sender.name,
        profile: message.sender.profile,
        type: message.message_type,
        message: message.content,
        created_at: message.created_at,
      };
    });

    bind("onConnected", function () {
      loading = false;
    });

    bind("onDisconnected", function (reason: string) {
      console.error(reason);
      loading = true;
    });
  });

  onDestroy(() => {
    unbindall("onConnected");
    unbindall("onDisconnected");
    unbindall("onMessageReceived");
  });
</script>

<div id="sub" class="chatting chat_idx">
  <div class="section">
    <div class="size">
      <div class="inner overflow-hidden">
        <Navigation />
        <div class="chat_area scrollbar-hide">
          {#if $store.activeItem === "My 채팅"}
            <MyChat {chat} />
          {:else if $store.activeItem === "오픈 채팅"}
            <OpenChat {chat} bind:showSettingModal />
          {/if}
        </div>
        <FloatingActionButton on:click={openCreateChannelModal} />
      </div>
    </div>
  </div>
</div>

{#if showSettingModal}
  <ChannelSettingModal on:close={() => (showSettingModal = false)} />
{/if}

{#if showCreateChannelModal}
  <CreateChannelModal on:close={closeCreateChannelModal} bind:newChannel />
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
