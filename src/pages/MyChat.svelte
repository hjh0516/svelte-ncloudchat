<script lang="ts">
  import type { Chat, Channel } from "$lib/types/type";

  import { onMount } from "svelte";
  import CreateChannelModal from "$components/CreateChannelModal.svelte";
  import FloatingActionButton from "$components/FloatingActionButton.svelte";
  import MyChannelItem from "$components/MyChannelItem.svelte";
  import InfiniteScroll from "$components/InfiniteScroll.svelte";
  import { apiGetChannels } from "$lib/api";

  export let chat: Chat;

  let page = 1;
  let data: Channel[] = [];
  let newData: Channel[] = [];
  let showModal = false;
  let newChannel: Channel = null;

  $: {
    if (chat) {
      const index = data.findIndex((x) => x.channel_id === chat.channel_id);
      if (index >= 0) {
        data[index].message = chat.message;
        data[index].last_chat_at = chat.created_at;

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
      console.log(err);
      return;
    }
  }

  function onModalClose() {
    showModal = false;
    if (newChannel) {
      data = [newChannel, ...data];
    }
  }

  onMount(async () => {
    await loadChannels();
  });
</script>

<div
  class="fixed w-full h-full pt-32 pr-5 pl-5 overflow-y-auto flex flex-col scrollbar-hide"
>
  {#each data as item}
    <MyChannelItem {item} />
  {/each}

  <InfiniteScroll
    hasMore={newData.length > 0}
    threshold={100}
    on:loadMore={async () => {
      page++;
      await loadChannels();
    }}
  />
</div>
<FloatingActionButton on:click={() => (showModal = true)} />

{#if showModal}
  <CreateChannelModal on:close={onModalClose} bind:newChannel />
{/if}
