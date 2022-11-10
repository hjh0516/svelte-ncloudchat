<script lang="ts">
  import type { Channel, Chat } from "$lib/types/type";
  import type { MessageType } from "$lib/types/MessageType";

  // import HomeHeader from "$components/HomeHeader.svelte";
  import Navigation from "$components/Navigation.svelte";
  import MyChat from "$pages/MyChat.svelte";
  import OpenChat from "$pages/OpenChat.svelte";
  import ChannelSettingModal from "$components/modals/ChannelSettingModal.svelte";
  import { onDestroy, onMount } from "svelte";
  import { store } from "$store/store";
  import { bind, unbindall } from "$lib/NcloudChat";
  import FloatingActionButton from "$components/FloatingActionButton.svelte";
  import CreateChannelModal from "$components/modals/CreateChannelModal.svelte";

  let chat: Chat;
  let newChannel: Channel = null;
  let showSettingModal = false;
  let showCreateChannelModal = false;

  function onCreateChannelModalClose() {
    showCreateChannelModal = false;
    if (newChannel) {
      $store.channel = newChannel;
      window.sessionStorage.setItem("store", JSON.stringify($store));
      location.href = `/#/chat/${newChannel.channel_id}`;
    }
  }

  onMount(() => {
    if (!$store.token) {
      location.href = "/";
    }

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
            <OpenChat />
          {/if}
        </div>
        <FloatingActionButton
          on:click={() => (showCreateChannelModal = true)}
        />
      </div>
    </div>
  </div>
</div>

{#if showSettingModal}
  <ChannelSettingModal on:close={() => (showSettingModal = false)} />
{/if}

{#if showCreateChannelModal}
  <CreateChannelModal on:close={onCreateChannelModalClose} bind:newChannel />
{/if}
