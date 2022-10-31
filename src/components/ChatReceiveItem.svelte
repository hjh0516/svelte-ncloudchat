<script lang="ts">
  import type { Chat } from "$lib/types/type";

  import { convertSendAt } from "$lib/Date";

  export let item: Chat;

  let profileSrc = item.profile ? item.profile : "profile_default.jpeg";
  function handleProfileImageError() {
    profileSrc = "profile_default.jpeg";
  }

  function handleImageError() {
    item.image_url = "default.jpg";
  }
</script>

<div class="flex justify-start">
  <div class="w-10 h-10">
    {#if item.show_profile}
      <img
        class="rounded-full"
        src={profileSrc}
        alt="sender_profile_image"
        on:error={handleProfileImageError}
      />
    {/if}
  </div>
  <div class="flex flex-col ml-3 items-start">
    {#if item.show_nickname}
      <span class="text-sm font-sbaggrom">{item.nickname}</span>
    {/if}
    {#if item.type === "text"}
      <div
        class="max-w-[calc(100vw-10rem)] bg-white border border-gray-200 mt-1 pt-1 pb-2 pl-3 pr-3 rounded-b-xl rounded-r-xl"
      >
        <span class="break-words text-gray-500 text-sm">{item.message}</span>
      </div>
    {:else if item.type === "file"}
      <div
        class="w-32 h-auto p-1 border border-gray-200 rounded-b-lg rounded-r-lg mt-1"
      >
        <img
          src={item.image_url}
          alt="image_url"
          class="rounded-b-lg rounded-r-lg"
          on:error={handleImageError}
        />
      </div>
    {/if}
    {#if item.show_date}
      <span class="text-gray-400 text-xs mt-1 mb-3">
        {convertSendAt(item.created_at)}
      </span>
    {/if}
  </div>
</div>
