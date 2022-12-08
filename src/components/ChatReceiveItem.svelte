<script lang="ts">
  import type { Chat } from "$lib/types/type";

  import ChatImageItem from "$components/ChatImageItem.svelte";
  import { createEventDispatcher } from "svelte";
  import { convertSendAt } from "$lib/Date";
  import { store } from "$store/store";

  const dispatch = createEventDispatcher();
  const VITE_ARCHIVE_URL = import.meta.env.VITE_ARCHIVE_URL;

  export let item: Chat;

  function open(item: Chat) {
    dispatch("open", { item: item });
  }

  function profile(item: Chat) {
    dispatch("profile", { item: item });
  }
</script>

<div class="receive">
  <dl
    class={$store.channel && $store.channel.user_idx === item.user_idx
      ? "r_leader2"
      : ""}
  >
    {#if item.show_profile}
      <dt
        class="c_avata back_img"
        style="background-image:url({item.profile});"
        on:click={() => profile(item)}
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
    {#if item.type === "text"}
      <dd class="cont">
        {item.message}
      </dd>
    {:else if item.type === "link"}
      <dd class="cont" style="color: rgb(37 99 235);">
        {@html item.message}
      </dd>
    {:else if item.type === "file"}
      <div
        class="chat_img max-w-fit h-[125px] mt-3 flex justify-center items-center"
        on:click={() => open(item)}
      >
        <ChatImageItem
          src={VITE_ARCHIVE_URL + item.image_url}
          className={"rounded-2xl"}
        />
      </div>
    {/if}
    {#if item.show_date}
      <dd class="rciv_time mb-5">{convertSendAt(item.created_at)}</dd>
    {/if}
  </dl>
</div>
