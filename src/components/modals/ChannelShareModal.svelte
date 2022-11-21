<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { getNotificationsContext } from "svelte-notifications";

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");
  const { addNotification, clearNotifications } = getNotificationsContext();

  function handleButtonClick() {
    clearNotifications();
    addNotification({
      text: "준비 중이에요.",
      position: "bottom-center",
      removeAfter: 1500,
    });
  }

  onMount(() => {
    history.pushState(null, "", location.href);
    window.addEventListener("popstate", close);
  });
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
            <div class="cBtn hgt70" on:click={handleButtonClick}>
              <div class="tb">
                <div class="tbc">
                  <span class="msg">
                    <img src="../img/ico_message.svg" alt="ico_message" />
                  </span>
                  <em>초대</em>
                </div>
              </div>
            </div>
            <div class="cBtn hgt70" on:click={handleButtonClick}>
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
