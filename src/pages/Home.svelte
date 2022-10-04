<script lang="ts">
  import Navigation from "../components/Navigation.svelte";
  import { connect, initialize } from "../lib/NcloudChat";
  import { activeItem, user } from "../store/store";
  import MyChat from "./MyChat.svelte";
  import OpenChat from "./OpenChat.svelte";

  initialize();
  let promise = connect("teddy", "teddy");
  user.set({ id: "teddy", name: "teddy" });

  let activeItemValue: string;
  activeItem.subscribe((value) => {
    activeItemValue = value;
  });
</script>

<main>
  <Navigation />
  {#await promise then}
    {#if activeItemValue === "My 채팅"}
      <MyChat />
    {:else if activeItemValue === "오픈 채팅"}
      <OpenChat />
    {/if}
  {:catch error}
    <div class="w-full h-[calc(100vh-2.5rem)] flex justify-center items-center">
      <span>{error}</span>
    </div>
  {/await}
</main>
