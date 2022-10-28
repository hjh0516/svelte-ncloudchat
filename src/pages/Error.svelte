<script lang="ts">
  function home() {
    location.href = "/#/home";
  }
</script>

<div
  class="w-full h-[40rem] flex flex-col items-center justify-center text-center"
>
  <span class="font-sbaggrom text-xl mb-5"
    >오류가 발생했습니다!<br />관리자에게 문의해주세요.</span
  >
  <button class="w-40 h-10 bg-gray-700 text-gray-100 rounded-xl" on:click={home}
    >홈으로 돌아가기</button
  >
</div>
