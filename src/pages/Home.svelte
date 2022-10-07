<script lang="ts">
  import type { MemberType } from "$lib/types/MemberType";
  import type { ChannelType } from "$lib/types/ChannelType";
  import type { MessageType } from "$lib/types/MessageType";

  import { onDestroy, onMount } from "svelte";
  import Navigation from "$components/Navigation.svelte";
  import MyChat from "$pages/MyChat.svelte";
  import OpenChat from "$pages/OpenChat.svelte";
  import { bind, getChannel, unbindall, updateChannel } from "$lib/NcloudChat";
  import { activeItem, isConnected, user } from "$store/store";

  let channel: ChannelType;

  let isConnectedValue: boolean;
  isConnected.subscribe((value) => {
    isConnectedValue = value;
  });

  let activeItemValue: string;
  activeItem.subscribe((value) => {
    activeItemValue = value;
  });

  let userValue: MemberType;
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

    bind(
      "onMessageReceived",
      async function (_channel: string, _message: MessageType) {
        channel = await getChannel(_channel);
        if (channel.user_id.name == userValue.name) {
          await updateChannel(
            channel.id,
            channel.type,
            channel.name,
            Date.now().toString()
          );
        }
      }
    );
  });

  onDestroy(() => {
    unbindall("onMessageReceived");
  });
</script>

<main>
  <Navigation />
  {#if isConnectedValue}
    {#if activeItemValue === "My 채팅"}
      <MyChat />
    {:else if activeItemValue === "오픈 채팅"}
      <OpenChat />
    {/if}
  {/if}
</main>
