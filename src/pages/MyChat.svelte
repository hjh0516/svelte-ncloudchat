<script lang="ts">
  import { retryAsync } from "ts-retry";
  import ChannelItem from "../components/ChannelItem.svelte";
  import FloatingActionButton from "../components/FloatingActionButton.svelte";
  import { getChannels } from "../lib/NcloudChat";

  let promise = retryAsync(
    async () => {
      return await getChannels(0, 20);
    },
    { delay: 100, maxTry: 5 }
  );
</script>

{#await promise}
  <div class="w-full h-[calc(100vh-2.5rem)] flex justify-center items-center">
    <div class="text-lg font-medium">채팅 리스트를 불러오는 중...</div>
  </div>
{:then channels}
  {#if channels}
    <div class="w-full h-[calc(100vh-2.5rem)] flex flex-col overflow-y-auto">
      {#each channels as channel}
        <ChannelItem {channel} />
      {/each}
    </div>
  {:else}
    <div class="w-full h-[calc(100vh-2.5rem)] flex justify-center items-center">
      <div class="text-center">
        <div class="mb-2 text-lg font-medium">
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
