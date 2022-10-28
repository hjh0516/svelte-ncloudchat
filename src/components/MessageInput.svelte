<script lang="ts">
  export let input = "";
  export let send = () => {};
</script>

<div
  class="w-full h-14 bg-white fixed bottom-0 flex justify-center items-center"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    class="w-10 h-10 ml-2 hover:text-gray-500"
    style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0)"
  >
    <path
      fill-rule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
      clip-rule="evenodd"
    />
  </svg>

  <div
    class="w-full h-10 border border-gray-200 rounded-2xl m-2 flex items-center focus-within:border-cyan-500"
  >
    <input
      class="w-full h-7 ml-3 mr-1 pl-1 pr-1 focus:outline-none"
      type="text"
      bind:value={input}
    />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      class="w-10 h-10 text-gray-400 hover:text-gray-300"
      style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0)"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
      />
    </svg>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="w-10 h-10 mr-1 text-cyan-500 hover:text-cyan-400"
      style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0)"
      on:click={send}
    >
      <path
        fill-rule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm.53 5.47a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l1.72-1.72v5.69a.75.75 0 001.5 0v-5.69l1.72 1.72a.75.75 0 101.06-1.06l-3-3z"
        clip-rule="evenodd"
      />
    </svg>
  </div>
</div>
