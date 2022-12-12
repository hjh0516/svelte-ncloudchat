<script lang="ts">
  import type { Channel, Chat } from "$lib/types/type";

  import {
    apiCreateChatBans,
    apiDeleteChatBans,
    apiDeleteUserSubscription,
  } from "$lib/api";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { getNotificationsContext } from "svelte-notifications";
  import { store } from "$store/store";
  import { sendMessage } from "$lib/NcloudChat";

  export let channel: Channel;
  export let item: Chat;
  export let refresh = false;

  let isBan = false;
  let isBack = false;

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");
  const { addNotification, clearNotifications } = getNotificationsContext();

  function ban(target: number) {
    isBan = true;
    try {
      apiCreateChatBans(channel.channel_id, target);
      refresh = true;
    } catch (err) {
      console.error(err);
    }
  }

  function unban(target: number) {
    isBan = false;
    try {
      apiDeleteChatBans(channel.channel_id, target);
      refresh = true;
    } catch (err) {
      console.error(err);
    }
  }

  async function forcedExit(target: number) {
    try {
      await apiDeleteUserSubscription(channel.channel_id, target);

      const message = JSON.stringify({
        user_idx: $store.user.id,
        type: "system",
        content: `${item.nickname}님이 내보내졌어요.`,
        target: target,
      });

      sendMessage(channel.channel_id, "text", message);
      close();
    } catch (err) {
      clearNotifications();
      addNotification({
        text: "이미 내보낸 사용자에요.",
        position: "bottom-center",
        removeAfter: 1500,
      });
      console.error(err);
    }
  }

  function back() {
    isBack = true;
    close();
  }

  onMount(() => {
    history.pushState(null, "", location.href);
    window.addEventListener("popstate", back);
  });

  onDestroy(() => {
    window.removeEventListener("popstate", back);
    if (!isBack) {
      history.back();
    }
  });
</script>

<div
  id="userInfo2"
  class="profile_pop"
  transition:slide={{ delay: 100, duration: 300 }}
>
  <div class="pop_cont">
    <div class="tb">
      <div class="tbc">
        <div id="close" class="svg btn_close bl" on:click={close}>닫기</div>
        <div
          class="c_wrap {channel &&
          channel.type !== 'PRIVATE' &&
          item.user_idx === channel.user_idx
            ? 'r_leader3'
            : ''}"
        >
          <div
            class="c_avata back_img"
            style="background-image:url({item.profile});"
          >
            <img
              src="../img/img_basic6.png"
              class="basic_img"
              alt="profile_image"
            />
          </div>
          <div class="user_name">
            <em class="aggro">{item.nickname}</em>
          </div>
        </div>
        {#if channel.type !== "PRIVATE"}
          {#if channel.user_idx === Number($store.user.id)}
            <div class="btn_area in_2">
              {#if isBan}
                <div
                  id="blockPause"
                  class="cBtn2 lined aggro"
                  on:click={() => unban(item.user_idx)}
                >
                  <span>차단해제</span>
                </div>
              {:else}
                <div
                  id="btnBlock"
                  class="cBtn2 aggro"
                  on:click={() => ban(item.user_idx)}
                >
                  <span>차단하기</span>
                </div>
              {/if}
              <div
                id="blockPause"
                class="cBtn2 gr aggro"
                on:click={() => forcedExit(item.user_idx)}
              >
                <span>내보내기</span>
              </div>
            </div>
          {:else if channel.user_idx !== item.user_idx}
            <div class="btn_area">
              {#if isBan}
                <div
                  id="blockPause"
                  class="cBtn2 lined aggro"
                  on:click={() => unban(item.user_idx)}
                >
                  <span>차단해제</span>
                </div>
              {:else}
                <div
                  id="btnBlock"
                  class="cBtn2 aggro"
                  on:click={() => ban(item.user_idx)}
                >
                  <span>차단하기</span>
                </div>
              {/if}
            </div>
          {/if}
        {/if}
      </div>
    </div>
  </div>
</div>
