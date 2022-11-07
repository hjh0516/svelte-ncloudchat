<script lang="ts">
  import OnOffButton from "$components/buttons/OnOffButton.svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import { store } from "$store/store";
  import {
    apiDeleteChannelBans,
    apiGetChannelBans,
    apiUpdateChatNotification,
    apiUpdateUseChat,
  } from "$lib/api";
  import ChannelUserItem from "$components/ChannelUserItem.svelte";

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  let bans = [];
  let useChat: boolean;
  let chatNotification: boolean;

  function onChangeUseChat() {
    useChat = !useChat;

    try {
      apiUpdateUseChat(useChat);
    } catch (err) {
      console.error(err);
    }

    $store.user.use_chat = useChat;
  }

  function onChangeChatNotificaiton() {
    chatNotification = !chatNotification;

    try {
      apiUpdateChatNotification(chatNotification);
    } catch (err) {
      console.error(err);
    }

    $store.user.chat_notification = chatNotification;
  }

  function unban(target: number) {
    bans = bans.filter((x) => x.target !== target);

    try {
      apiDeleteChannelBans(target);
    } catch (err) {
      console.error(err);
    }
  }

  onMount(async () => {
    useChat = $store.user.use_chat;
    chatNotification = $store.user.chat_notification;

    try {
      bans = await apiGetChannelBans();
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
  class="w-full h-[35rem] fixed bottom-0 left-0 rounded-t-3xl text-center bg-white"
>
  <div class="w-full h-[0.4rem] flex justify-center mb-3 pt-3">
    <div class="w-14 h-[0.4rem] bg-gray-200 rounded-2xl" />
  </div>
  <div class="p-5">
    <div class="w-full flex flex-col justify-center items-center">
      <span
        class="font-recipekorea text-lg mb-5 underline underline-offset-0 decoration-8 decoration-yellow-300"
        >채팅 설정</span
      >
      <div
        class="w-full h-16 pr-3 pl-3 border-b flex justify-between items-center"
      >
        <span class="font-semibold text-base">채팅 사용 설정</span>
        <OnOffButton
          id="use-chat"
          checked={useChat}
          on:change={onChangeUseChat}
        />
      </div>
      <div
        class="w-full h-16 pr-3 pl-3 border-b flex justify-between items-center"
      >
        <span class="font-semibold text-base">채팅 알람 관리</span>
        <OnOffButton
          id="chat-notification"
          checked={chatNotification}
          on:change={onChangeChatNotificaiton}
        />
      </div>
      <span class="w-full pr-3 pl-3 font-semibold text-base text-left mt-5"
        >채팅 차단 관리</span
      >
      <div class="w-full h-52 mb-5 pr-3 pl-3 overflow-y-auto scrollbar-hide">
        {#each bans as item}
          <ChannelUserItem {item} {unban} />
        {/each}
      </div>
    </div>
    <button
      class="w-11/12 h-14 rounded-xl bg-gray-700 text-white text-base"
      on:click={close}>완료</button
    >
  </div>
</div>
