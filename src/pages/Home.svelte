<script lang="ts">
  import { onMount } from "svelte";
  import Navigation from "$components/Navigation.svelte";
  import MyChat from "$pages/MyChat.svelte";
  import OpenChat from "$pages/OpenChat.svelte";
  import { bind } from "$lib/NcloudChat";
  import { activeItem, isConnected } from "$store/store";

  let isConnectedValue: boolean;
  isConnected.subscribe((value) => {
    isConnectedValue = value;
  });

  let activeItemValue: string;
  activeItem.subscribe((value) => {
    activeItemValue = value;
  });

  onMount(() => {
    bind("onConnected", function (_socket: any) {
      isConnected.set(true);
    });

    bind("onDisconnected", function (reason: any) {
      console.log(reason);
      // location.href = "/";
    });
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
