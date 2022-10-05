<script lang="ts">
  import ChatSendItem from "../components/ChatSendItem.svelte";
  import ChatReceiveItem from "../components/ChatReceiveItem.svelte";
  import MessageInput from "../components/MessageInput.svelte";
  import {
    getMessages,
    isConnected,
    sendMessage,
    bind,
    unbindall,
  } from "../lib/NcloudChat";
  import { user } from "../store/store";
  import { onMount, onDestroy } from "svelte";
  import type { MessageType } from "../lib/types/MessageType";

  export let params: any;
  let input: string;
  let userValue: any;

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

  let promise = getMessages(params.id, 0, 20);

  onMount(async () => {
    await bind(
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

  onDestroy(async () => {
    await unbindall("onMessageReceived");
  });
</script>

<div
  class="w-full h-screen bg-gray-100 pl-5 pr-5 pb-20 overflow-y-auto flex flex-col-reverse"
>
  {#await promise}
    <div class="w-full h-screen flex justify-center items-center">
      <div class="text-lg font-medium">채팅 내용을 불러오는 중...</div>
    </div>
  {:then messages}
    <div id="messages">
      {#each messages.reverse() as item}
        {#if item.sender.id !== userValue.id}
          <ChatReceiveItem {item} />
        {:else}
          <ChatSendItem {item} />
        {/if}
      {/each}
    </div>
  {/await}
</div>
<MessageInput {send} bind:input />
