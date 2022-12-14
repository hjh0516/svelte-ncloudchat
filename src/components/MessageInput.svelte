<script lang="ts">
  import type { Content, Emoji } from "$lib/types/type";

  import EmojiArea from "./EmojiArea.svelte";
  import ContentArea from "./ContentArea.svelte";
  import { apiGetEmoticonAvailables } from "$lib/api";

  export let input = "";
  $: inputLen = input.length;

  export let activeInput = true;
  export let showEmojiArea = false;
  export let emojiPath: string;
  export let showContentArea = false;
  export let contents: Content[];
  export let contentPath: string;
  export let showSendImageModal = false;
  export let messageInput: HTMLElement;
  export let hiddenInput: HTMLElement;
  export let send = () => {};

  let emojis: Emoji[];

  $: if (!activeInput) {
    document.querySelectorAll("input").forEach((input) => {
      input.disabled = true;
    });
  }
</script>

<div class="chat_util2">
  <div class="util_area">
    <div class="req_area">
      <div class="req_wrap">
        <div class="more">
          <input
            type="button"
            class="svg"
            on:click={() => (showSendImageModal = true)}
          />
        </div>
        <div class="ipt_area">
          <input
            type="text"
            bind:value={input}
            bind:this={messageInput}
            on:focus={() => {
              emojiPath = "";
              contentPath = "";
              showEmojiArea = false;
              showContentArea = false;
            }}
            on:keypress={(e) => {
              if (e.key === "Enter") {
                hiddenInput.focus();
                send();
              }
            }}
          />
          <input type="hidden" bind:this={hiddenInput} />
          <span class="clear">
            <input
              type="button"
              value="이모티콘"
              class="emoji {showEmojiArea ? 'on' : ''}"
              on:click={async () => {
                const res = await apiGetEmoticonAvailables();
                emojis = res.data;
                contentPath = "";
                showContentArea = false;
                showEmojiArea = !showEmojiArea;
              }}
            />
            <input
              type="button"
              class="submit {inputLen > 0 || showEmojiArea || showContentArea
                ? 'on'
                : ''}"
              on:click={() => {
                messageInput.dispatchEvent(
                  new KeyboardEvent("keypress", { key: "Enter" })
                );
              }}
            />
          </span>
        </div>
      </div>
    </div>
    {#if showEmojiArea}
      <EmojiArea {emojis} bind:emojiPath />
    {/if}
    {#if showContentArea}
      <ContentArea {contents} bind:contentPath />
    {/if}
  </div>
</div>
