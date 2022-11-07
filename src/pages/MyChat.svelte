<script lang="ts">
  import type { Chat, Channel } from "$lib/types/type";

  import MyChannelItem from "$components/MyChannelItem.svelte";
  import InfiniteScroll from "$components/InfiniteScroll.svelte";
  import FloatingActionButton from "$components/FloatingActionButton.svelte";
  import CreateChannelModal from "$components/modals/CreateChannelModal.svelte";
  import ChatExitModal from "$components/modals/ChatExitModal.svelte";
  import Spinner from "$components/Spinner.svelte";
  import { onMount } from "svelte";
  import { store } from "$store/store";
  import {
    apiDeleteChannelNotification,
    apiGetChannels,
    apiUnsubscribe,
  } from "$lib/api";
  import { unsubscribe } from "$lib/NcloudChat";

  export let chat: Chat;

  let page = 1;
  let data: Channel[] = [];
  let newData: Channel[] = [];
  let showCreateChannelModal = false;
  let showChatExitModal = false;
  let newChannel: Channel = null;
  let loading = false;
  let channelId: string;

  $: {
    if (chat) {
      const index = data.findIndex((x) => x.channel_id === chat.channel_id);
      if (index >= 0) {
        data[index].message =
          data[index].chat_type === "file" ? "이미지" : chat.message;
        data[index].last_chat_at = chat.created_at;
        data[index].unread_count += 1;

        const refresh = data.splice(index, 1);
        data = [...refresh, ...data];
      }
    }
  }

  async function loadChannels() {
    loading = true;
    try {
      const res = await apiGetChannels("my", page);
      newData = res.data;
      data = [...data, ...newData];
    } catch (err) {
      console.error(err);
      return;
    }
    loading = false;
  }

  function onCreateChannelModalClose() {
    showCreateChannelModal = false;
    if (newChannel) {
      $store.channel = newChannel;
      window.sessionStorage.setItem("store", JSON.stringify($store));
      location.href = `/#/chat/${newChannel.channel_id}`;
    }
  }

  function openChatExitModal(e) {
    showChatExitModal = true;
    channelId = e.detail.channelId;
  }

  function exitChannel() {
    loading = true;
    try {
      apiUnsubscribe(channelId);
      unsubscribe(channelId);
      apiDeleteChannelNotification(channelId);
    } catch (err) {
      console.error(err);
    }

    data = data.filter((x) => x.channel_id !== channelId);

    loading = false;
    showChatExitModal = false;
  }

  onMount(() => {
    $store.activeItem = "My 채팅";
    window.sessionStorage.setItem("store", JSON.stringify($store));
    loadChannels();
  });
</script>

<div
  class="fixed top-[3.2rem] w-full h-full pt-4 pb-14 overflow-x-auto scrollbar-hide"
>
  {#if data.length > 0}
    {#each data as item}
      <MyChannelItem {item} on:exit={openChatExitModal} />
    {/each}

    <InfiniteScroll
      hasMore={newData.length > 0}
      threshold={200}
      on:loadMore={async () => {
        page++;
        await loadChannels();
      }}
    />
  {:else}
    <div
      class="fixed w-11/12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col"
    >
      <span class="text-gray-600 text-2xl mb-3 font-sbaggrom text-center"
        >참여중인 채팅이 없어요!</span
      >
      <span class="text-gray-300 text-base text-center"
        >오른쪽 하단의 채팅하기 아이콘을 누르면<br />직접 방을 만들 수 있어요!</span
      >
    </div>
  {/if}
</div>
<FloatingActionButton on:click={() => (showCreateChannelModal = true)} />

{#if showCreateChannelModal}
  <CreateChannelModal on:close={onCreateChannelModalClose} bind:newChannel />
{/if}

{#if showChatExitModal}
  <ChatExitModal
    on:submit={exitChannel}
    on:close={() => (showChatExitModal = false)}
  />
{/if}

{#if loading}
  <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <Spinner />
  </div>
{/if}
