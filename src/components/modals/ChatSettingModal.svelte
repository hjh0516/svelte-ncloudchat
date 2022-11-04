<script lang="ts">
  import ChatOutModal from "$components/modals/ChatExitModal.svelte";
  import OnOffButton from "$components/buttons/OnOffButton.svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import {
    apiCreateChatBans,
    apiDeleteChannelNotification,
    apiDeleteChatBans,
    apiGetChannel,
    apiUnsubscribe,
    apiUpdateChannelNotification,
  } from "$lib/api";
  import { store } from "$store/store";
  import { unsubscribe } from "$lib/NcloudChat";

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  export let channelId: string;

  let showOutModal = false;
  let subscriptions = [];
  let channelNotification: boolean;

  function onChangeChannelNotification() {
    channelNotification = !channelNotification;
    try {
      apiUpdateChannelNotification(channelId, channelNotification);
    } catch (err) {
      console.error(err);
    }
  }

  function exitChannel() {
    try {
      apiUnsubscribe(channelId);
      unsubscribe(channelId);
      apiDeleteChannelNotification(channelId);
    } catch (err) {
      console.error(err);
    }
    location.href = "/#/home";
  }

  function ban(target: number) {
    try {
      apiCreateChatBans(channelId, target);
    } catch (err) {
      console.error(err);
    }
  }

  function unban(target: number) {
    try {
      apiDeleteChatBans(channelId, target);
    } catch (err) {
      console.error(err);
    }
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
  class="w-full h-full fixed top-0 left-0 bg-gray-500 bg-opacity-25 z-10"
  on:click={close}
/>
<div
  class="w-full h-[35.5rem] fixed bottom-0 left-0 rounded-t-2xl text-center bg-white z-20"
>
  <div class="w-full h-[0.4rem] flex justify-center mb-3 pt-3">
    <div class="w-14 h-[0.4rem] bg-gray-200 rounded-2xl" />
  </div>
  <div class="p-5">
    <div class="w-full flex flex-col justify-center items-center">
      <span
        class="font-recipekorea text-lg mb-5 underline underline-offset-0 decoration-8 decoration-yellow-300"
        >채팅방 설정</span
      >
      <div
        class="w-full h-16 pl-3 pr-3 border-b flex justify-between items-center"
      >
        <span class="font-semibold text-base">채팅방 알람</span>
        <OnOffButton
          id="channel-notification"
          checked={channelNotification}
          on:change={onChangeChannelNotification}
        />
      </div>
      <span class="w-full pl-3 pr-3 font-semibold text-base text-left mt-5"
        >대화 상대</span
      >
      <div
        class="w-full h-72 mt-3 flex flex-col items-center overflow-y-auto scrollbar-hide"
      >
        <div class="w-full h-auto pl-3 pr-3">
          <div
            class="w-full h-auto p-3 border border-yellow-400 flex items-center rounded-3xl shadow-md"
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
        </div>
        <div class="w-full h-52 mb-5 pl-3 pr-3 overflow-y-auto scrollbar-hide">
          {#each subscriptions as item}
            {#if item.user_idx !== $store.user.id}
              <div
                class="w-full h-auto p-3 mt-3 border border-gray-100 flex items-center rounded-3xl shadow-md"
              >
                <img
                  class="w-12 h-12 border border-gray-200 rounded-full"
                  src={item.profile}
                  alt="profile_image"
                />
                <span class="w-full ml-5 mt-1 text-left font-sbaggrom text-base"
                  >{item.nickname}</span
                >
                {#if item.is_ban}
                  <span
                    class="w-12 mr-5 text-right text-base font-semibold text-gray-400"
                    on:click={() => {
                      item.is_ban = 0;
                      unban(item.user_idx);
                    }}>해제</span
                  >
                {:else}
                  <span
                    class="w-12 mr-5 text-right text-base font-semibold text-gray-400"
                    on:click={() => {
                      item.is_ban = 1;
                      ban(item.user_idx);
                    }}>차단</span
                  >
                {/if}
              </div>
            {/if}
          {/each}
        </div>
      </div>
      <button
        class="w-11/12 h-14 rounded-xl bg-gray-700 text-white text-base"
        on:click={() => (showOutModal = true)}>채팅방 나가기</button
      >
    </div>
  </div>

  {#if showOutModal}
    <ChatOutModal
      on:submit={exitChannel}
      on:close={() => (showOutModal = false)}
    />
  {/if}
</div>
