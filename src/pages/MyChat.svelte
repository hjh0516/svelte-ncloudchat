<script lang="ts">
  import InfiniteLoading from "svelte-infinite-loading";
  import { retryAsync } from "ts-retry";
  import ChannelItem from "../components/ChannelItem.svelte";
  import FloatingActionButton from "../components/FloatingActionButton.svelte";
  import Spinner from "../components/Spinner.svelte";
  import { user } from "../store/store";
  import { getChannel, getSubscriptions } from "../lib/NcloudChat";
  import type { MemberType } from "../lib/types/MemberType";
  import type { ChannelType } from "../lib/types/ChannelType";

  const per_page = 20;

  let userValue: MemberType;

  let offset = 0;
  let data: ChannelType[] = [];

  user.subscribe((value) => {
    userValue = value;
  });

  if (!userValue) {
    location.href = "/";
  }

  function loadChannels({ detail: { loaded, complete } }) {
    getChannels(offset, per_page).then((newData) => {
      if (newData.length) {
        offset += per_page;
        data = [...data, ...newData];
        loaded();
      } else {
        complete();
      }
    });
  }

  async function getChannels(offset: number, per_page: number) {
    return await retryAsync(
      async () => {
        const subscriptions = await getSubscriptions(
          userValue.id,
          offset,
          per_page
        );

        let channels: ChannelType[] = [];
        for (let subscription of subscriptions) {
          channels = [...channels, await getChannel(subscription.channel_id)];
        }
        return channels;
      },
      { delay: 100, maxTry: 5 }
    );
  }
</script>

<div
  class="w-full h-[calc(100vh - 2.5rem)] pt-5 pr-5 pl-5 overflow-y-auto flex flex-col scrollbar-hide"
>
  {#each data as item}
    <ChannelItem {item} />
  {/each}

  <InfiniteLoading on:infinite={loadChannels}>
    <div slot="noMore" />
    <div slot="noResults" />
    <div
      slot="spinner"
      class="w-full h-[calc(100vh-2.5rem)] flex justify-center items-center"
    >
      <Spinner />
    </div>
  </InfiniteLoading>
</div>
<FloatingActionButton />
