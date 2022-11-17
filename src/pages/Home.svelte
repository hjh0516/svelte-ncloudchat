<script lang="ts">
  import type { Channel, Chat } from "$lib/types/type";
  import type { MessageType } from "$lib/types/MessageType";

  // import HomeHeader from "$components/HomeHeader.svelte";
  import Navigation from "$components/Navigation.svelte";
  import MyChat from "$pages/MyChat.svelte";
  import OpenChat from "$pages/OpenChat.svelte";
  import ChannelSettingModal from "$components/modals/ChannelSettingModal.svelte";
  import FloatingActionButton from "$components/FloatingActionButton.svelte";
  import CreateChannelModal from "$components/modals/CreateChannelModal.svelte";
  import { getNotificationsContext } from "svelte-notifications";
  import { onDestroy, onMount } from "svelte";
  import { store } from "$store/store";
  import { bind, unbindall } from "$lib/NcloudChat";

  let chat: Chat;
  let newChannel: Channel = null;
  let showSettingModal = false;
  let showCreateChannelModal = false;

  window.setShowSettingModal = (value: boolean) => {
    showCreateChannelModal = false;
    showSettingModal = value;
  };

  const { addNotification, clearNotifications } = getNotificationsContext();

  function openCreateChannelModal() {
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
      location.href = `/#/chat/${newChannel.channel_id}`;
      location.reload();
      godetail();
    }
  }

  onMount(() => {
    if (!$store.token) {
      location.href = "/#/error";
    }

    $store.channel = null;
    window.sessionStorage.setItem("store", JSON.stringify($store));

    bind("onMessageReceived", function (channel: string, message: MessageType) {
      chat = {
        channel_id: channel,
        nickname: message.sender.name,
        profile: message.sender.profile,
        type: message.message_type,
        message: message.content,
        created_at: message.created_at,
      };
    });
  });

  onDestroy(() => {
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
            <OpenChat bind:showSettingModal />
          {/if}
        </div>
        <FloatingActionButton on:click={openCreateChannelModal} />
      </div>
    </div>
  </div>
</div>

{#if showSettingModal}
  <ChannelSettingModal
    on:close={() => {
      showSettingModal = false;
    }}
  />
{/if}

{#if showCreateChannelModal}
  <CreateChannelModal on:close={closeCreateChannelModal} bind:newChannel />
{/if}
