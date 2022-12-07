<script lang="ts">
  function home() {
    location.replace("/#/home");
  }
</script>

<div
  class="w-full  flex flex-col items-center justify-center text-center"
  style="height: calc(var(--vh, 1vh) * 100)"
>
  <span class="font-sbaggrom text-3xl mb-5" style="font-size: 16px"
    >오류가 발생했습니다!<br />관리자에게 문의해주세요.</span
  >
  <button
    class="w-52 h-12 bg-gray-700 text-gray-100 rounded-2xl text-2xl"
    on:click={home}>채팅으로 돌아가기</button
  >
</div>
