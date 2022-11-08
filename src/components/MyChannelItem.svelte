<script lang="ts">
  import type { Channel } from "$lib/types/type";

  import { createEventDispatcher, onMount } from "svelte";
  import Flicking, { FlickingPanel } from "@egjs/svelte-flicking";
  import "@egjs/svelte-flicking/dist/flicking.css";
  import { store } from "$store/store";
  import { convertDate } from "$lib/Date";
  import { drawImage } from "$lib/Image";
  import { apiUpdateChannelNotification } from "$lib/api";
  import { godetail } from "../app";

  export let item: Channel;

  let canvas: HTMLCanvasElement;
  let flicking: Flicking;

  const dispatch = createEventDispatcher();
  function exit(channelId: string) {
    dispatch("exit", {
      channelId: channelId,
    });
  }

  function clickItem(channel_id: string) {
    $store.channel = item;
    window.sessionStorage.setItem("store", JSON.stringify($store));
    location.href = `/#/chat/${channel_id}`;
    godetail();
  }

  function updateNotification() {
    item.notification = !item.notification;
    try {
      apiUpdateChannelNotification(item.channel_id, item.notification);
    } catch (err) {
      console.error(err);
    }
    flicking.moveTo(0);
  }

  onMount(() => {
    if (item.image_url) {
      drawImage(canvas, item.image_url);
    }
  });
</script>

<Flicking
  class="pl-5 pr-5"
  options={{ align: "next", bound: true }}
  bind:this={flicking}
>
  <FlickingPanel
    class="w-full mr-3 mb-3 flex items-center pt-5 pb-5 pl-4 pr-5 border bg-white border-gray-100 rounded-3xl shadow-lg hover:bg-gray-50"
  >
    <div
      class="w-full flex items-center justify-center"
      on:click={() => clickItem(item.channel_id)}
    >
      {#if item.image_url}
        <canvas
          class="h-14 border border-gray-200 rounded-full"
          bind:this={canvas}
        />
      {:else}
        <img
          class="h-14 border border-gray-200 rounded-full"
          src="/default.jpg"
          alt="channel_image"
        />
      {/if}
      <div class="w-full flex flex-col ml-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <span class="font-recipekorea text-base">{item.name}</span>
            {#if item.type === "PUBLIC" || item.type === "FOLLOWER"}
              <span class="font-recipekorea text-base text-gray-500 ml-1"
                >({item.subscriptions_count}명)</span
              >
            {/if}
          </div>
          <span class="text-gray-400 text-xs"
            >{item.last_chat_at
              ? convertDate(item.last_chat_at)
              : convertDate(item.created_at)}</span
          >
        </div>
        <div class="flex justify-between items-center">
          <span
            class="max-w-[calc(100vw-12rem)] break-words h-auto text-gray-400 text-sm"
          >
            {#if item.chat_type === "file"}
              이미지
            {:else if item.message}
              {item.message.length >= 50
                ? item.message.substring(0, 50) + "..."
                : item.message}
            {/if}
          </span>
          <span
            class="w-auto h-4 pr-1 pl-1 bg-gray-600 rounded-full text-center text-gray-50 text-xs font-semibold"
            >{item.unread_count ? item.unread_count : 0}</span
          >
        </div>
      </div>
    </div>
  </FlickingPanel>
  <FlickingPanel class="mb-3 flex justify-center">
    <div on:click={updateNotification}>
      {#if item.notification}
        <div
          class="w-16 h-full ml-2 flex flex-col justify-center items-center bg-gray-700 rounded-2xl shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-6 h-6 text-gray-50 mb-1"
          >
            <path
              fill-rule="evenodd"
              d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-gray-50 text-xs">알림끄기</span>
        </div>
      {:else}
        <div
          class="w-16 h-full ml-2 flex flex-col justify-center items-center bg-gray-400 rounded-2xl shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-6 h-6 text-gray-50 mb-1"
          >
            <path
              d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM20.57 16.476c-.223.082-.448.161-.674.238L7.319 4.137A6.75 6.75 0 0118.75 9v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206z"
            />
            <path
              fill-rule="evenodd"
              d="M5.25 9c0-.184.007-.366.022-.546l10.384 10.384a3.751 3.751 0 01-7.396-1.119 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-gray-50 text-xs font-semibold">알림켜기</span>
        </div>
      {/if}
    </div>
    <div
      class="w-16 h-full ml-2 flex flex-col justify-center items-center bg-red-500 rounded-2xl shadow-lg"
      on:click={() => {
        exit(item.channel_id);
        flicking.moveTo(0);
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="w-6 h-6 text-gray-50 mb-1"
      >
        <path
          fill-rule="evenodd"
          d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z"
          clip-rule="evenodd"
        />
      </svg>
      <span class="text-gray-50 text-xs font-semibold">나가기</span>
    </div>
  </FlickingPanel>
</Flicking>
