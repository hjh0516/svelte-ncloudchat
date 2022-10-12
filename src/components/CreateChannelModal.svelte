<script lang="ts">
  import type { Channel } from "$lib/types/type";

  import { createEventDispatcher } from "svelte";
  import { ChannelType } from "ncloudchat/esm/Type";
  import { createChannel, subscribe } from "$lib/NcloudChat";
  import Spinner from "$components/Spinner.svelte";
  import { apiCreateChannel, apiSubscribe } from "$lib/api";

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

  async function submit() {
    if (!name) {
      inputName.focus();
      nameDiv.classList.add("border-red-300");
      return;
    }

    if (!tag || !tag.includes("#")) {
      inputTag.focus();
      tagDiv.classList.add("border-red-300");
      return;
    }

    loading = true;
    addPointerEventNone();

    try {
      const channel = await createChannel(ChannelType.PUBLIC, name);
      const chat_list = await apiCreateChannel(
        channel.id,
        channel.name,
        channel.type.toString(),
        channel.image_url,
        channel.link_url,
        channel.push,
        tag
      );

      await subscribe(channel.id);
      await apiSubscribe(channel.id);

      newChannel = chat_list;
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
  class="w-full h-80 fixed bottom-0 left-0 p-5 rounded-2xl mx-auto text-center bg-white"
  bind:this={element}
>
  <div class="w-full flex flex-col justify-center items-center">
    <span class="font-bold text-xl mb-5">채팅방 만들기</span>
    <div
      class="w-full h-12 border-2 border-gray-300 rounded-xl flex justify-center items-center p-2 mb-5"
      bind:this={nameDiv}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="w-6 h-6 mr-2"
      >
        <path
          fill-rule="evenodd"
          d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z"
          clip-rule="evenodd"
        />
      </svg>
      <input
        class="w-full h-10 pl-2 pr-2 focus:outline-none text-base"
        type="text"
        placeholder="채팅방 이름을 입력해주세요."
        bind:this={inputName}
        bind:value={name}
      />
    </div>
    <div
      class="w-full h-12 border-2 border-gray-300 rounded-xl flex justify-center items-center p-2 mb-10"
      bind:this={tagDiv}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="w-6 h-6"
      >
        <path
          fill-rule="evenodd"
          d="M11.097 1.515a.75.75 0 01.589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 111.47.294L16.665 7.5h3.585a.75.75 0 010 1.5h-3.885l-1.2 6h3.585a.75.75 0 010 1.5h-3.885l-1.08 5.397a.75.75 0 11-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 01-1.47-.294l1.02-5.103H3.75a.75.75 0 110-1.5h3.885l1.2-6H5.25a.75.75 0 010-1.5h3.885l1.08-5.397a.75.75 0 01.882-.588zM10.365 9l-1.2 6h4.47l1.2-6h-4.47z"
          clip-rule="evenodd"
        />
      </svg>
      <input
        class="w-full h-10 pl-2 pr-2 focus:outline-none text-base"
        type="text"
        placeholder="해시태그로 채팅방을 소개해주세요."
        bind:this={inputTag}
        bind:value={tag}
      />
    </div>
    <button
      class="w-full h-14 rounded-xl bg-gray-500 text-white"
      on:click={async () => await submit()}>완료</button
    >
  </div>

  {#if loading}
    <div class="fixed bottom-1/4 left-[calc(50%-1rem)]">
      <Spinner />
    </div>
  {/if}
</div>
