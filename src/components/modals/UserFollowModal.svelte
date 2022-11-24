<script lang="ts">
  import type { Channel } from "$lib/types/type";

  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
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

<div
  class="c_mbg block"
  style="z-index: 300;"
  transition:fade={{ delay: 100, duration: 300 }}
/>
<div
  id="followCheck"
  class="chat_alert2"
  transition:fade={{ delay: 100, duration: 300 }}
  on:click={close}
>
  <div class="tb">
    <div class="tbc">
      <div class="pop_inner">
        <div class="pop_cont">
          <div class="pop_title">
            <h3 class="aggro">팔로워만 입장할 수 있어요.</h3>
          </div>
          <form>
            <div class="s_txt">
              <p>
                방장을 팔로잉하시면 바로 입장할 수 있어요.<br />
                팔로잉 할까요?
              </p>
            </div>
            <div class="btn_area in_2">
              <div>
                <input
                  type="button"
                  value="안할래요."
                  class="cBtn gr3"
                  on:click={close}
                />
                <input
                  type="button"
                  value="팔로잉할게요!"
                  class="cBtn bgr"
                  on:click={submit}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
