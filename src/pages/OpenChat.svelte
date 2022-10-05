<script lang="ts">
  import ChannelItem from "../components/ChannelItem.svelte";
  import Spinner from "../components/Spinner.svelte";
  import { getChannels, getSubscriptions } from "../lib/NcloudChat";
  import { retryAsync } from "ts-retry";
  import type { MemberType } from "../lib/types/MemberType";
  import { user } from "../store/store";
  import type { ChannelType, SubscriptionType } from "../lib/types/ChannelType";

  let userValue: MemberType;

  user.subscribe((value) => {
    userValue = value;
  });

  if (!userValue) {
    location.href = "/";
  }

  let promise = retryAsync(
    async () => {
      const subscriptions = await getSubscriptions(userValue.id, 0, 20);
      let channels = await getChannels(0, 20);

      channels = channels.filter((channel: ChannelType) => {
        return !subscriptions
          .map((subscription: SubscriptionType) => subscription.channel_id)
          .includes(channel.id);
      });
      return channels;
    },
    { delay: 100, maxTry: 5 }
  );
</script>

<div
  class="h-10 border border-gray-200 rounded-2xl m-5 flex items-center shadow-md"
>
  <input
    class="w-full h-7 ml-3 mr-1 pl-1 pr-1 focus:outline-none"
    type="text"
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

{#await promise}
  <div class="w-full h-[calc(100vh-7.5rem)] flex justify-center items-center">
    <Spinner />
  </div>
{:then channels}
  {#if channels.length > 0}
    <div class="w-full h-[calc(100vh-7.5rem)] flex flex-col overflow-y-auto">
      {#each channels as item}
        <ChannelItem {item} />
      {/each}
    </div>
  {:else}
    <div class="w-full h-[calc(100vh-7.5rem)] flex justify-center items-center">
      <div class="text-center">
        <div class="mb-2 text-xl font-bold">
          <span>오픈 채팅이 없어요!</span>
        </div>
      </div>
    </div>
  {/if}
{:catch error}
  {console.log(error)}
  <div class="w-full h-[calc(100vh-2.5rem)] flex justify-center items-center">
    <span>{error}</span>
  </div>
{/await}
