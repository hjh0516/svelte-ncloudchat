<script lang="ts">
  import { user } from "../store/store";
  import { connect, initialize } from "../lib/NcloudChat";

  let id: string;
  let name: string;

  async function login() {
    if (!id || !name) {
      return;
    }

    initialize();
    await connect(id, name);
    user.set({ id: id, name: id });

    location.href = "/#/home";
  }
</script>

<div
  class="w-full h-screen bg-gray-100 flex flex-col justify-center items-center"
>
  <div class="mb-14">
    <span class="text-cyan-500 font-bold text-3xl drop-shadow-md"
      >이모만세 - 채팅 로그인</span
    >
  </div>
  <div class="mb-5 ml-10">
    <span class="text-cyan-500 font-bold text-2xl drop-shadow-md">ID</span>
    <input
      class="h-10 border border-gray-50 rounded-md ml-5 pl-2 pr-2 shadow-md focus:outline-none"
      type="text"
      placeholder="ID"
      bind:value={id}
    />
  </div>
  <div class="mb-10">
    <span class="text-cyan-500 font-bold text-2xl drop-shadow-md">NAME</span>
    <input
      class="h-10 border border-gray-50 rounded-md ml-5 pl-2 pr-2 shadow-md focus:outline-none"
      type="text"
      placeholder="NAME"
      bind:value={name}
    />
  </div>
  <button
    on:click={login}
    class="bg-cyan-500 w-28 h-10 rounded-md text-gray-50 font-bold shadow-md hover:bg-cyan-400"
    >로그인</button
  >
</div>
