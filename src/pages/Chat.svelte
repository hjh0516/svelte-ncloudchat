<script lang="ts">
  import ChatSendItem from "../components/ChatSendItem.svelte";
  import ChatReceiveItem from "../components/ChatReceiveItem.svelte";
  import MessageInput from "../components/MessageInput.svelte";
  import { getMessages, isConnected, sendMessage } from "../lib/NcloudChat";
  import { user } from "../store/store";
  import type { MessageType } from "../lib/types/MessageType";

  export let params: any;
  let message: string;
  let userValue: any;

  user.subscribe((value) => {
    userValue = value;
  });

  if (!isConnected()) {
    location.href = "/";
  }

  async function send() {
    const send = await sendMessage(params.id, "text", message);
    const m: MessageType = {
      channel_id: send.channelId,
      sender: send.user,
      content: send.message,
      message_type: send.type,
      sort_id: Date.now().toString(),
    };
    message = "";

    new ChatSendItem({
      props: {
        message: m,
      },
      target: document.getElementById("messages"),
    });
  }

  let promise = getMessages(params.id, 0, 20);
</script>

<div
  class="w-full h-[calc(100vh)] bg-gray-100 pl-5 pr-5 pb-16 overflow-y-auto flex flex-col-reverse"
>
  {#await promise}
    <div class="w-full h-screen flex justify-center items-center">
      <div class="text-lg font-medium">채팅 내용을 불러오는 중...</div>
    </div>
  {:then messages}
    <div id="messages">
      {#each messages as message}
        {#if message.sender.id !== userValue.id}
          <ChatReceiveItem {message} />
        {:else}
          <ChatSendItem {message} />
        {/if}
      {/each}
    </div>
  {/await}
</div>
<MessageInput {send} bind:message />
