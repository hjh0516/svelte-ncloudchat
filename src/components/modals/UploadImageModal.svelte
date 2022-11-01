<script lang="ts">
  import { createEventDispatcher } from "svelte";

  let back: HTMLElement;

  export let uploadImage = (e) => {};

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");
</script>

<div
  class="w-full h-full fixed top-0 left-0 bg-gray-500 bg-opacity-25"
  on:click={close}
  bind:this={back}
/>
<div
  class="w-full h-[22rem] fixed bottom-0 left-0 p-2 rounded-t-2xl mx-auto text-center bg-white"
>
  <div class="w-full h-[0.4rem] flex justify-center mb-3">
    <div class="w-14 h-[0.4rem] bg-gray-200 rounded-2xl" />
  </div>

  <div class="p-5">
    <div class="w-full flex flex-col justify-center items-center">
      <span
        class="font-recipekorea text-lg mb-5 underline underline-offset-0 decoration-8 decoration-yellow-300"
        >대표이미지 등록하기</span
      >
    </div>
    <div
      class="w-full h-14 bg-gray-100 border-b border-gray-200 rounded-t-xl text-gray-700 text-base flex justify-center items-center"
    >
      그려서 등록하기 (준비중)
    </div>
    <label for="camera">
      <input id="camera" type="file" class="sr-only" capture />
      <div
        class="w-full h-14 bg-gray-100 border-b border-gray-200 text-gray-700 text-base flex justify-center items-center"
      >
        지금 사진 찍어서 등록하기
      </div>
    </label>
    <label for="album">
      <input
        id="album"
        type="file"
        class="sr-only"
        accept=".jpg, .jpeg, .gif, .png"
        on:change={uploadImage}
      />
      <div
        class="w-full h-14 bg-gray-100 text-gray-700 text-base rounded-b-xl flex justify-center items-center mb-5"
      >
        사진첩 사진으로 등록하기
      </div>
    </label>
    <button class="w-full h-14 bg-gray-700 text-gray-100 rounded-xl text-base">
      프로필 초기화
    </button>
  </div>
</div>
