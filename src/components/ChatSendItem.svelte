<script lang="ts">
  import type { Chat } from "$lib/types/type";

  import Image from "$components/ChatImageItem.svelte";
  import { convertSendAt } from "$lib/Date";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let item: Chat;

  function open(item: Chat) {
    dispatch("open", { item: item });
  }
</script>

<!-- <div class="flex flex-col pt-1 items-end">
  <div class="flex items-end">
    {#if item.is_read}
      <span class="text-cyan-500 text-xs mr-1">읽음</span>
    {/if}
    {#if item.type === "text"}
      <div
        class="max-w-[calc(100vw-10rem)] bg-cyan-500 pt-1 pb-2 pl-3 pr-3 rounded-t-xl rounded-l-xl justify-end"
      >
        <span class="break-words text-gray-50 text-sm">{item.message}</span>
      </div>
    {:else if item.type === "file"}
      <div class="max-w-[8rem] h-auto" on:click={() => open(item)}>
        <Image src={item.image_url} className={"rounded-t-lg rounded-l-lg"} />
      </div>
    {/if}
  </div>
  {#if item.show_date}
    <span class="text-gray-400 text-xs mt-1 mb-3">
      {convertSendAt(item.created_at)}
    </span>
  {/if}
</div> -->

<div class="request">
  <dl>
    <dd class="cont">
      {#if item.type === "text"}
        {item.message}
      {:else if item.type === "file"}
        <div class="chat_img" on:click={() => open(item)}>
          <Image src={item.image_url} className={"bg-white"} />
        </div>
      {/if}
    </dd>
    {#if item.show_date}
      <dd class="rciv_time mb-3">{convertSendAt(item.created_at)}</dd>
    {/if}
  </dl>
</div>
