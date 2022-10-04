<script lang="ts">
  import ChatSendItem from "../components/ChatSendItem.svelte";
  import ChatReceiveItem from "../components/ChatReceiveItem.svelte";
  import MessageInput from "../components/MessageInput.svelte";
  import { getMessages, isConnected } from "../lib/NcloudChat";
  import { user } from "../store/store";

  export let params: any;
  let userValue: any;

  user.subscribe((value) => {
    userValue = value;
  });

  if (!isConnected()) {
    location.href = "/";
  }

  const promise = getMessages(params.id, 0, 20);
</script>

<div
  class="w-full h-[calc(100vh)] bg-gray-100 pl-5 pr-5 pb-16 overflow-y-auto flex flex-col-reverse"
>
  {#await promise}
    <div class="w-full h-screen flex justify-center items-center">
      <div class="text-lg font-medium">채팅 내용을 불러오는 중...</div>
    </div>
  {:then messages}
    <div>
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
<MessageInput channel_id={params.id} />
