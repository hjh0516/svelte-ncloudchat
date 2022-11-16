<script lang="ts">
  import type { Emoticon } from "$lib/types/type";

  import EmojiArea from "./EmojiArea.svelte";
  import { apiGetEmoticonOrders } from "$lib/api";
  import { onMount } from "svelte";

  export let input = "";
  export let emoticonPath: string;
  export let showEmojiArea = false;
  export let messageInput: HTMLElement;
  export let send = () => {};
  export let uploadImage = (e) => {};

  let emoticons: Emoticon[];

  onMount(async () => {
    try {
      const res = await apiGetEmoticonOrders();
      emoticons = res.data;
    } catch (err) {
      console.error(err);
    }
  });
</script>

<div class="chat_util2">
  <div class="util_area">
    <div class="req_area">
      <div class="req_wrap">
        <div class="more">
          <input
            id="upload_image"
            type="file"
            class="svg"
            accept=".jpg, .jpeg, .gif, .png"
            on:change={(e) => {
              uploadImage(e);
            }}
          />
        </div>
        <div class="ipt_area">
          <input type="text" bind:value={input} bind:this={messageInput} />
          <span class="clear">
            <input
              type="button"
              value="이모티콘"
              class="svg"
              on:click={() => {
                showEmojiArea = !showEmojiArea;
              }}
            />
            <input type="submit" class="svg" on:click={send} />
          </span>
        </div>
      </div>
    </div>
    {#if showEmojiArea}
      <EmojiArea {emoticons} bind:emoticonPath />
    {/if}
  </div>
</div>
