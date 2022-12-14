<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import { getNotificationsContext } from "svelte-notifications";

  export let uploadImage = (e) => {};
  const { addNotification, clearNotifications } = getNotificationsContext();

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  function handleButtonClick() {
    clearNotifications();
    addNotification({
      text: "준비 중이에요.",
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
    <div class="pop_cont" style="margin-top: 0;">
      <form>
        <div class="ipt_area2">
          <ul>
            <li>
              <div on:click={handleButtonClick}>내 컨텐츠에서 선택하기</div>
            </li>
            <li>
              <label for="camera">
                <input
                  id="camera"
                  type="file"
                  class="sr-only"
                  accept="image/*"
                  capture
                  on:change={(e) => {
                    uploadImage(e);
                    close();
                  }}
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
                  accept="image/*"
                  on:change={(e) => {
                    uploadImage(e);
                    close();
                  }}
                />
                <div>사진첩 사진으로 등록하기</div>
              </label>
            </li>
          </ul>
        </div>
      </form>
    </div>
  </div>
</div>
