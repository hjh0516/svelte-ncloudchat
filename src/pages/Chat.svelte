<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import ChatSendItem from "../components/ChatSendItem.svelte";
  import ChatReceiveItem from "../components/ChatReceiveItem.svelte";
  import MessageInput from "../components/MessageInput.svelte";
  import InfiniteLoading from "svelte-infinite-loading";
  import {
    getMessages,
    isConnected,
    sendMessage,
    bind,
    unbindall,
  } from "../lib/NcloudChat";
  import { user } from "../store/store";
  import type { MemberType } from "../lib/types/MemberType";
  import type { MessageType } from "../lib/types/MessageType";
  import Spinner from "../components/Spinner.svelte";

  export let params: any;

  const per_page = 20;

  let input: string;
  let userValue: MemberType;
  let offset = 0;
  let data: MessageType[] = [];
  let newData: MessageType[] = [];

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

  $: data = [...newData.reverse(), ...data];

  onMount(() => {
    bind(
      "onMessageReceived",
      function (_channel: string, message: MessageType) {
        if (message.sender.id === userValue.id) {
          new ChatSendItem({
            props: {
              item: message,
            },
            target: document.getElementById("messages"),
          });
        } else {
          new ChatReceiveItem({
            props: {
              item: message,
            },
            target: document.getElementById("messages"),
          });
        }
      }
    );
  });

  onDestroy(() => {
    unbindall("onMessageReceived");
  });
</script>

<div
  class="w-full h-screen bg-gray-100 pl-5 pr-5 pb-20 overflow-y-auto flex flex-col"
>
  <InfiniteLoading on:infinite={loadMessages} direction="top">
    <div slot="noMore" class="text-sm text-gray-400 font-bold pt-5">
      마지막 메시지에요!
    </div>
    <div slot="noResults" class="text-sm text-gray-400 font-bold pt-5">
      메시지가 없어요!
    </div>
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
