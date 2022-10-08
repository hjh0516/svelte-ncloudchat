<script lang="ts">
  import type { User, Chat } from "$lib/types/type";
  import type { MessageType } from "$types/MessageType";

  import { onMount, onDestroy } from "svelte";
  import InfiniteLoading from "svelte-infinite-loading";
  import ChatSendItem from "$components/ChatSendItem.svelte";
  import ChatReceiveItem from "$components/ChatReceiveItem.svelte";
  import MessageInput from "$components/MessageInput.svelte";
  import Spinner from "$components/Spinner.svelte";
  import { isConnected, sendMessage, bind, unbindall } from "$lib/NcloudChat";
  import { user } from "$store/store";
  import { apiGetMessages, apiCreateMessage } from "$lib/api";

  export let params: any;

  let input: string;
  let userValue: User;
  let element: HTMLElement;

  let page = 1;
  let data: Chat[] = [];

  user.subscribe((value) => {
    userValue = value;
  });

  if (!isConnected() || !userValue) {
    location.href = "/";
  }

  async function send() {
    try {
      const message = await sendMessage(params.id, "text", input);
      await apiCreateMessage(message.channelId, message.type, message.message);
    } catch (err) {
      console.error(err);
    }
    input = "";
  }

  function loadMessages({ detail: { loaded, complete } }) {
    try {
      apiGetMessages(params.id, page).then((newData) => {
        if (newData.data.length) {
          page++;
          data = [...newData.data.reverse(), ...data];
          loaded();
        } else {
          complete();
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  onMount(() => {
    bind(
      "onMessageReceived",
      async function (_channel: string, message: MessageType) {
        const chat: Chat = {
          nickname: message.sender.name,
          profile: message.sender.profile,
          type: message.message_type,
          message: message.content,
          created_at: message.created_at,
        };

        if (Number(message.sender.id.split("_")[1]) === Number(userValue.id)) {
          new ChatSendItem({
            props: {
              item: chat,
            },
            target: element,
          });
        } else {
          new ChatReceiveItem({
            props: {
              item: chat,
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
    <div
      slot="spinner"
      class="fixed left-[calc(50%-1rem)] top-[calc(50%-2.25rem)]"
    >
      <Spinner />
    </div>
  </InfiniteLoading>

  {#each data as item}
    {#if item.user_idx !== Number(userValue.id)}
      <ChatReceiveItem {item} />
    {:else}
      <ChatSendItem {item} />
    {/if}
  {/each}
</div>
<MessageInput {send} bind:input />
