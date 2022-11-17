<script lang="ts">
  import type { Channel } from "$lib/types/type";

  import OpenChannelItem from "$components/OpenChannelItem.svelte";
  import ChatSubscriptionModal from "$components/modals/ChatSubscriptionModal.svelte";
  import Spinner from "$components/Spinner.svelte";
  import InfiniteScroll from "$components/InfiniteScroll.svelte";
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

<div class="chat_srch">
  <div class="srch_wr">
    <input
      type="text"
      placeholder="대화방을 검색해보세요!"
      bind:value={searchText}
      on:keydown={(e) => {
        if (e.key === "Enter") {
          searchChannels();
        }
      }}
    />
    <input type="button" class="svg" on:click={searchChannels} />
  </div>
</div>
{#if data.length > 0}
  <div class="open_chat active mt-28">
    <div class="chat_list active">
      <ul>
        {#each data as item}
          <li>
            <OpenChannelItem {item} on:open={openSubscriptionModal} />
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
          <strong class="aggro">검색된 채팅이 없어요!</strong>
        </div>
      </div>
    </div>
  </div>
{/if}

{#if loading}
  <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
    <Spinner />
  </div>
{/if}

{#if showSubscriptionModal}
  <ChatSubscriptionModal
    {item}
    channel_id={item.channel_id}
    on:close={() => {
      showSubscriptionModal = false;
    }}
  />
{/if}
