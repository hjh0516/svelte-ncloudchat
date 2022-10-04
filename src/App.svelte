<script lang="ts">
  import Chat from "./pages/Chat.svelte";
  import Home from "./pages/Home.svelte";
  import Router from "svelte-spa-router";

  const routes = {
    "/": Home,
    "/chat/:id": Chat,
  };
</script>

<main>
  <Router {routes} />
</main>
