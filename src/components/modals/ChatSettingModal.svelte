<script lang="ts">
  import type { Channel } from "$lib/types/type";

  import ChatOutModal from "$components/modals/ChatExitModal.svelte";
  import ChannelShareModal from "./ChannelShareModal.svelte";
  import { createEventDispatcher, onMount } from "svelte";
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
  import { unsubscribe } from "$lib/NcloudChat";

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  export let channel: Channel;
  export let refresh: boolean;

  let showChatExitModal = false;
  let showChannelShareModal = false;
  let channelNotification: boolean;

  function onChangeChannelNotification() {
    channelNotification = !channelNotification;
    try {
      apiUpdateChannelNotification(channel.channel_id, channelNotification);
    } catch (err) {
      console.error(err);
    }
  }

  async function exitChannel() {
    try {
      await apiUnsubscribe(channel.channel_id);
      apiDeleteChannelNotification(channel.channel_id);
      const res = await apiGetChannel(channel.channel_id);
      if (res.subscriptions_count === 0) {
        apiDeleteChannel(channel.channel_id);
      }
    } catch (err) {
      console.error(err);
    }

    try {
      unsubscribe(channel.channel_id);
    } catch (err) {
      console.error(err);
    }
    location.href = "/#/home";
    gohome();
  }

  function ban(target: number) {
    try {
      apiCreateChatBans(channel.channel_id, target);
      refresh = true;
    } catch (err) {
      console.error(err);
    }
  }

  function unban(target: number) {
    try {
      apiDeleteChatBans(channel.channel_id, target);
      refresh = true;
    } catch (err) {
      console.error(err);
    }
  }

  onMount(() => {
    channelNotification = channel.notification;
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
                <h4>대화상대</h4>
                <div class="chat_list2 scroll scrollbar-hide">
                  <ul>
                    <li>
                      <div
                        class="box my_info {channel.user_idx ===
                        Number($store.user.id)
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
                    {#each channel.subscriptions as item}
                      {#if item.user_idx !== Number($store.user.id)}
                        <li>
                          {#if item.user_idx === channel.user_idx}
                            <div class="box r_leader2">
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
                            </div>
                          {:else if item.is_ban}
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
  <ChatOutModal
    on:submit={exitChannel}
    on:close={() => (showChatExitModal = false)}
  />
{/if}

{#if showChannelShareModal}
  <ChannelShareModal on:close={() => (showChannelShareModal = false)} />
{/if}
