<script lang="ts">
  import { token, user } from "$store/store";
  import { connect, initialize } from "$lib/NcloudChat";
  import { apiGetUser } from "$lib/api";

  let tokenValue: string;
  token.subscribe((value) => {
    tokenValue = value;
  });

  async function _login() {
    if (!tokenValue) {
      return;
    }

    token.set(tokenValue);

    try {
      const userInfo = await apiGetUser();
      const id = "chat_" + userInfo.idx;

      initialize();
      await connect(id, userInfo.nickname, userInfo.profile);
      user.set({ id: userInfo.idx, name: userInfo.nickname });

      location.href = "/#/home";
    } catch (err) {
      console.error(err);
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
      bind:value={tokenValue}
    />
  </div>
  <button
    on:click={async () => await _login()}
    class="bg-cyan-500 w-28 h-10 rounded-md text-gray-50 font-bold shadow-md hover:bg-cyan-400"
    >로그인</button
  >
</div>
