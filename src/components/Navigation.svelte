<script lang="ts">
  import Tab from "$components/Tab.svelte";
  import { store } from "$store/store";

  let activeItemValues: string;

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
