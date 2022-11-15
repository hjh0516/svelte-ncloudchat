<script lang="ts">
  import type { Emoticon } from "$lib/types/type";

  import { slide } from "svelte/transition";
  import { getNotificationsContext } from "svelte-notifications";

  export let emoticons: Emoticon[];
  export let emoticonPath: string;

  const { addNotification, clearNotifications } = getNotificationsContext();

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
    <div
      class="go_store svg"
      on:click={() => {
        clearNotifications();
        addNotification({
          text: "준비 중이에요.",
          position: "bottom-center",
          removeAfter: 1500,
        });
      }}
    >
      이모티콘 스토어
    </div>
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
