<script lang="ts">
  import type { Chat } from "$lib/types/type";

  import { convertSendAt } from "$lib/Date";

  export let item: Chat;

  let imageSrc = item.image_url ? item.image_url : "default.jpg";
  function handleImageError() {
    imageSrc = "default.jpg";
  }
</script>

<div class="flex flex-col pt-1 items-end">
  <div class="flex items-end">
    <!-- {#if item.is_read}
      <span class="text-cyan-500 text-xs mr-1">읽음</span>
    {/if} -->
    {#if item.type === "text"}
      <div
        class="max-w-[calc(100vw-10rem)] bg-cyan-500 pt-1 pb-2 pl-3 pr-3 rounded-t-xl rounded-l-xl justify-end"
      >
        <span class="break-words text-gray-50 text-sm">{item.message}</span>
      </div>
    {:else if item.type === "file"}
      <div class="w-32 h-auto border border-cyan-500 rounded-t-lg rounded-l-lg">
        <img
          src={imageSrc}
          alt="image_url"
          class="rounded-t-lg rounded-l-lg"
          on:error={handleImageError}
        />
      </div>
    {/if}
  </div>
  {#if item.show_date}
    <span class="text-gray-400 text-xs mt-1 mb-3">
      {convertSendAt(item.created_at)}
    </span>
  {/if}
</div>
