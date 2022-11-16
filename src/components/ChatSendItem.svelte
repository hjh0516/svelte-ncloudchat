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

<div class="request">
  <dl>
    {#if item.type === "text"}
      <dd class="cont">
        {item.message}
      </dd>
    {:else if item.type === "file"}
      <div class="chat_img max-w-[20rem] mt-3" on:click={() => open(item)}>
        <Image src={item.image_url} className={"rounded-2xl"} />
      </div>
    {/if}
    {#if item.show_date}
      <dd class="rciv_time mb-3">{convertSendAt(item.created_at)}</dd>
    {/if}
  </dl>
</div>
