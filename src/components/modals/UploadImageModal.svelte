<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import { getNotificationsContext } from "svelte-notifications";

  export let uploadImage = (e) => {};
  export let resetImage = () => {};
  const { addNotification, clearNotifications } = getNotificationsContext();

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  function handleButtonClick() {
    clearNotifications();
    addNotification({
      text: "준비 중입니다.",
      position: "bottom-center",
      removeAfter: 1500,
    });
  }
</script>

<div class="c_mbg block" style="z-index: 150;" on:click={close} />
<div
  id="imgChange"
  class="chat_pop"
  transition:slide={{ delay: 100, duration: 300 }}
>
  <div class="pop_inner">
    <div class="pop_title">
      <h3 class="aggro">대표이미지 수정하기</h3>
    </div>
    <div class="pop_cont">
      <form>
        <div class="ipt_area2">
          <ul>
            <li>
              <div on:click={handleButtonClick}>그려서 등록하기</div>
            </li>
            <li>
              <label for="camera">
                <input
                  id="camera"
                  type="file"
                  class="sr-only"
                  capture
                  on:change={uploadImage}
                />
                <div>지금 사진 찍어서 등록하기</div>
              </label>
            </li>
            <li>
              <label for="album">
                <input
                  id="album"
                  type="file"
                  class="sr-only"
                  accept=".jpg, .jpeg, .gif, .png"
                  on:change={uploadImage}
                />
                <div>사진첩 사진으로 등록하기</div>
              </label>
            </li>
          </ul>
        </div>
        <div class="btn_area">
          <input
            type="button"
            value="프로필 초기화"
            class="cBtn"
            on:click={resetImage}
          />
        </div>
      </form>
    </div>
  </div>
</div>
