<script lang="ts">
  import ChatOutModal from "$components/modals/ChatExitModal.svelte";
  import ChatUserItem from "$components/ChatUserItem.svelte";
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
  export let refresh: boolean;

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
      refresh = true;
    } catch (err) {
      console.error(err);
    }
  }

  function unban(target: number) {
    try {
      apiDeleteChatBans(channelId, target);
      refresh = true;
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

<!-- <div
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
            <canvas
              class="w-12 h-12 border border-gray-200 rounded-full"
              bind:this={canvas}
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
              <ChatUserItem {item} {ban} {unban} />
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
</div> -->

<div class="c_mbg" style="display: block;" on:click={close} />
<div id="chatRoomSetting" class="chat_setting chat_pop" style="bottom: 0px;">
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
                <div class="chat_list2 scroll">
                  <ul>
                    <li>
                      <div class="box my_info">
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
                                <strong class="aggro">{$store.user.name}</strong
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                        <span class="a_state">나</span>
                      </div>
                    </li>
                    {#each subscriptions as item}
                      {#if item.user_idx !== $store.user.id}
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
                                      <strong class="aggro"
                                        >{item.nickname}</strong
                                      >
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <span
                                class="a_state"
                                on:click={() => {
                                  item.is_ban = 0;
                                  unban(item.user_idx);
                                }}>차단중</span
                              >
                            </div>
                          {:else}
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
                                      <strong class="aggro"
                                        >{item.nickname}</strong
                                      >
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <span
                                class="a_state"
                                on:click={() => {
                                  item.is_ban = 1;
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
              on:click={() => (showOutModal = true)}
            />
            <div id="btnShare" class="cBtn cre svg yel">공유</div>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

{#if showOutModal}
  <ChatOutModal
    on:submit={exitChannel}
    on:close={() => (showOutModal = false)}
  />
{/if}
