<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { store } from "$store/store";
  import {
    apiDeleteChannelBans,
    apiGetChannelBans,
    apiUpdateChatNotification,
    apiUpdateUseChat,
  } from "$lib/api";

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  let bans = [];
  let useChat: boolean;
  let chatNotification: boolean;
  let isBack = false;

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

  function back() {
    isBack = true;
    close();
  }

  onMount(async () => {
    useChat = $store.user.use_chat;
    chatNotification = $store.user.chat_notification;

    try {
      bans = await apiGetChannelBans();
    } catch (err) {
      console.error(err);
    }

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

<div class="c_mbg block" on:click={close} />
<div
  id="chatListSetting"
  class="chat_setting chat_pop bottom-0"
  transition:slide={{ delay: 100, duration: 300 }}
>
  <div class="pop_inner">
    <div class="pop_title">
      <h3 class="aggro">채팅 설정</h3>
    </div>
    <div class="pop_cont">
      <form>
        <div class="setting_list">
          <ul>
            <li class="st1">
              <div class="wrap clear">
                <h4>채팅 사용 설정</h4>
                <div class="check_box check_box1">
                  <input
                    id="use_chat"
                    type="checkbox"
                    bind:checked={useChat}
                    on:click={onChangeUseChat}
                  />
                  <label for="use_chat" class="aggro">
                    {useChat ? "ON" : "OFF"}
                  </label>
                </div>
              </div>
            </li>
            <li class="st1 st1_1">
              <div class="wrap clear">
                <h4>채팅 알람 관리</h4>
                <div class="check_box check_box1">
                  <input
                    id="chat_notification"
                    type="checkbox"
                    bind:checked={chatNotification}
                    on:click={onChangeChatNotificaiton}
                  />
                  <label for="chat_notification" class="aggro">
                    {chatNotification ? "ON" : "OFF"}
                  </label>
                </div>
              </div>
            </li>
            <li class="st2">
              <div class="wrap clear">
                <h4>채팅 차단 관리</h4>
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
                    {#each bans as item}
                      <li>
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
                                  <strong class="aggro">{item.nickname}</strong>
                                </div>
                              </div>
                            </div>
                          </div>
                          <span
                            class="a_state"
                            on:click={() => unban(item.target)}>차단중</span
                          >
                        </div>
                      </li>
                    {/each}
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="btn_area">
          <input type="button" value="완료" class="cBtn" on:click={close} />
        </div>
      </form>
    </div>
  </div>
</div>
