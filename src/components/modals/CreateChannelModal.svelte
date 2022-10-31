<script lang="ts">
  import type { Channel } from "$lib/types/type";

  import OnOffButton from "$components/buttons/OnOffButton.svelte";
  import Spinner from "$components/Spinner.svelte";
  import { createEventDispatcher } from "svelte";
  import { ChannelType } from "ncloudchat/esm/Type";
  import { createChannel, subscribe } from "$lib/NcloudChat";
  import {
    apiCreateChannel,
    apiCreateChannelNotification,
    apiGetChannel,
    apiSubscribe,
  } from "$lib/api";
  import UploadImageModal from "./UploadImageModal.svelte";

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  export let newChannel: Channel = null;

  let name: string;
  let tag: string;
  let loading = false;

  let back: HTMLElement;
  let element: HTMLElement;
  let inputName: HTMLElement;
  let nameDiv: HTMLElement;
  let inputTag: HTMLElement;
  let tagDiv: HTMLElement;
  let checked = false;
  let showUploadImageModal = false;

  async function submit() {
    if (!name) {
      inputName.focus();
      return;
    }

    if (tag && !tag.includes("#")) {
      inputTag.focus();
      return;
    }

    loading = true;
    addPointerEventNone();

    try {
      const channel = await createChannel(ChannelType.PUBLIC, name);
      await apiCreateChannel(
        channel.id,
        channel.name,
        channel.type.toString(),
        channel.image_url,
        channel.link_url,
        channel.push,
        tag
      );
      apiCreateChannelNotification(channel.id, true);

      subscribe(channel.id);
      apiSubscribe(channel.id);

      newChannel = await apiGetChannel(channel.id);
    } catch (err) {
      console.error(err);
    }

    loading = false;
    removePointerEventNone();
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
  class="w-full h-[33.4rem] fixed bottom-0 left-0 p-3 rounded-t-2xl mx-auto text-center bg-white"
  bind:this={element}
>
  <div class="w-full h-[0.4rem] flex justify-center mb-3">
    <div class="w-14 h-[0.4rem] bg-gray-200 rounded-2xl" />
  </div>
  <div class="p-5">
    <div class="w-full flex flex-col justify-center items-center">
      <span
        class="font-recipekorea text-lg mb-5 underline underline-offset-0 decoration-8 decoration-yellow-300"
        >채팅방 만들기</span
      >
      <img
        class="w-28 border border-gray-200 rounded-full mb-3"
        src="/default.jpg"
        alt="channel_image"
      />
      <button
        class="w-20 mb-5 pr-2 pl-2 pt-1 pb-1 bg-yellow-300 rounded-2xl text-gray-600 font-semibold text-base hover:bg-yellow-200"
        style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0)"
        on:click={() => {
          showUploadImageModal = true;
        }}>수정하기</button
      >
      <div
        class="w-full h-12 border-2 border-gray-100 bg-gray-100 rounded-xl flex justify-center items-center p-2 mb-5 focus-within:border-2 focus-within:border-cyan-500"
        bind:this={nameDiv}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-6 h-6 mr-1 text-gray-600"
        >
          <path
            fill-rule="evenodd"
            d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z"
            clip-rule="evenodd"
          />
        </svg>
        <input
          class="w-full h-10 pl-2 pr-2 bg-gray-100 focus:outline-none text-base"
          type="text"
          placeholder="채팅방 이름을 입력해주세요."
          bind:this={inputName}
          bind:value={name}
        />
      </div>
      <div
        class="w-full h-12 border-2 border-gray-100 bg-gray-100 rounded-xl flex justify-center items-center p-2 mb-5 focus-within:border-cyan-500"
        bind:this={tagDiv}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-6 h-6 mr-1 text-gray-500"
        >
          <path
            fill-rule="evenodd"
            d="M11.097 1.515a.75.75 0 01.589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 111.47.294L16.665 7.5h3.585a.75.75 0 010 1.5h-3.885l-1.2 6h3.585a.75.75 0 010 1.5h-3.885l-1.08 5.397a.75.75 0 11-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 01-1.47-.294l1.02-5.103H3.75a.75.75 0 110-1.5h3.885l1.2-6H5.25a.75.75 0 010-1.5h3.885l1.08-5.397a.75.75 0 01.882-.588zM10.365 9l-1.2 6h4.47l1.2-6h-4.47z"
            clip-rule="evenodd"
          />
        </svg>
        <input
          class="w-full h-10 pl-2 pr-2 bg-gray-100 focus:outline-none text-base"
          type="text"
          placeholder="해시태그로 채팅방을 소개해주세요. (#태그)"
          bind:this={inputTag}
          bind:value={tag}
        />
      </div>
      <div class="w-full mb-5 flex justify-between items-center pl-3 pr-3">
        <span class="text-base font-semibold">팔로워만 입장</span>
        <OnOffButton id="type" bind:checked />
      </div>
      <button
        class="w-full h-14 rounded-xl bg-gray-700 text-white"
        on:click={async () => await submit()}>완료</button
      >
    </div>
  </div>

  {#if showUploadImageModal}
    <UploadImageModal on:close={() => (showUploadImageModal = false)} />
  {/if}

  {#if loading}
    <div class="fixed bottom-1/4 left-[calc(50%-1rem)]">
      <Spinner />
    </div>
  {/if}
</div>
