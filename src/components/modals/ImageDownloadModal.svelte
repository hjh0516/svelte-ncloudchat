<script lang="ts">
  import type { Chat } from "$lib/types/type";

  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { slide } from "svelte/transition";

  export let item: Chat;

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");
  const VITE_ARCHIVE_URL = import.meta.env.VITE_ARCHIVE_URL;

  let isBack = false;

  async function download() {
    const image_url = VITE_ARCHIVE_URL + item.image_url;
    
    if (isMobile.Android() && window.emoApp) {
      window.emoApp?.godownload(image_url);
    }else{
      const res = await fetch(image_url);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      let link = document.createElement("a");
      link.href = url;
      link.download = `이모만세_${new Date().getTime()}`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    }
  }

  function back() {
    isBack = true;
    close();
  }

  onMount(() => {
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

<div
  id="imgDetail"
  class="profile_pop"
  transition:slide={{ delay: 100, duration: 300 }}
>
  <div class="pop_cont">
    <div class="tb">
      <div class="tbc">
        <div id="close" class="svg btn_close wt" on:click={close}>닫기</div>
        <div class="c_wrap flex justify-center">
          <img
            src={VITE_ARCHIVE_URL + item.image_url}
            alt="image_detail"
            on:error={() => {
              item.image_url = "default.jpg";
            }}
          />
        </div>
        <div class="svg btn_save" on:click={download}>저장</div>
      </div>
    </div>
  </div>
</div>
