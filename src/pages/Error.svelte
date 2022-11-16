<script lang="ts">
  function home() {
    location.href = "/#/home";
    gohome();
  }
</script>

<div
  class="w-full  flex flex-col items-center justify-center text-center"
  style="height: calc(var(--vh, 1vh) * 100)"
>
  <span class="font-sbaggrom text-3xl mb-5"
    >오류가 발생했습니다!<br />관리자에게 문의해주세요.</span
  >
  <button
    class="w-40 h-10 bg-gray-700 text-gray-100 rounded-xl text-xl"
    on:click={home}>채팅으로 돌아가기</button
  >
</div>
