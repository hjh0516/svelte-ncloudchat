<script lang="ts">
  import type { Channel, Chat } from "$lib/types/type";

  import OpenChannelItem from "$components/OpenChannelItem.svelte";
  import ChatSubscriptionModal from "$components/modals/ChatSubscriptionModal.svelte";
  import Spinner from "$components/Spinner.svelte";
  import InfiniteScroll from "$components/InfiniteScroll.svelte";
  import { onMount } from "svelte";
  import { querystring } from "svelte-spa-router";
  import { store } from "$store/store";
  import { apiGetChannel, apiGetChannels } from "$lib/api";

  export let chat: Chat;
  export let showSettingModal: boolean;

  let page = 1;
  let data: Channel[] = [];
  let newData: Channel[] = [];
  let searchText: string;
  let item = null;
  let loading = false;
  let showSubscriptionModal = false;

  $: {
    if (showSettingModal) {
      if (showSubscriptionModal) {
        showSubscriptionModal = false;
      }
    }

    if (chat) {
      const index = data.findIndex((x) => x.channel_id === chat.channel_id);
      if (index >= 0) {
        data[index].last_chat_at = chat.created_at;

        const refresh = data.splice(index, 1);
        data = [...refresh, ...data];
      }
    }
  }

  async function loadChannels(searchText?: string) {
    try {
      const res = await apiGetChannels("open", page, searchText);
      newData = res.data;
      data = [...data, ...newData];
    } catch (err) {
      console.error(err);
      return;
    }
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

  onMount(async () => {
    $store.activeItem = "오픈 채팅";
    window.sessionStorage.setItem("store", JSON.stringify($store));

    const params = new URLSearchParams($querystring);
    if (params.has("channel_id")) {
      item = await apiGetChannel(params.get("channel_id"));
      showSubscriptionModal = true;
      location.replace("/#/home");
    }
  });
</script>

<div class="chat_srch">
  <div class="srch_wr">
    <input
      type="text"
      placeholder="대화방을 검색해보세요!"
      bind:value={searchText}
      on:keypress={(e) => {
        if (e.key === "Enter") {
          searchChannels();
        }
      }}
    />
    <input type="button" class="svg" on:click={searchChannels} />
  </div>
</div>
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
    <div id="openChat" class="open_chat active mt-28">
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
        await loadChannels(searchText);
      }}
    />
  {:else}
    <div id="openChat" class="none_msg active">
      <div class="tb">
        <div class="tbc">
          <div class="msg">
            <strong class="aggro">검색된 채팅이 없어요!</strong>
          </div>
        </div>
      </div>
    </div>
  {/if}
{/await}

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

{#if showSubscriptionModal}
  <ChatSubscriptionModal
    {item}
    on:close={() => {
      showSubscriptionModal = false;
    }}
  />
{/if}
