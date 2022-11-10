<script lang="ts">
  import type { Channel } from "$lib/types/type";

  import Spinner from "$components/Spinner.svelte";
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import { store } from "$store/store";
  import { apiCreateChannelNotification, apiSubscribe } from "$lib/api";
  import { getChannel, subscribe } from "$lib/NcloudChat";
  import { convertChannelCreatedAt } from "$lib/Date";

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  export let channel_id: string;
  export let item: Channel;

  let channel: Channel;
  let element: HTMLElement;
  let loading = false;

  async function submit() {
    loading = true;
    addPointerEventNone();

    try {
      apiSubscribe(channel_id);
      apiCreateChannelNotification(channel_id, true);
      channel = await getChannel(channel_id);
    } catch (err) {
      console.error(err);
    }

    try {
      subscribe(channel_id);
    } catch (err) {
      console.error(err);
    }

    loading = false;
    removePointerEventNone();
    close();

    $store.channel = channel;
    window.sessionStorage.setItem("store", JSON.stringify($store));
    location.href = `/#/chat/${channel_id}`;
  }

  function addPointerEventNone() {
    element.classList.add("pointer-events-none");
  }

  function removePointerEventNone() {
    element.classList.remove("pointer-events-none");
  }
</script>

<div
  id="roomInfo"
  class="profile_pop"
  bind:this={element}
  transition:slide={{ delay: 100, duration: 300 }}
>
  <div class="pop_cont">
    <div class="tb">
      <div class="tbbtm">
        <div class="svg btn_close bl" on:click={close}>닫기</div>
        <div class="c_wrap">
          {#if item.image_url}
            <div
              class="c_avata back_img"
              style="background-image:url({item.image_url});"
            >
              <img
                src="../img/img_basic5.png"
                class="basic_img"
                alt="channel_image"
              />
            </div>
          {:else}
            <div
              class="c_avata back_img"
              style="background-image:url('../img/img_chat_avata4_1.png');"
            >
              <img
                src="../img/img_basic5.png"
                class="basic_img"
                alt="channel_image"
              />
            </div>
          {/if}
        </div>
        <div class="room_wrap">
          <div class="tit_box">
            {#if item.type === "FOLLOWER"}
              <span>팔로워만 입장</span>
            {:else}
              <span>전체 입장</span>
            {/if}
            <h4 class="aggro">{item.name}</h4>
          </div>
          <div class="hash_list">
            <ul>
              {#each item.tags as t}
                <li>#{t.tag}</li>
              {/each}
            </ul>
          </div>
          <div class="room_info">
            <div class="r_leader">
              <p
                class="c_avata back_img"
                style="background-image:url({item.profile});"
              >
                <img
                  src="../img/img_basic4.png"
                  class="basic_img"
                  alt="profile_image"
                />
              </p>
              <span class="name">{item.nickname}</span>
            </div>
            <div class="r_etc">
              <p>
                <span>
                  {item.subscriptions_count.toLocaleString()}명 참여중,
                </span>
                <span>{convertChannelCreatedAt(item.created_at)} 개설</span>
              </p>
            </div>
          </div>
        </div>
        <div class="btn_area">
          <div class="in_rrec">
            <div class="cBtn bgr" on:click={submit}>참여하기</div>
            <!-- 참여중 -->
            <!-- <a href="javascript:;" class="cBtn gr3" style="display:none;"
              >참여중</a
            > -->
            <!-- 참여중일시 활성화 -->
            <div id="btnShare" class="cBtn cre svg yel">공유</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {#if loading}
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Spinner />
    </div>
  {/if}
</div>
