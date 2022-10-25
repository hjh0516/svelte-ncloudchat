<script lang="ts">
  import type { Chat } from "$lib/types/type";
  import type { MessageType } from "$lib/types/MessageType";

  import HomeHeader from "$components/HomeHeader.svelte";
  import Navigation from "$components/Navigation.svelte";
  import MyChat from "$pages/MyChat.svelte";
  import OpenChat from "$pages/OpenChat.svelte";
  import SettingModal from "$components/modals/SettingModal.svelte";
  import { onDestroy, onMount } from "svelte";
  import { store } from "$store/store";
  import { bind, unbindall } from "$lib/NcloudChat";

  let chat: Chat;
  let showSettingModal = false;

  function closeSettingModal() {
    showSettingModal = false;
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

<main>
  <HomeHeader bind:showSettingModal />
  <Navigation />
  {#if $store.activeItem === "My 채팅"}
    <MyChat {chat} />
  {:else if $store.activeItem === "오픈 채팅"}
    <OpenChat />
  {/if}

  {#if showSettingModal}
    <SettingModal on:close={closeSettingModal} />
  {/if}
</main>
