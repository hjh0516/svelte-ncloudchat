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
    const url = `emo://chat?channel_id=${channel_id}`;
    window.navigator.clipboard.writeText(url);

    clearNotifications();
    addNotification({
      text: "채팅방 링크가 복사되었어요.",
      position: "bottom-center",
      removeAfter: 1500,
    });

    close();
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
