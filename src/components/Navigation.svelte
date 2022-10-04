<script lang="ts">
  import { get } from "svelte/store";
  import { activeItem, tabItems } from "../store/store";
  import Tab from "./Tab.svelte";

  let activeItemValues: string;

  activeItem.subscribe((value) => {
    activeItemValues = value;
  });

  const triggerTabChange = (event: { detail: string }) => {
    activeItemValues = event.detail;
    activeItem.set(activeItemValues);
  };
</script>

<Tab
  tabItems={get(tabItems)}
  activeItem={activeItemValues}
  on:tabChange={triggerTabChange}
/>
