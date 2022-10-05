<script lang="ts">
  import Chat from "./pages/Chat.svelte";
  import Home from "./pages/Home.svelte";
  import Router from "svelte-spa-router";
  import Login from "./pages/Login.svelte";

  const routes = {
    "/": Login,
    "/home": Home,
    "/chat/:id": Chat,
  };
</script>

<main>
  <Router {routes} />
</main>
