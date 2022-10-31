<script lang="ts">
  import type { Channel } from "$lib/types/type";

  import Spinner from "$components/Spinner.svelte";
  import { createEventDispatcher } from "svelte";
  import { store } from "$store/store";
  import { apiCreateChannelNotification, apiSubscribe } from "$lib/api";
  import { getChannel, subscribe } from "$lib/NcloudChat";
  import { convertChannelCreatedAt } from "$lib/Date";

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  export let channel_id: string;
  export let item: Channel;

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
  class="w-full h-[36rem] fixed bottom-0 left-0 p-2 rounded-t-2xl mx-auto text-center bg-white"
  bind:this={element}
>
  <div class="w-full h-[0.4rem] flex justify-center mb-3">
    <div class="w-14 h-[0.4rem] bg-gray-200 rounded-2xl" />
  </div>
  <div class="p-5">
    <div class="w-full flex flex-col justify-center items-center">
      <span
        class="font-recipekorea text-lg mb-5 underline underline-offset-0 decoration-8 decoration-yellow-300"
        >채팅 참여하기</span
      >
      {#if item.image_url}
        <img
          class="w-28 border border-gray-200 rounded-full mb-5"
          src={item.image_url}
          alt="channel_image"
        />
      {:else}
        <img
          class="w-28 border border-gray-200 rounded-full mb-5"
          src="/default.jpg"
          alt="channel_image"
        />
      {/if}
      <div class="w-full">
        <span class="font-sbaggrom text-xl">{item.name}</span>
      </div>
      <div class="pl-2 pr-2 mb-5 bg-yellow-300 rounded-lg">
        <span class="text-base text-gray-600">
          {#if item.type === "PUBLIC"}
            전체 입장 가능
          {:else}
            팔로워만 입장 가능
          {/if}
        </span>
      </div>
      <div class="w-full h-10 mb-5 text-center overflow-y-auto scrollbar-hide">
        {#if item.tags.length > 0}
          <span class="text-base text-gray-400"
            >{item.tags.map((t) => "#" + t.tag).join(" ")}</span
          >
        {:else}
          <span class="text-base text-gray-400">
            등록된 해시태그가 없어요!
          </span>
        {/if}
      </div>
      <div
        class="w-full h-32 p-5 mb-5 border-2 border-gray-200 flex items-center rounded-lg shadow-md"
      >
        <img
          class="w-12 h-12 border border-gray-200 rounded-full"
          src={item.profile}
          alt="profile_image"
        />
        <div class="w-full ml-5 flex flex-col text-left">
          <span class="font-sbaggrom text-base mb-5">{item.nickname}</span>
          <span class="text-sm text-gray-500"
            >{item.subscriptions_count}명 참여중</span
          >
          <span class="text-sm text-gray-500"
            >{convertChannelCreatedAt(item.created_at)} 개설</span
          >
        </div>
      </div>
      <div class="w-full flex justify-center items-center gap-3">
        <button
          class="w-full h-12 bg-gray-700 text-gray-100 text base rounded-lg"
          on:click={submit}
        >
          참여하기
        </button>
        <button
          class="w-full h-12 bg-gray-400 text-gray-100 text base rounded-lg"
        >
          공유하기
        </button>
      </div>
    </div>
  </div>

  {#if loading}
    <div class="fixed top-[calc(50%-2.25rem)] left-[calc(50%-1rem)]">
      <Spinner />
    </div>
  {/if}
</div>
