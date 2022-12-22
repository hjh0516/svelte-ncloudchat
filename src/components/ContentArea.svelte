<script lang="ts">
  import { apiGetContents } from "$lib/api";
  import type { Content } from "$lib/types/type";
  import { onMount } from "svelte";

  import { slide } from "svelte/transition";
  import InfiniteScroll from "./InfiniteScroll.svelte";

  export let contents: Content[];
  export let contentPath: string;

  let item = 0;
  let page = 1;
  let newData: Content[] = [];

  function selectContent(i: number) {
    item = i;
    contentPath = contents[i].path;
  }

  async function loadContents() {
    try {
      const res = await apiGetContents(page);
      newData = res.data;
      contents = [...contents, ...newData];
    } catch (err) {
      console.error(err);
    }
  }

  onMount(() => {
    newData = contents;
    if (contents.length > 0) {
      selectContent(0);
    }
  });
</script>

<div class="emoge_area" transition:slide={{ delay: 0, duration: 200 }}>
  <div class="emoge_case">
    <ul class="scroll" style="height: 0;">
      <!-- {#if contents.length > 0}
          {#each contents as content, i}
            <li on:click={() => selectEmojiList(i)}>
              <img
                class={index === i ? "on" : ""}
                src={emoji.files[0].path}
                alt="emoji_list"
              />
            </li>
          {/each}
        {/if} -->
    </ul>
  </div>
  <div class="emoge_list">
    <ul class="scroll clear" style="height: 237px;">
      {#if contents.length > 0}
        {#each contents as content, i}
          <li on:click={() => selectContent(i)}>
            <img
              class={item === i ? "on" : ""}
              src={content.path}
              alt="content"
            />
          </li>
        {/each}
      {/if}
      <InfiniteScroll
        hasMore={newData.length > 0}
        threshold={100}
        on:loadMore={async () => {
          page++;
          await loadContents();
        }}
      />
    </ul>
  </div>
</div>
