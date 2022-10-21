<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { store } from "$store/store";
  import { apiGetChannel } from "$lib/api";
  import ChatOutModal from "$components/modals/ChatOutModal.svelte";

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  export let channel_id: string;

  let showOutModal = false;
  let subscriptions = [];

  function closeOutModal() {
    showOutModal = false;
  }

  onMount(async () => {
    try {
      const res = await apiGetChannel(channel_id);
      subscriptions = res.subscriptions;
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
  class="w-full h-[31rem] fixed bottom-0 left-0 p-2 rounded-2xl mx-auto text-center bg-white"
>
  <div class="w-full h-[0.4rem] flex justify-center mb-3">
    <div class="w-14 h-[0.4rem] bg-gray-200 rounded-2xl" />
  </div>
  <div class="p-5">
    <div class="w-full flex flex-col justify-center items-center">
      <span class="font-semibold text-xl mb-5">채팅방 설정</span>
      <span class="w-full font-semibold text-base text-left">대화 상대</span>
      <div
        class="w-full h-72 mt-3 flex flex-col items-center overflow-y-auto scrollbar-hide"
      >
        <div
          class="w-full h-20 p-3 border-2 border-orange-200 flex items-center rounded-lg shadow-md"
        >
          <img
            class="w-12 h-12 border border-gray-200 rounded-full"
            src={$store.user.profile}
            alt="profile_image"
          />
          <span class="w-full ml-5 text-left font-semibold"
            >{$store.user.name}</span
          >
          <span
            class="w-12 mr-5 text-right text-base font-semibold text-gray-400"
            >나</span
          >
        </div>
        {#each subscriptions as item}
          {#if item.user_idx !== $store.user.id}
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
                >차단</span
              >
            </div>
          {/if}
        {/each}
      </div>
      <button
        class="w-full h-14 rounded-xl bg-gray-500 text-white"
        on:click={() => (showOutModal = true)}>채팅방 나가기</button
      >
    </div>
  </div>

  {#if showOutModal}
    <ChatOutModal {channel_id} on:close={closeOutModal} />
  {/if}
</div>
