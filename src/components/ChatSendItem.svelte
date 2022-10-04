<script lang="ts">
  import { convertDate } from "../lib/Date";
  import type { MessageType } from "../lib/types/MessageType";

  export let message: MessageType;
</script>

<div class="flex pt-5 justify-end">
  <div class="flex flex-col">
    <div class="bg-cyan-500 pt-1 pb-2 pl-3 pr-3 rounded-t-xl rounded-l-xl">
      <span class="text-gray-50 text-sm">{message.content}</span>
    </div>
    <span class="text-gray-400 text-xs mt-1 text-right">
      {convertDate(Number(message.sort_id))}
    </span>
  </div>
</div>
