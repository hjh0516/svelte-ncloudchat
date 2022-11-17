<script lang="ts">
  import type { Chat, Channel } from "$lib/types/type";

  import MyChannelItem from "$components/MyChannelItem.svelte";
  import InfiniteScroll from "$components/InfiniteScroll.svelte";
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
  let showChatExitModal = false;
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

{#if data.length > 0}
  <div class="my_chat active">
    <div class="chat_list pb-5">
      <ul>
        {#each data as item, index}
          <li>
            <MyChannelItem {index} {item} on:exit={openChatExitModal} />
          </li>
        {/each}
      </ul>
    </div>
  </div>
  <InfiniteScroll
    hasMore={newData.length > 0}
    threshold={200}
    on:loadMore={async () => {
      page++;
      await loadChannels();
    }}
  />
{:else}
  <div class="none_msg active">
    <div class="tb">
      <div class="tbc">
        <div class="msg">
          <strong class="aggro">참여중인 채팅이 없어요!</strong>
          <p>
            오른쪽 하단의 채팅하기 아이콘을 누르면<br />
            직접 방을 만들 수 있어요!
          </p>
        </div>
      </div>
    </div>
  </div>
{/if}

{#if showChatExitModal}
  <ChatExitModal
    on:submit={exitChannel}
    on:close={() => (showChatExitModal = false)}
  />
{/if}

{#if loading}
  <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
    <Spinner />
  </div>
{/if}
