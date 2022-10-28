<script lang="ts">
  import type { Channel } from "$lib/types/type";

  import Spinner from "$components/Spinner.svelte";
  import { createEventDispatcher } from "svelte";
  import { store } from "$store/store";
  import { apiCreateChannelNotification, apiSubscribe } from "$lib/api";
  import { getChannel, subscribe } from "$lib/NcloudChat";

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  export let channel_id: string;

  let back: HTMLElement;
  let element: HTMLElement;
  let channel: Channel;
  let loading = false;

  async function submit() {
    loading = true;
    addPointerEventNone();

    try {
      await apiSubscribe(channel_id);
      await apiCreateChannelNotification(channel_id, true);
      channel = await getChannel(channel_id);
    } catch (err) {
      console.error(err);
    }

    try {
      await subscribe(channel_id);
    } catch (err) {
      console.error(err);
    }

    loading = false;
    removePointerEventNone();

    $store.channel = channel;
    window.sessionStorage.setItem("store", JSON.stringify($store));
    location.href = `/#/chat/${channel_id}`;
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
  class="w-full h-44 fixed bottom-0 left-0 p-2 rounded-t-2xl mx-auto text-center bg-white"
  bind:this={element}
>
  <div class="w-full h-[0.4rem] flex justify-center mb-3">
    <div class="w-14 h-[0.4rem] bg-gray-200 rounded-2xl" />
  </div>
  <div class="p-5">
    <div class="w-full flex flex-col justify-center items-center">
      <span
        class="font-semibold text-xl mb-7 underline underline-offset-0 decoration-8 decoration-yellow-300"
        >채팅방에 참여할까요?</span
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

  {#if loading}
    <div class="fixed top-[calc(50%-2.25rem)] left-[calc(50%-1rem)]">
      <Spinner />
    </div>
  {/if}
</div>
