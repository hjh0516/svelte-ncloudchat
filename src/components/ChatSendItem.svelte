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
    <dd class="cont">
      {#if item.type === "text"}
        {item.message}
      {:else if item.type === "file"}
        <div class="chat_img max-w-xs" on:click={() => open(item)}>
          <Image src={item.image_url} className={"bg-white"} />
        </div>
      {/if}
    </dd>
    {#if item.show_date}
      <dd class="rciv_time mb-3">{convertSendAt(item.created_at)}</dd>
    {/if}
  </dl>
</div>
