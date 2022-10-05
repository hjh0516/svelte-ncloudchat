<script lang="ts">
  import Navigation from "../components/Navigation.svelte";
  import { activeItem } from "../store/store";
  import MyChat from "./MyChat.svelte";
  import OpenChat from "./OpenChat.svelte";

  let activeItemValue: string;
  activeItem.subscribe((value) => {
    activeItemValue = value;
  });
</script>

<main>
  <Navigation />

  {#if activeItemValue === "My 채팅"}
    <MyChat />
  {:else if activeItemValue === "오픈 채팅"}
    <OpenChat />
  {/if}
</main>
