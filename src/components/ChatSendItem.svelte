<script lang="ts">
  import type { Chat } from "$lib/types/type";

  import { convertSendAt } from "$lib/Date";

  export let item: Chat;
</script>

<div class="flex pt-1 justify-end">
  <div class="flex flex-col">
    <div class="bg-cyan-500 pt-1 pb-2 pl-3 pr-3 rounded-t-xl rounded-l-xl">
      <span class="text-gray-50 text-sm">{item.message}</span>
    </div>
    {#if item.show_date}
      <span class="text-gray-400 text-xs mt-1 mb-3 text-right">
        {convertSendAt(item.created_at)}
      </span>
    {/if}
  </div>
</div>
