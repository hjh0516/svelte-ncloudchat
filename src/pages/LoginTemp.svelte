<script lang="ts">
  import { store } from "$store/store";
  import { connect, initialize } from "$lib/NcloudChat";
  import { apiGetUser } from "$lib/api";

  let token: string;
  let user: any;
  let id: string;

  async function login() {
    if (!token) {
      return;
    }

    $store.token = token;

    try {
      user = await apiGetUser();
      id = "chat_" + user.idx;

      $store.token = token;
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
      return;
    }

    try {
      initialize();
      connect(id, user.nickname, user.profile);

      location.href = "/#/home";
    } catch (err) {
      location.href = "/#/error";
      console.error(err);
      return;
    }
  }
</script>

<div
  class="fixed w-full h-full bg-gray-100 flex flex-col justify-center items-center"
>
  <div class="mb-14">
    <span class="text-cyan-500 font-bold text-3xl drop-shadow-md"
      >이모만세 - 채팅 로그인</span
    >
  </div>
  <div class="w-3/4 mb-5">
    <input
      class="w-full h-14 border border-gray-50 rounded-md pl-2 pr-2 shadow-md focus:outline-none"
      type="text"
      placeholder="Access Token을 입력해주세요."
      bind:value={token}
    />
  </div>
  <button
    on:click={login}
    class="bg-cyan-500 w-28 h-10 rounded-md text-gray-50 font-bold shadow-md hover:bg-cyan-400"
    >로그인</button
  >
</div>
