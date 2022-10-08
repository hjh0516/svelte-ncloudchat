<script lang="ts">
  import type { Chat, Channel, User } from "$lib/types/type";

  import CreateChannelModal from "$components/CreateChannelModal.svelte";
  import FloatingActionButton from "$components/FloatingActionButton.svelte";
  import MyChannelItem from "$components/MyChannelItem.svelte";
  import Spinner from "$components/Spinner.svelte";
  import InfiniteLoading from "svelte-infinite-loading";
  import { user } from "$store/store";
  import { apiGetChannels } from "$lib/api";

  export let chat: Chat;

  let page = 1;
  let userValue: User;
  let element: HTMLElement;
  let data: Channel[] = [];
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

  user.subscribe((value) => {
    userValue = value;
  });

  function loadChannels({ detail: { loaded, complete } }) {
    try {
      apiGetChannels("my", page).then((newData) => {
        if (newData.data.length) {
          page++;
          data = [...data, ...newData.data];
          loaded();
        } else {
          complete();
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  function onModalClose() {
    showModal = false;
    if (newChannel) {
      data = [newChannel, ...data];
    }
  }
</script>

<div
  class="fixed w-full h-full pt-14 pr-5 pl-5 overflow-y-auto flex flex-col scrollbar-hide"
  bind:this={element}
>
  {#each data as item}
    <MyChannelItem {item} />
  {/each}

  <InfiniteLoading on:infinite={loadChannels}>
    <div slot="noMore" />
    <div slot="noResults" />
    <div
      slot="spinner"
      class="fixed left-[calc(50%-1rem)] top-[calc(50%-2.25rem)]"
    >
      <Spinner />
    </div>
  </InfiniteLoading>
</div>
<FloatingActionButton on:click={() => (showModal = true)} />

{#if showModal}
  <CreateChannelModal on:close={onModalClose} bind:newChannel />
{/if}
