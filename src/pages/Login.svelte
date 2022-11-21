<script lang="ts">
  import Spinner from "$components/Spinner.svelte";
  import { store } from "$store/store";
  import { connect, initialize } from "$lib/NcloudChat";
  import { apiGetUser } from "$lib/api";
  import { onMount } from "svelte";
  import { querystring } from "svelte-spa-router";

  let user: any;
  let id: string;

  onMount(async () => {
    const params = new URLSearchParams($querystring);
    if (!params.has("token")) {
      location.href = $store.token ? "/#/home" : "/#/error";
      return;
    }

    $store.token = params.get("token");

    try {
      user = await apiGetUser();
      id = "chat_" + user.idx;

      $store.user = {
        id: user.idx,
        name: user.nickname,
        profile: user.profile,
        level: user.level,
        use_chat: user.use_chat,
        chat_notification: user.chat_notification,
      };

      window.sessionStorage.setItem("store", JSON.stringify($store));
    } catch (err) {
      location.href = "/#/error";
      return;
    }

    try {
      initialize();
      connect(id, user.nickname, user.profile);
      location.href = "/#/home";
    } catch (err) {
      location.href = "/#/error";
      return;
    }
  });
</script>

<div
  class="fixed top-0 left-0 w-full h-full bg-gray-400 bg-opacity-10"
  style="z-index: 200;"
>
  <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <Spinner />
  </div>
</div>
<div class="h-screen bg-gray-50 flex justify-center items-center text-center">
  <span class="aggro" style="font-size: 16px;">채팅 접속 중입니다...</span>
</div>
