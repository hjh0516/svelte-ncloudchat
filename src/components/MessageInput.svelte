<script lang="ts">
  import type { Emoji } from "$lib/types/type";

  import EmojiArea from "./EmojiArea.svelte";
  import { apiGetEmoticonAvailables } from "$lib/api";
  import { onMount } from "svelte";

  export let input = "";
  $: inputLen = input.length;

  export let activeInput = true;
  export let emojiPath: string;
  export let showEmojiArea = false;
  export let messageInput: HTMLElement;
  export let hiddenInput: HTMLElement;
  export let send = () => {};
  export let uploadImage = (e) => {};

  let emojis: Emoji[];

  $: if (!activeInput) {
    document.querySelectorAll("input").forEach((input) => {
      input.disabled = true;
    });
  }

  onMount(async () => {
    try {
      const res = await apiGetEmoticonAvailables();
      emojis = res.data;
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
            on:click={() => {
              hiddenInput.focus();
              messageInput.focus();
            }}
            on:change={(e) => {
              messageInput.blur();
              uploadImage(e);
            }}
          />
        </div>
        <div class="ipt_area">
          <input
            type="text"
            bind:value={input}
            bind:this={messageInput}
            on:keypress={(e) => {
              if (e.key === "Enter") {
                hiddenInput.focus();
                send();
              }
            }}
          />
          <input
            type="hidden"
            bind:this={hiddenInput}
          />
          <span class="clear">
            <input
              type="button"
              value="이모티콘"
              class="svg"
              on:click={() => {
                showEmojiArea = !showEmojiArea;
              }}
            />
            <input
              type="search"
              class="svg {inputLen > 0 || showEmojiArea ? 'on' : ''}"
              on:click={() => {
                messageInput.dispatchEvent(new KeyboardEvent('keypress',{'key':'Enter'}));
              }}
            />
          </span>
        </div>
      </div>
    </div>
    {#if showEmojiArea}
      <EmojiArea {emojis} bind:emojiPath />
    {/if}
  </div>
</div>
