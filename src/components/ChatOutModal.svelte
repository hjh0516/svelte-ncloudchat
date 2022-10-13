<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { apiUnsubscribe } from "$lib/api";
  import { unsubscribe } from "$lib/NcloudChat";

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  export let channel_id: string;

  let back: HTMLElement;
  let element: HTMLElement;
  let loading = false;

  async function submit() {
    loading = true;
    addPointerEventNone();

    try {
      await apiUnsubscribe(channel_id);
      await unsubscribe(channel_id);
    } catch (err) {
      console.error(err);
    }

    loading = false;
    removePointerEventNone();
    location.href = "/#/home";
  }

  function cancel() {
    close();
  }

  function addPointerEventNone() {
    back.classList.add("pointer-events-none");
    element.classList.add("pointer-events-none");
  }

  function removePointerEventNone() {
    back.classList.remove("pointer-events-none");
    element.classList.remove("pointer-events-none");
  }
</script>

<div
  class="w-full h-full fixed top-0 left-0 bg-gray-500 bg-opacity-25"
  on:click={close}
  bind:this={back}
/>
<div
  class="w-full h-56 fixed bottom-0 left-0 p-10 rounded-2xl mx-auto text-center bg-white"
  bind:this={element}
>
  <div class="w-full flex flex-col justify-center items-center">
    <span class="font-semibold text-xl mb-5">채팅방을 나갈까요?</span>
    <span class="text-base text-gray-400 mb-10"
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
