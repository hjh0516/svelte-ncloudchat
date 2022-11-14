<script lang="ts">
  import type { Channel } from "$lib/types/type";

  import { store } from "$store/store";
  import { apiGetChannel } from "$lib/api";

  export let channel_id: string;
  export let showSettingModal = false;

  let channel: Channel;

  function previousPage() {
    location.href = "/#/home";
    gohome();
  }

  async function getChannel() {
    try {
      channel = await apiGetChannel(channel_id);
      $store.channel = channel;
      window.sessionStorage.setItem("store", JSON.stringify($store));
    } catch (err) {
      console.error(err);
    }
  }
</script>

<div class="chat_header">
  <div class="inner">
    <div class="left menu">
      <!-- svelte-ignore a11y-missing-attribute -->
      <a class="svg" on:click={previousPage}>메뉴 버튼</a>
    </div>
    <div class="r_title">
      {#await getChannel() then}
        <h2 class="aggro">{channel.name}</h2>
      {/await}
    </div>
    <div class="right">
      <div class="settings">
        <!-- svelte-ignore a11y-missing-attribute -->
        <a class="svg" on:click={() => (showSettingModal = true)}>설정</a>
      </div>
      <!-- <div class="alarm"> -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <!-- <a class="svg new">알람 보기</a>
      </div> -->
    </div>
  </div>
</div>
