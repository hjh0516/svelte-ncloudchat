<script lang="ts">
  import type { Channel } from "$lib/types/type";

  import OpenChannelItem from "$components/OpenChannelItem.svelte";
  import InfiniteScroll from "$components/InfiniteScroll.svelte";
  import Spinner from "$components/Spinner.svelte";
  import { onMount } from "svelte";
  import { store } from "$store/store";
  import { apiGetChannels } from "$lib/api";

  let page = 1;
  let data: Channel[] = [];
  let newData: Channel[] = [];
  let searchText: string;
  let loading = false;

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

  async function searchChannels() {
    page = 1;
    data = [];
    await loadChannels(searchText);
  }

  onMount(async () => {
    $store.activeItem = "오픈 채팅";
    window.sessionStorage.setItem("store", JSON.stringify($store));
    await loadChannels();
  });
</script>

<div class="fixed w-11/12 top-32 left-1/2 -translate-x-1/2 rounded-2xl">
  <div
    class="w-full h-12 border border-gray-400 bg-white rounded-2xl flex justify-center items-center focus-within:border-cyan-500"
    style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0)"
  >
    <input
      class="w-full h-10 ml-3 mr-1 pl-1 pr-1 focus:outline-none text-base"
      type="text"
      placeholder="대화방을 검색해보세요!"
      bind:value={searchText}
    />
    <button
      class="mr-3 hover:text-gray-500"
      on:click={async () => {
        searchChannels();
      }}
    >
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
  class="fixed w-full h-full mt-48 pl-5 pr-5 pb-48 overflow-y-auto flex flex-col scrollbar-hide"
>
  {#if data.length > 0}
    {#each data as item}
      <OpenChannelItem {item} />
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
    <div class="w-full h-full -mt-24 flex flex-col justify-center items-center">
      <span class="text-gray-600 text-3xl mb-3 font-sbaggrom text-center"
        >개설된 채팅이 없어요!</span
      >
    </div>
  {/if}
</div>

{#if loading}
  <div class="fixed top-[calc(50%-2.25rem)] left-[calc(50%-1rem)]">
    <Spinner />
  </div>
{/if}
