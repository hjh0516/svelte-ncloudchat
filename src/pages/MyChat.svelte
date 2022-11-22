<script lang="ts">
  import type { Chat, Channel } from "$lib/types/type";

  import MyChannelItem from "$components/MyChannelItem.svelte";
  import InfiniteScroll from "$components/InfiniteScroll.svelte";
  import ChatExitModal from "$components/modals/ChatExitModal.svelte";
  import Spinner from "$components/Spinner.svelte";
  import { onMount } from "svelte";
  import { store } from "$store/store";
  import {
    apiCreateMessage,
    apiDeleteChannel,
    apiDeleteChannelNotification,
    apiGetChannel,
    apiGetChannels,
    apiUnsubscribe,
  } from "$lib/api";
  import { sendMessage, unsubscribe } from "$lib/NcloudChat";

  export let chat: Chat;

  let page = 1;
  let data: Channel[] = [];
  let newData: Channel[] = [];
  let showChatExitModal = false;
  let loading = false;
  let channel_id: string;

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
    try {
      const res = await apiGetChannels("my", page);
      newData = res.data;
      data = [...data, ...newData];
    } catch (err) {
      console.error(err);
      return;
    }
  }

  function openChatExitModal(e) {
    showChatExitModal = true;
    channel_id = e.detail.channel_id;
  }

  async function exitChannel() {
    loading = true;

    const message = `${$store.user.name}님이 퇴장했어요.`;
    try {
      await apiUnsubscribe(channel_id);
      apiCreateMessage(channel_id, "system", message);
      apiDeleteChannelNotification(channel_id);

      const channel = await apiGetChannel(channel_id);
      if (channel.user_idx === Number($store.user.id)) {
        apiDeleteChannel(channel_id);
      }
    } catch (err) {
      console.error(err);
    }

    try {
      sendMessage(channel_id, "system", message);
      unsubscribe(channel_id);
    } catch (err) {
      console.error(err);
    }

    data = data.filter((x) => x.channel_id !== channel_id);

    loading = false;
    showChatExitModal = false;
  }

  onMount(() => {
    $store.activeItem = "My 채팅";
    window.sessionStorage.setItem("store", JSON.stringify($store));
  });
</script>

{#await loadChannels()}
  <div
    class="fixed top-0 left-0 w-full h-full bg-gray-400 bg-opacity-10"
    style="z-index: 200;"
  >
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Spinner />
    </div>
  </div>
{:then}
  {#if data.length > 0}
    <div id="myChat" class="my_chat active">
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
        loading = true;
        page++;
        await loadChannels();
        loading = false;
      }}
    />
  {:else}
    <div id="myChat" class="none_msg active">
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
{/await}

{#if showChatExitModal}
  <ChatExitModal
    independ={true}
    on:submit={exitChannel}
    on:close={() => (showChatExitModal = false)}
  />
{/if}

{#if loading}
  <div
    class="fixed top-0 left-0 w-full h-full bg-gray-400 bg-opacity-10"
    style="z-index: 200;"
  >
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Spinner />
    </div>
  </div>
{/if}
