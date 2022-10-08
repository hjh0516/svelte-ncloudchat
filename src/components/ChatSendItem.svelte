<script lang="ts">
  import type { Chat } from "$lib/types/type";

  import { convertDate } from "$lib/Date";

  export let item: Chat;
</script>

<div class="flex pt-5 justify-end">
  <div class="flex flex-col">
    <div class="bg-cyan-500 pt-1 pb-2 pl-3 pr-3 rounded-t-xl rounded-l-xl">
      <span class="text-gray-50 text-sm">{item.message}</span>
    </div>
    <span class="text-gray-400 text-xs mt-1 text-right">
      {convertDate(item.created_at)}
    </span>
  </div>
</div>
