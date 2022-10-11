<script lang="ts">
  import { get } from "svelte/store";
  import { store } from "$store/store";
  import Tab from "$components/Tab.svelte";

  let activeItemValues: string;

  // activeItem.subscribe((value) => {
  //   activeItemValues = value;
  // });

  const triggerTabChange = (event: { detail: string }) => {
    activeItemValues = event.detail;
    $store.activeItem = activeItemValues;
  };
</script>

<Tab
  tabItems={$store.tabItems}
  activeItem={$store.activeItem}
  on:tabChange={triggerTabChange}
/>
