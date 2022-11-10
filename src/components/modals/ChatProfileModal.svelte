<script lang="ts">
  import { apiCreateChatBans, apiDeleteChatBans } from "$lib/api";
  import type { Chat } from "$lib/types/type";
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";

  export let channelId: string;
  export let item: Chat;
  export let refresh = false;

  let is_ban = false;

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  function ban(target: number) {
    is_ban = true;
    try {
      apiCreateChatBans(channelId, target);
      refresh = true;
    } catch (err) {
      console.error(err);
    }
  }

  function unban(target: number) {
    is_ban = false;
    try {
      apiDeleteChatBans(channelId, target);
      refresh = true;
    } catch (err) {
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
        <div class="svg btn_close bl" on:click={close}>닫기</div>
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
        <div class="btn_area in_2" style="display:none;">
          <!-- 방장의 경우 -->
          <div id="btnBlock" class="cBtn2 aggro">
            <span>차단하기</span>
          </div>
          <div id="blockPause" class="cBtn2 gr aggro">
            <span>내보내기</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
