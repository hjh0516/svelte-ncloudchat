<script lang="ts">
  import type { MemberType } from "$lib/types/MemberType";
  import type { ChannelType } from "$lib/types/ChannelType";

  import ChannelItem from "$components/ChannelItem.svelte";
  import CreateChannelModal from "$components/CreateChannelModal.svelte";
  import FloatingActionButton from "$components/FloatingActionButton.svelte";
  import Spinner from "$components/Spinner.svelte";
  import InfiniteLoading from "svelte-infinite-loading";
  import { user } from "$store/store";
  import { getChannels, getSubscriptions } from "$lib/NcloudChat";

  const per_page = 20;

  let userValue: MemberType;
  let element: HTMLElement;
  let offset = 0;
  let data: ChannelType[] = [];
  let showModal = false;
  let newChannel: ChannelType = null;

  user.subscribe((value) => {
    userValue = value;
  });

  function loadChannels({ detail: { loaded, complete } }) {
    fetchChannels(offset, per_page).then((newData) => {
      if (newData.length) {
        offset += per_page;
        data = [...data, ...newData];
        loaded();
      } else {
        complete();
      }
    });
  }

  async function fetchChannels(offset: number, per_page: number) {
    const subscriptions = await getSubscriptions(
      userValue.id,
      offset,
      per_page
    );
    let channels = await getChannels(offset, per_page);
    channels = channels.filter((channel) => {
      return subscriptions
        .map((subscription) => subscription.channel_id)
        .includes(channel.id);
    });
    return channels;
  }

  function onModalClose() {
    showModal = false;
    if (newChannel) {
      new ChannelItem({
        props: {
          item: newChannel,
        },
        target: element,
      });
    }
  }
</script>

<div
  class="fixed w-full h-full pt-14 pr-5 pl-5 overflow-y-auto flex flex-col scrollbar-hide"
  bind:this={element}
>
  {#each data as item}
    {#if item}
      <ChannelItem {item} />
    {/if}
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
