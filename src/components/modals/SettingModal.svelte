<script lang="ts">
  import { apiGetChatBans } from "$lib/api";
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  let bans = [];

  onMount(async () => {
    try {
      bans = await apiGetChatBans();
    } catch (err) {
      console.error(err);
    }
  });
</script>

<div
  class="w-full h-full fixed top-0 left-0 bg-gray-500 bg-opacity-25"
  on:click={close}
/>
<div
  class="w-full h-[35rem] fixed bottom-0 left-0 p-10 rounded-2xl mx-auto text-center bg-white"
>
  <div class="w-full flex flex-col justify-center items-center">
    <span class="font-semibold text-xl mb-5">채팅 설정</span>
    <div class="w-full h-16 border-b flex justify-between items-center">
      <span class="font-semibold text-base">채팅 사용 설정</span>
      <div>
        <span>ON</span>
      </div>
    </div>
    <div class="w-full h-16 border-b flex justify-between items-center">
      <span class="font-semibold text-base">채팅 알람 관리</span>
      <div>
        <span>ON</span>
      </div>
    </div>
    <span class="w-full font-semibold text-base text-left mt-5"
      >채팅 차단 관리</span
    >
    <div class="w-full h-52 mb-5 overflow-y-auto scrollbar-hide">
      {#each bans as item}
        <div
          class="w-full h-20 p-3 mt-3 border-2 border-gray-200 flex items-center rounded-lg shadow-md"
        >
          <img
            class="w-12 h-12 border border-gray-200 rounded-full"
            src={item.profile}
            alt="profile_image"
          />
          <span class="w-full ml-5 text-left font-semibold"
            >{item.nickname}</span
          >
          <span
            class="w-12 mr-5 text-right text-base font-semibold text-gray-400"
            >해제</span
          >
        </div>
      {/each}
    </div>
  </div>

  <button class="w-full h-14 rounded-xl bg-gray-500 text-white" on:click={close}
    >완료</button
  >
</div>
