<script lang="ts">
  import type { Chat, Channel } from "$lib/types/type";

  import MyChannelItem from "$components/MyChannelItem.svelte";
  import InfiniteScroll from "$components/InfiniteScroll.svelte";
  import FloatingActionButton from "$components/FloatingActionButton.svelte";
  import CreateChannelModal from "$components/modals/CreateChannelModal.svelte";
  import Spinner from "$components/Spinner.svelte";
  import { onMount } from "svelte";
  import { store } from "$store/store";
  import { apiGetChannels } from "$lib/api";

  export let chat: Chat;

  let page = 1;
  let data: Channel[] = [];
  let newData: Channel[] = [];
  let showModal = false;
  let newChannel: Channel = null;
  let loading = false;

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

  function onModalClose() {
    showModal = false;
    if (newChannel) {
      data = [newChannel, ...data];
    }
  }

  onMount(async () => {
    $store.activeItem = "My 채팅";
    window.sessionStorage.setItem("store", JSON.stringify($store));
    await loadChannels();
  });
</script>

<div
  class="fixed w-full h-full mt-32 pr-5 pl-5 overflow-y-auto flex flex-col scrollbar-hide"
>
  {#if data.length > 0}
    {#each data as item}
      <MyChannelItem {item} />
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
    <div class="w-full h-full -mt-32 flex flex-col justify-center items-center">
      <span class="text-gray-600 text-2xl mb-3 font-sbaggrom text-center"
        >참여중인 채팅이 없어요!</span
      >
      <span class="text-gray-300 text-base text-center"
        >오른쪽 하단의 채팅하기 아이콘을 누르면<br />직접 방을 만들 수 있어요!</span
      >
    </div>
  {/if}
</div>
<FloatingActionButton on:click={() => (showModal = true)} />

{#if showModal}
  <CreateChannelModal on:close={onModalClose} bind:newChannel />
{/if}

{#if loading}
  <div class="fixed top-[calc(50%-2.25rem)] left-[calc(50%-1rem)]">
    <Spinner />
  </div>
{/if}
