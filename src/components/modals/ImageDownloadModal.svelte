<script lang="ts">
  import type { Chat } from "$lib/types/type";

  import { createEventDispatcher } from "svelte";

  export let item: Chat;

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  async function download() {
    const filename = item.image_url.split("/").pop();

    const res = await fetch(item.image_url);
    const blob = await res.blob();
    let url = window.URL.createObjectURL(blob);

    let link = document.createElement("a");
    link.href = url;
    link.download = "이모만세_" + filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  }
</script>

<!-- <div
  class="w-full h-full fixed top-0 left-0 bg-gray-500 bg-opacity-25"
  on:click={close}
/>
<div
  class="w-full h-[26rem] fixed bottom-0 left-0 p-2 rounded-t-2xl mx-auto text-center bg-white"
>
  <div class="w-full h-[0.4rem] flex justify-center mb-3">
    <div class="w-14 h-[0.4rem] bg-gray-200 rounded-2xl" />
  </div>
  <div class="p-5">
    <div class="w-full flex flex-col justify-center items-center">
      <span
        class="font-recipekorea text-lg mb-5 underline underline-offset-0 decoration-8 decoration-yellow-300"
        >이미지 상세보기</span
      >
    </div>
    <div class="w-full flex justify-center items-center mb-5">
      <img
        class="h-56 rounded-xl border border-gray-300"
        src={item.image_url}
        alt="image_url"
        on:error={() => {
          item.image_url = "default.jpg";
        }}
      />
    </div>
    <button
      class="w-11/12 h-14 bg-gray-700 text-gray-100 rounded-xl text-base"
      on:click={download}
    >
      저장
    </button>
  </div>
</div> -->

<div id="imgDetail" class="profile_pop" style="bottom: 0px;">
  <div class="pop_cont">
    <div class="tb">
      <div class="tbc">
        <div class="svg btn_close wt" on:click={close}>닫기</div>
        <div class="c_wrap flex justify-center">
          <img
            src={item.image_url}
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
