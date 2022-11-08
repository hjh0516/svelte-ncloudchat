<script lang="ts">
  import type { Chat } from "$lib/types/type";

  import Image from "$components/ChatImageItem.svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import { convertSendAt } from "$lib/Date";
  import { drawImage } from "$lib/Image";

  const dispatch = createEventDispatcher();

  export let item: Chat;

  let canvas: HTMLCanvasElement;

  function open(item: Chat) {
    dispatch("open", { item: item });
  }

  onMount(() => {
    // drawImage(canvas, item.profile);
  });
</script>

<!-- <div class="flex justify-start">
  <div class="w-10 h-10">
    {#if item.show_profile}
      <img
        class="rounded-full"
        src={item.profile}
        alt="sender_profile_image"
        on:error={() => {
          item.profile = "profile_default.jpeg";
        }}
      />
    {/if}
  </div>
  <div class="flex flex-col ml-3 items-start">
    {#if item.show_nickname}
      <span class="text-sm font-sbaggrom">{item.nickname}</span>
    {/if}
    {#if item.type === "text"}
      <div
        class="max-w-[calc(100vw-10rem)] bg-white border border-gray-200 mt-1 pt-1 pb-2 pl-3 pr-3 rounded-b-xl rounded-r-xl"
      >
        <span class="break-words text-gray-500 text-sm">{item.message}</span>
      </div>
    {:else if item.type === "file"}
      <div class="max-w-[8rem] h-auto mt-1" on:click={() => open(item)}>
        <Image src={item.image_url} className={"rounded-b-lg rounded-r-lg"} />
      </div>
    {/if}
    {#if item.show_date}
      <span class="text-gray-400 text-xs mt-1 mb-3">
        {convertSendAt(item.created_at)}
      </span>
    {/if}
  </div>
</div> -->

<div class="receive">
  <dl>
    {#if item.show_profile}
      <dt
        class="c_avata back_img"
        style="background-image:url({item.profile});"
      >
        <img
          src="../img/img_basic2.png"
          class="basic_img"
          alt="profile_image"
        />
      </dt>
    {/if}
    {#if item.show_nickname}
      <dd class="user_name aggro">{item.nickname}</dd>
    {/if}
    <dd class="cont">
      {#if item.type === "text"}
        {item.message}
      {:else if item.type === "file"}
        <div class="chat_img" on:click={() => open(item)}>
          <Image src={item.image_url} className={"bg-white"} />
        </div>
      {/if}
    </dd>
    {#if item.show_date}
      <dd class="rciv_time mb-10">{convertSendAt(item.created_at)}</dd>
    {/if}
  </dl>
</div>
