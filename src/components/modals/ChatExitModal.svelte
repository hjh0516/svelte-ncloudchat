<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");
  const submit = () => dispatch("submit");

  function cancel() {
    close();
  }
</script>

<div
  class="w-full h-full fixed top-0 left-0 bg-gray-500 bg-opacity-25"
  on:click={close}
/>
<div
  class="w-full h-54 fixed bottom-0 left-0 p-2 rounded-t-2xl mx-auto text-center bg-white"
>
  <div class="w-full h-[0.4rem] flex justify-center mb-3">
    <div class="w-14 h-[0.4rem] bg-gray-200 rounded-2xl" />
  </div>
  <div class="p-5">
    <div class="w-full flex flex-col justify-center items-center">
      <span
        class="font-recipekorea text-lg mb-5 underline underline-offset-0 decoration-8 decoration-yellow-300"
        >채팅방을 나갈까요?</span
      >
      <span class="text-base text-gray-400 mb-7"
        >나가게 되면 모든 데이터는 삭제돼요!</span
      >
      <div class="w-full flex justify-center items-center gap-3">
        <button
          class="w-full h-12 bg-gray-400 text-gray-100 text-base rounded-lg"
          on:click={submit}>네</button
        >
        <button
          class="w-full h-12 bg-gray-700 text-gray-100 text-base rounded-lg"
          on:click={cancel}>아니요</button
        >
      </div>
    </div>
  </div>
</div>
