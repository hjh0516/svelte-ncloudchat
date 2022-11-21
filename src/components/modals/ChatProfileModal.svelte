<script lang="ts">
  import type { Channel, Chat } from "$lib/types/type";

  import {
    apiCreateChatBans,
    apiCreateMessage,
    apiDeleteChatBans,
    apiDeleteUserSubscription,
  } from "$lib/api";
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import { getNotificationsContext } from "svelte-notifications";
  import { store } from "$store/store";
  import { sendMessage } from "$lib/NcloudChat";

  export let channel: Channel;
  export let item: Chat;
  export let refresh = false;

  let is_ban = false;

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");
  const { addNotification, clearNotifications } = getNotificationsContext();

  function ban(target: number) {
    is_ban = true;
    try {
      apiCreateChatBans(channel.channel_id, target);
      refresh = true;
    } catch (err) {
      console.error(err);
    }
  }

  function unban(target: number) {
    is_ban = false;
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
      const message = `${item.nickname}님을 내보냈어요.`;
      sendMessage(channel.channel_id, `system_${target}`, message);
      apiCreateMessage(channel.channel_id, "system", message);
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
        <div class="c_wrap">
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
        {#if channel.user_idx === Number($store.user.id)}
          <div class="btn_area in_2">
            {#if is_ban}
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
            {#if is_ban}
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
      </div>
    </div>
  </div>
</div>
