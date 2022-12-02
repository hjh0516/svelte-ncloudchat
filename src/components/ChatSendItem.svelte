<script lang="ts">
  import type { Chat } from "$lib/types/type";

  import ChatImageItem from "$components/ChatImageItem.svelte";
  import { createEventDispatcher } from "svelte";
  import { convertSendAt } from "$lib/Date";

  export let item: Chat;

  const dispatch = createEventDispatcher();
  const VITE_ARCHIVE_URL = import.meta.env.VITE_ARCHIVE_URL;

  function open(item: Chat) {
    dispatch("open", { item: item });
  }

  async function link(message: string) {
    dispatch("link", { message: message });
  }
</script>

<div class="request">
  <dl>
    {#if item.type === "text"}
      <dd class="cont">
        {item.message}
      </dd>
    {:else if item.type === "file"}
      <div
        class="chat_img h-[125px] mt-3 flex justify-center items-center"
        on:click={() => open(item)}
      >
        <ChatImageItem
          src={VITE_ARCHIVE_URL + item.image_url}
          className={"rounded-2xl"}
        />
      </div>
    {/if}
    {#if item.show_date}
      <dd class="rciv_time mb-3">{convertSendAt(item.created_at)}</dd>
    {/if}
  </dl>
</div>
