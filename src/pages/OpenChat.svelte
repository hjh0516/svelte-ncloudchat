<script lang="ts">
  import type { Channel } from "$lib/types/type";

  import OpenChannelItem from "$components/OpenChannelItem.svelte";
  import ChatSubscriptionModal from "$components/modals/ChatSubscriptionModal.svelte";
  import InfiniteScroll from "$components/InfiniteScroll.svelte";
  import Spinner from "$components/Spinner.svelte";
  import { onMount } from "svelte";
  import { store } from "$store/store";
  import { apiGetChannels } from "$lib/api";

  let page = 1;
  let data: Channel[] = [];
  let newData: Channel[] = [];
  let searchText: string;
  let item = null;
  let loading = false;
  let showSubscriptionModal = false;

  async function loadChannels(searchText?: string) {
    loading = true;
    try {
      const res = await apiGetChannels("open", page, searchText);
      newData = res.data;
      data = [...data, ...newData];
    } catch (err) {
      console.error(err);
      return;
    }
    loading = false;
  }

  function searchChannels() {
    page = 1;
    data = [];
    loadChannels(searchText);
  }

  function openSubscriptionModal(e) {
    showSubscriptionModal = true;
    item = e.detail.item;
  }

  onMount(() => {
    $store.activeItem = "오픈 채팅";
    window.sessionStorage.setItem("store", JSON.stringify($store));
    loadChannels();
  });
</script>

<div class="fixed w-11/12 top-32 left-1/2 -translate-x-1/2 rounded-2xl">
  <div
    class="w-full h-12 border border-gray-400 rounded-2xl flex justify-center items-center focus-within:border-cyan-500"
    style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0)"
  >
    <input
      class="w-full h-10 ml-3 mr-1 pl-1 pr-1 focus:outline-none text-base"
      type="text"
      placeholder="대화방을 검색해보세요!"
      bind:value={searchText}
    />
    <button class="mr-3 hover:text-gray-500" on:click={searchChannels}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="w-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    </button>
  </div>
</div>
<div
  class="fixed top-44 w-full h-full pt-4 pl-5 pr-5 pb-48 overflow-y-auto scrollbar-hide"
>
  {#if data.length > 0}
    {#each data as item}
      <OpenChannelItem {item} on:open={openSubscriptionModal} />
      <InfiniteScroll
        hasMore={newData.length > 0}
        threshold={100}
        on:loadMore={async () => {
          page++;
          await loadChannels(searchText);
        }}
      />
    {/each}
  {:else}
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <span class="text-gray-600 text-2xl mb-3 font-sbaggrom text-center"
        >개설된 채팅이 없어요!</span
      >
    </div>
  {/if}
</div>

{#if showSubscriptionModal}
  <ChatSubscriptionModal
    {item}
    channel_id={item.channel_id}
    on:close={() => {
      showSubscriptionModal = false;
    }}
  />
{/if}

{#if loading}
  <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <Spinner />
  </div>
{/if}
