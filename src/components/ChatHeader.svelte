<script lang="ts">
  import type { Channel } from "$lib/types/type";

  export let channel: Channel;
  export let showSettingModal = false;

  function previousPage() {
    location.replace("/#/home");
    gohome();
  }
</script>

<div class="chat_header">
  <div class="inner">
    <div class="left menu">
      <!-- svelte-ignore a11y-missing-attribute -->
      <a class="svg" on:click={previousPage}>메뉴 버튼</a>
    </div>
    <div class="r_title">
      {#if channel}
        <h2 class="aggro">{channel.name}</h2>
      {/if}
    </div>
    <div class="right">
      <div class="settings">
        <!-- svelte-ignore a11y-missing-attribute -->
        <a class="svg" on:click={() => (showSettingModal = true)}>설정</a>
      </div>
    </div>
  </div>
</div>
