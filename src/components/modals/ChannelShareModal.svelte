<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import { getNotificationsContext } from "svelte-notifications";

  export let channel_id: string;

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");
  const { addNotification, clearNotifications } = getNotificationsContext();

  function invite() {
    location.href = `/#/invite/${channel_id}`;
  }

  function link() {
    const API_URL = import.meta.env.VITE_API_URL;
    const url = `${API_URL}/sharelink?type=chat&channel_id=${channel_id}`;
    if (window.isSecureContext && window.navigator.clipboard) {
      window.navigator.clipboard.writeText(url);
    } else {
      unsecureCopy(url);
    }

    clearNotifications();
    addNotification({
      text: "채팅방 링크가 복사되었어요.",
      position: "bottom-center",
      removeAfter: 1500,
    });

    close();
  }

  function unsecureCopy(text: string) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    const chatShare = document.getElementById("chatShare");
    chatShare.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error(err);
    }
    chatShare.removeChild(textArea);
  }
</script>

<div class="c_mbg block" style="z-index: 150;" on:click={close} />
<div
  id="chatShare"
  class="chat_pop"
  transition:slide={{ delay: 100, duration: 300 }}
>
  <div class="pop_inner">
    <div class="pop_cont">
      <form>
        <div class="btn_area in_2">
          <div>
            <div class="cBtn hgt70" on:click={invite}>
              <div class="tb">
                <div class="tbc">
                  <span class="msg">
                    <img src="../img/ico_message.svg" alt="ico_message" />
                  </span>
                  <em>초대</em>
                </div>
              </div>
            </div>
            <div class="cBtn hgt70" on:click={link}>
              <div class="tb">
                <div class="tbc">
                  <span class="link">
                    <img src="../img/ico_link.svg" alt="ico_link" />
                  </span>
                  <em>링크</em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
