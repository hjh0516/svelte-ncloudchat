<script lang="ts">
  import type { Chat } from "$lib/types/type";
  import type { MessageType } from "$types/MessageType";

  import { onDestroy, onMount } from "svelte";
  import Navigation from "$components/Navigation.svelte";
  import MyChat from "$pages/MyChat.svelte";
  import OpenChat from "$pages/OpenChat.svelte";
  import { bind, unbindall } from "$lib/NcloudChat";
  import { store } from "$store/store";
  import HomeHeader from "$components/HomeHeader.svelte";

  let chat: Chat;

  onMount(() => {
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
  <HomeHeader />
  <Navigation />
  {#if $store.activeItem === "My 채팅"}
    <MyChat {chat} />
  {:else if $store.activeItem === "오픈 채팅"}
    <OpenChat />
  {/if}
</main>
