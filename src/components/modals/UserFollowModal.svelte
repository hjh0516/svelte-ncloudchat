<script lang="ts">
  import type { Channel } from "$lib/types/type";

  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import { getNotificationsContext } from "svelte-notifications";
  import { apiCreateFollow } from "$lib/api";

  export let item: Channel;

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");
  const { addNotification, clearNotifications } = getNotificationsContext();

  async function submit() {
    await apiCreateFollow(item.user_idx);
    clearNotifications();
    addNotification({
      text: `${item.nickname}님을 팔로우했어요.`,
      position: "bottom-center",
      removeAfter: 1500,
    });
    close();
  }
</script>

<div class="c_mbg block" style="z-index: 150;" on:click={close} />
<div
  id="exitRoom"
  class="chat_pop chat_alert"
  transition:slide={{ delay: 100, duration: 300 }}
>
  <div class="pop_inner">
    <div class="pop_title">
      <h3 class="aggro">팔로워만 입장할 수 있어요.</h3>
    </div>
    <div class="pop_cont">
      <form>
        <div class="s_txt">
          <p>
            방장을 팔로우 하시면 바로 입장하실 수 있어요.<br />
            팔로우 할까요?
          </p>
        </div>
        <div class="btn_area in_2">
          <div>
            <input
              type="button"
              value="네"
              class="cBtn gr2"
              on:click={submit}
            />
            <input type="button" value="아니요" class="cBtn" on:click={close} />
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
