<script lang="ts">
  import { user } from "../store/store";
  import { retryAsync } from "ts-retry";
  import ChannelItem from "../components/ChannelItem.svelte";
  import FloatingActionButton from "../components/FloatingActionButton.svelte";
  import { getChannel, getSubscriptions } from "../lib/NcloudChat";
  import type { MemberType } from "src/lib/types/MemberType";

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

      let channels = [];
      for (let subscription of subscriptions) {
        channels = [...channels, await getChannel(subscription.channel_id)];
      }
      return channels;
    },
    { delay: 100, maxTry: 5 }
  );
</script>

{#await promise}
  <div class="w-full h-[calc(100vh-2.5rem)] flex justify-center items-center">
    <div class="text-xl font-bold">채팅 리스트를 불러오는 중...</div>
  </div>
{:then channels}
  {#if channels.length > 0}
    <div class="w-full h-[calc(100vh-2.5rem)] flex flex-col overflow-y-auto">
      {#each channels as channel}
        <ChannelItem {channel} />
      {/each}
    </div>
  {:else}
    <div class="w-full h-[calc(100vh-2.5rem)] flex justify-center items-center">
      <div class="text-center">
        <div class="mb-2 text-xl font-bold">
          <span>참여중인 채팅이 없어요!</span>
        </div>
        <div class="text-gray-400">
          <span>오른쪽 하단의 채팅하기 아이콘을 누르면</span>
        </div>
        <div class="text-gray-400">
          <span>직접 만들 수 있어요.</span>
        </div>
      </div>
    </div>
  {/if}
{:catch error}
  <div class="w-full h-[calc(100vh-2.5rem)] flex justify-center items-center">
    <span>{error}</span>
  </div>
{/await}
<FloatingActionButton />
