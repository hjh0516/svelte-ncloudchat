<script lang="ts">
  import type { MemberType } from "../lib/types/MemberType";
  import type { ChannelType } from "../lib/types/ChannelType";

  import ChannelItem from "../components/ChannelItem.svelte";
  import Spinner from "../components/Spinner.svelte";
  import InfiniteLoading from "svelte-infinite-loading";
  import { getChannels, getSubscriptions } from "../lib/NcloudChat";
  import { retryAsync } from "ts-retry";
  import { user } from "../store/store";

  const per_page = 10;

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
    return await retryAsync(
      async () => {
        const subscriptions = await getSubscriptions(
          userValue.id,
          offset,
          per_page
        );
        let channels = await getChannels(offset, per_page);

        channels = channels.filter((channel) => {
          return !subscriptions
            .map((subscription) => subscription.channel_id)
            .includes(channel.id);
        });
        return channels;
      },
      { delay: 50, maxTry: 5 }
    );
  }
</script>

<div class="fixed w-11/12 top-14 left-1/2 -translate-x-1/2 z-10">
  <div
    class="w-full h-12 border border-gray-200 bg-white mb-5 rounded-2xl flex justify-center items-center shadow-md"
  >
    <input
      class="w-full h-10 ml-3 mr-1 pl-1 pr-1 focus:outline-none text-base"
      type="text"
      placeholder="대화방을 검색해보세요!"
    />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      class="w-8 h-8 mr-3 text-gray-400 hover:text-gray-300"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  </div>
</div>

<div
  class="fixed w-full h-full pt-32 pl-5 pr-5 overflow-y-auto flex flex-col scrollbar-hide"
>
  {#each data as item}
    <ChannelItem {item} />
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
