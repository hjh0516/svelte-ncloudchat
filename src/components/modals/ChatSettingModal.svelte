<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { store } from "$store/store";
  import { apiGetChannel, apiUpdateChannelNotification } from "$lib/api";
  import ChatOutModal from "$components/modals/ChatOutModal.svelte";
  import OnOffButton from "$components/buttons/OnOffButton.svelte";

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  export let channelId: string;

  let showOutModal = false;
  let subscriptions = [];
  let channelNotification: boolean;

  async function onChangeChannelNotification() {
    channelNotification = !channelNotification;
    try {
      await apiUpdateChannelNotification(channelId, channelNotification);
    } catch (err) {
      console.error(err);
    }
  }

  function closeOutModal() {
    showOutModal = false;
  }

  onMount(async () => {
    try {
      const res = await apiGetChannel(channelId);
      subscriptions = res.subscriptions;
      channelNotification = res.notification;
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
  class="w-full h-[36.5rem] fixed bottom-0 left-0 p-3 rounded-t-2xl text-center bg-white"
>
  <div class="w-full h-[0.4rem] flex justify-center mb-3">
    <div class="w-14 h-[0.4rem] bg-gray-200 rounded-2xl" />
  </div>
  <div class="p-5">
    <div class="w-full flex flex-col justify-center items-center">
      <span
        class="font-recipekorea text-lg mb-5 underline underline-offset-0 decoration-8 decoration-yellow-300"
        >채팅방 설정</span
      >
      <div class="w-full h-16 border-b flex justify-between items-center">
        <span class="font-semibold text-base">채팅방 알람</span>
        <OnOffButton
          id="channel-notification"
          checked={channelNotification}
          on:change={onChangeChannelNotification}
        />
      </div>
      <span class="w-full font-semibold text-base text-left mt-5"
        >대화 상대</span
      >
      <div
        class="w-full h-72 mt-3 flex flex-col items-center overflow-y-auto scrollbar-hide"
      >
        <div
          class="w-full h-20 p-3 border-2 border-yellow-300 flex items-center rounded-lg shadow-md"
        >
          <img
            class="w-12 h-12 border border-gray-200 rounded-full"
            src={$store.user.profile}
            alt="profile_image"
          />
          <span class="w-full ml-5 mt-1 text-left font-sbaggrom text-base"
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
              <span class="w-full ml-5 mt-1 text-left font-sbaggrom text-base"
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
        class="w-full h-14 rounded-xl bg-gray-700 text-white"
        on:click={() => (showOutModal = true)}>채팅방 나가기</button
      >
    </div>
  </div>

  {#if showOutModal}
    <ChatOutModal {channelId} on:close={closeOutModal} />
  {/if}
</div>
