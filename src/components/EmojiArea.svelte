<script lang="ts">
  import type { Emoji } from "$lib/types/type";
  import { onMount } from "svelte";

  import { slide } from "svelte/transition";

  export let emojis: Emoji[];
  export let emojiPath: string;

  let index = 0;
  let item = 0;

  function selectEmojiList(i: number) {
    index = i;
    item = 0;
  }

  function selectEmoji(i: number) {
    item = i;
    emojiPath = emojis[index].files[item].path;
  }

  onMount(() => {
    if (emojis.length > 0) {
      selectEmojiList(0);
      selectEmoji(0);
    }
  });
</script>

<div class="emoge_area" transition:slide={{ delay: 100, duration: 300 }}>
  <div class="emoge_case">
    <ul class="scroll">
      {#if emojis.length > 0}
        {#each emojis as emoji, i}
          <li on:click={() => selectEmojiList(i)}>
            <img
              class={index === i ? "on" : ""}
              src={emoji.files[0].path}
              alt="emoji_list"
            />
          </li>
        {/each}
      {/if}
    </ul>
    <div class="go_store svg" on:click={() => goemoticon()}>
      이모티콘 스토어
    </div>
  </div>
  <div class="emoge_list">
    <ul class="scroll clear">
      {#if emojis.length > 0}
        {#each emojis[index].files as file, i}
          <li on:click={() => selectEmoji(i)}>
            <img class={item === i ? "on" : ""} src={file.path} alt="emoji" />
          </li>
        {/each}
      {/if}
    </ul>
  </div>
</div>
