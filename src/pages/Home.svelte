<script lang="ts">
  import type { Chat, User } from "$lib/types/type";
  import type { MessageType } from "$types/MessageType";

  import { onDestroy, onMount } from "svelte";
  import Navigation from "$components/Navigation.svelte";
  import MyChat from "$pages/MyChat.svelte";
  import OpenChat from "$pages/OpenChat.svelte";
  import { bind, unbindall } from "$lib/NcloudChat";
  import { activeItem, isConnected, user } from "$store/store";

  let chat: Chat;

  let isConnectedValue: boolean;
  isConnected.subscribe((value) => {
    isConnectedValue = value;
  });

  let activeItemValue: string;
  activeItem.subscribe((value) => {
    activeItemValue = value;
  });

  let userValue: User;
  user.subscribe((value) => {
    userValue = value;
  });

  onMount(() => {
    bind("onConnected", function (_socket: any) {
      isConnected.set(true);
    });

    bind("onDisconnected", function (reason: any) {
      console.log(reason);
    });

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
  <Navigation />
  {#key isConnectedValue}
    {#if isConnectedValue}
      {#if activeItemValue === "My 채팅"}
        <MyChat {chat} />
      {:else if activeItemValue === "오픈 채팅"}
        <OpenChat />
      {/if}
    {/if}
  {/key}
</main>
