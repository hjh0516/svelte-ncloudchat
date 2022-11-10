<script lang="ts">
  import type { Emoticon } from "$lib/types/type";

  import { slide } from "svelte/transition";

  export let emoticons: Emoticon[];
  export let emoticonPath: string;

  let index = 0;
  let item = 0;

  function selectEmojiList(i: number) {
    index = i;
    item = 0;
  }

  function selectEmoji(i: number) {
    item = i;
    emoticonPath = emoticons[index].files[item].path;
  }
</script>

<div class="emoge_area" transition:slide={{ delay: 100, duration: 300 }}>
  <div class="emoge_case">
    <ul class="scroll scrollbar-hide">
      {#if emoticons.length > 0}
        {#each emoticons as emoticon, i}
          <li on:click={() => selectEmojiList(i)}>
            <img
              class={index === i ? "on" : ""}
              src={emoticon.files[0].path}
              alt="emoji_list"
            />
          </li>
        {/each}
      {/if}
    </ul>
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a href="javascript:;" class="go_store svg">이모티콘 스토어</a>
  </div>
  <div class="emoge_list">
    <ul class="scroll clear scrollbar-hide">
      {#if emoticons.length > 0}
        {#each emoticons[index].files as file, i}
          <li on:click={() => selectEmoji(i)}>
            <img class={item === i ? "on" : ""} src={file.path} alt="emoji" />
          </li>
        {/each}
      {/if}
    </ul>
  </div>
</div>
