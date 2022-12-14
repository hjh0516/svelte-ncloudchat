<script lang="ts">
  import type { Channel, Subscription } from "$lib/types/type";

  import Spinner from "$components/Spinner.svelte";
  import ChatExitModal from "./ChatExitModal.svelte";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { slide } from "svelte/transition";
  import {
    apiCreateChatBans,
    apiDeleteChannel,
    apiDeleteChannelNotification,
    apiDeleteChatBans,
    apiGetChannel,
    apiUnsubscribe,
    apiUpdateChannelNotification,
  } from "$lib/api";
  import { store } from "$store/store";
  import { sendMessage, unsubscribe } from "$lib/NcloudChat";
  import ChannelShareModal from "./ChannelShareModal.svelte";

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  export let channel_id: string;
  export let refresh: boolean;

  let channel: Channel;
  let showChatExitModal = false;
  let showChannelShareModal = false;
  let channelNotification: boolean;
  let leader: Subscription;
  let loading = false;
  let isBack = false;

  function onChangeChannelNotification() {
    channelNotification = !channelNotification;
    try {
      apiUpdateChannelNotification(channel_id, channelNotification);
    } catch (err) {
      console.error(err);
    }
  }

  async function exitChannel() {
    loading = true;

    const content = `${$store.user.name}님이 퇴장했어요.`;
    try {
      await apiUnsubscribe(channel_id);
      apiDeleteChannelNotification(channel_id);

      if (channel.user_idx === Number($store.user.id)) {
        apiDeleteChannel(channel_id);
      }
    } catch (err) {
      console.error(err);
    }

    try {
      const message = JSON.stringify({
        user_idx: $store.user.id,
        type: "system",
        content: content,
      });

      sendMessage(channel_id, "text", message);
      unsubscribe(channel_id);
    } catch (err) {
      console.error(err);
    }

    loading = false;

    location.href = "/#/home";
    gohome();
  }

  function ban(target: number) {
    try {
      apiCreateChatBans(channel_id, target);
      refresh = true;
    } catch (err) {
      console.error(err);
    }
  }

  function unban(target: number) {
    try {
      apiDeleteChatBans(channel_id, target);
      refresh = true;
    } catch (err) {
      console.error(err);
    }
  }

  function back() {
    isBack = true;
    close();
  }

  onMount(async () => {
    history.pushState(null, "", location.href);
    window.addEventListener("popstate", back);

    channel = await apiGetChannel(channel_id);
    channelNotification = channel.notification;
    leader = channel.subscriptions.find((v) => v.user_idx === channel.user_idx);
  });

  onDestroy(() => {
    window.removeEventListener("popstate", back);
    if (!isBack) {
      history.back();
    }
  });
</script>

<div class="c_mbg block" on:click={close} />
<div
  id="chatRoomSetting"
  class="chat_setting chat_pop"
  transition:slide={{ delay: 100, duration: 300 }}
>
  <div class="pop_inner">
    <div class="pop_title">
      <h3 class="aggro">채팅방 설정</h3>
    </div>
    <div class="pop_cont">
      <form>
        <div class="setting_list">
          <ul>
            <li class="st1 st1_1">
              <div class="wrap clear">
                <h4>채팅방 알람</h4>
                <div class="check_box check_box1">
                  <input
                    id="channel_notification"
                    type="checkbox"
                    bind:checked={channelNotification}
                    on:click={onChangeChannelNotification}
                  />
                  <label for="channel_notification" class="aggro">
                    {channelNotification ? "ON" : "OFF"}
                  </label>
                </div>
              </div>
            </li>
            <li class="st2">
              <div class="wrap clear">
                <div class="top">
                  <h4>대화상대</h4>
                  {#if channel}
                    {#if channel.user_idx === Number($store.user.id)}
                      <a
                        class="cBtn3"
                        on:click={() => {
                          close();
                          setTimeout(() => {
                            location.href = `/#/exit/${channel_id}`;
                          }, 500);
                        }}
                      >
                        내보내기 해제
                      </a>
                    {/if}
                  {/if}
                </div>
                <div class="chat_list2 scroll scrollbar-hide">
                  <ul>
                    <li>
                      <div
                        class="box my_info {channel &&
                        channel.user_idx === Number($store.user.id)
                          ? 'r_leader2'
                          : ''}"
                      >
                        <div class="info_w">
                          <div
                            class="c_avata back_img"
                            style="background-image:url({$store.user.profile});"
                          >
                            <img
                              src="../img/img_basic2.png"
                              class="basic_img"
                              alt="profile_image"
                            />
                          </div>
                          <div class="txt_box">
                            <div class="tb">
                              <div class="tbc">
                                <strong class="aggro">
                                  {$store.user.name}
                                </strong>
                              </div>
                            </div>
                          </div>
                        </div>
                        <span class="a_state">나</span>
                      </div>
                    </li>
                    {#if leader}
                      {#if leader.user_idx !== Number($store.user.id)}
                        <li>
                          <div class="box r_leader2">
                            <div class="info_w">
                              <div
                                class="c_avata back_img"
                                style="background-image:url({leader.profile});"
                              >
                                <img
                                  src="../img/img_basic2.png"
                                  class="basic_img"
                                  alt="profile_image"
                                />
                              </div>
                              <div class="txt_box">
                                <div class="tb">
                                  <div class="tbc">
                                    <strong class="aggro">
                                      {leader.nickname}
                                    </strong>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      {/if}
                    {/if}
                    {#if channel}
                      {#each channel.subscriptions as item}
                        {#if item.user_idx !== Number($store.user.id) && item.user_idx !== channel.user_idx}
                          <li>
                            {#if item.is_ban}
                              <div class="box blocked">
                                <div class="info_w">
                                  <div
                                    class="c_avata back_img"
                                    style="background-image:url({item.profile});"
                                  >
                                    <img
                                      src="../img/img_basic2.png"
                                      class="basic_img"
                                      alt="profile_image"
                                    />
                                  </div>
                                  <div class="txt_box">
                                    <div class="tb">
                                      <div class="tbc">
                                        <strong class="aggro">
                                          {item.nickname}
                                        </strong>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <span
                                  class="a_state"
                                  on:click={() => {
                                    item.is_ban = false;
                                    unban(item.user_idx);
                                  }}>차단중</span
                                >
                              </div>
                            {:else}
                              <div class="box">
                                <div class="info_w">
                                  <div
                                    class="c_avata back_img"
                                    style="background-image:url({item.profile});"
                                  >
                                    <img
                                      src="../img/img_basic2.png"
                                      class="basic_img"
                                      alt="profile_image"
                                    />
                                  </div>
                                  <div class="txt_box">
                                    <div class="tb">
                                      <div class="tbc">
                                        <strong class="aggro">
                                          {item.nickname}
                                        </strong>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <span
                                  class="a_state"
                                  on:click={() => {
                                    item.is_ban = true;
                                    ban(item.user_idx);
                                  }}>차단하기</span
                                >
                              </div>
                            {/if}
                          </li>
                        {/if}
                      {/each}
                    {/if}
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div class="btn_area">
          <div class="in_rrec">
            <input
              type="button"
              value="채팅방 나가기"
              class="cBtn bgr"
              on:click={() => (showChatExitModal = true)}
            />
            <div
              id="btnShare"
              class="cBtn cre svg yel"
              on:click={() => (showChannelShareModal = true)}
            >
              공유
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

{#if showChatExitModal}
  <ChatExitModal
    independ={false}
    on:submit={exitChannel}
    on:close={() => (showChatExitModal = false)}
  />
{/if}

{#if showChannelShareModal}
  <ChannelShareModal on:close={() => (showChannelShareModal = false)} />
{/if}

{#if loading}
  <div
    class="fixed top-0 left-0 w-full h-full bg-gray-400 bg-opacity-10"
    style="z-index: 200;"
  >
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Spinner />
    </div>
  </div>
{/if}
