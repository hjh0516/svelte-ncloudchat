<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { slide } from "svelte/transition";

  export let independ: boolean;

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");
  const submit = () => dispatch("submit");

  let isBack = false;

  function back() {
    isBack = true;
    close();
  }

  onMount(() => {
    if (independ) {
      history.pushState(null, "", location.href);
      window.addEventListener("popstate", back);
    }
  });

  onDestroy(() => {
    if (independ) {
      window.removeEventListener("popstate", back);
    }
  });
</script>

<div class="c_mbg block" style="z-index: 150;" on:click={close} />
<div
  id="exitRoom"
  class="chat_pop chat_alert"
  transition:slide={{ delay: 100, duration: 300 }}
>
  <div class="pop_inner">
    <div class="pop_title">
      <h3 class="aggro">채팅방을 나갈까요?</h3>
    </div>
    <div class="pop_cont">
      <form>
        <div class="s_txt">
          <p>나가게 되면 모든 데이터는 삭제돼요!</p>
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
