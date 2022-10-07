<script lang="ts">
  import type { MemberType } from "$lib/types/MemberType";
  import type { MessageType } from "$lib/types/MessageType";

  import { onMount, onDestroy } from "svelte";
  import InfiniteLoading from "svelte-infinite-loading";
  import ChatSendItem from "$components/ChatSendItem.svelte";
  import ChatReceiveItem from "$components/ChatReceiveItem.svelte";
  import MessageInput from "$components/MessageInput.svelte";
  import Spinner from "$components/Spinner.svelte";
  import {
    getMessages,
    isConnected,
    sendMessage,
    bind,
    unbindall,
  } from "$lib/NcloudChat";
  import { user } from "$store/store";

  export let params: any;

  const per_page = 20;

  let input: string;
  let userValue: MemberType;
  let element: HTMLElement;

  let offset = 0;
  let data: MessageType[] = [];

  user.subscribe((value) => {
    userValue = value;
  });

  if (!isConnected() || !userValue) {
    location.href = "/";
  }

  async function send() {
    await sendMessage(params.id, "text", input);
    input = "";
  }

  function loadMessages({ detail: { loaded, complete } }) {
    getMessages(params.id, offset, per_page).then((newData) => {
      if (newData.length) {
        offset += per_page;
        data = [...newData.reverse(), ...data];
        loaded();
      } else {
        complete();
      }
    });
  }

  onMount(() => {
    bind(
      "onMessageReceived",
      function (_channel: string, message: MessageType) {
        if (message.sender.id === userValue.id) {
          new ChatSendItem({
            props: {
              item: message,
            },
            target: element,
          });
        } else {
          new ChatReceiveItem({
            props: {
              item: message,
            },
            target: element,
          });
        }
        element.scrollTop = element.scrollHeight;
      }
    );
  });

  onDestroy(() => {
    unbindall("onMessageReceived");
  });
</script>

<div
  class="fixed w-full h-full bg-gray-100 pl-5 pr-5 pb-20 overflow-y-auto flex flex-col scrollbar-hide"
  bind:this={element}
>
  <InfiniteLoading on:infinite={loadMessages} direction="top">
    <div slot="noMore" />
    <div slot="noResults" />
    <Spinner slot="spinner" />
  </InfiniteLoading>

  {#each data as item}
    {#if item.sender.id !== userValue.id}
      <ChatReceiveItem {item} />
    {:else}
      <ChatSendItem {item} />
    {/if}
  {/each}
</div>
<MessageInput {send} bind:input />
