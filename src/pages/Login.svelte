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
      location.href = $store.token ? "/#/home" : "/";
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
      };

      window.sessionStorage.setItem("store", JSON.stringify($store));
    } catch (err) {
      location.href = "/#/error";
      return;
    }

    try {
      initialize();
      await connect(id, user.nickname, user.profile);
      location.href = "/#/home";
    } catch (err) {
      location.href = "/#/error";
      return;
    }
  });
</script>

<div class="fixed top-[calc(50%-4.5rem)] left-[calc(50%-1rem)]">
  <Spinner />
</div>
<div class="h-screen bg-gray-50 flex justify-center items-center text-center">
  <span class="text-cyan-500 text-xl font-bold">채팅 접속 중입니다...</span>
</div>
