<script lang="ts">
  import { store } from "$store/store";

  export let showSettingModal = false;

  function previousPage() {
    location.href = "/#/home";
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
      <h2 class="aggro">{$store.channel.name}</h2>
    </div>
    <div class="right">
      <div class="settings">
        <!-- svelte-ignore a11y-missing-attribute -->
        <a class="svg" on:click={() => (showSettingModal = true)}>설정</a>
      </div>
      <div class="alarm">
        <!-- svelte-ignore a11y-missing-attribute -->
        <a class="svg new">알람 보기</a>
      </div>
    </div>
  </div>
</div>
