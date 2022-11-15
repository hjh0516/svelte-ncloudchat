<script lang="ts">
  import type { Channel, Chat } from "$lib/types/type";

  import Image from "$components/ChatImageItem.svelte";
  import { createEventDispatcher } from "svelte";
  import { convertSendAt } from "$lib/Date";

  const dispatch = createEventDispatcher();

  export let item: Chat;

  function open(item: Chat) {
    dispatch("open", { item: item });
  }

  function profile(item: Chat) {
    dispatch("profile", { item: item });
  }
</script>

<div class="receive">
  <dl>
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
    <dd class="cont">
      {#if item.type === "text"}
        {item.message}
      {:else if item.type === "file"}
        <div class="chat_img max-w-xs" on:click={() => open(item)}>
          <Image src={item.image_url} className={"bg-white"} />
        </div>
      {/if}
    </dd>
    {#if item.show_date}
      <dd class="rciv_time mb-10">{convertSendAt(item.created_at)}</dd>
    {/if}
  </dl>
</div>
