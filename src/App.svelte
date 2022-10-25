<script lang="ts">
  import Router from "svelte-spa-router";
  import Login from "./pages/Login.svelte";
  import Home from "./pages/Home.svelte";
  import Chat from "./pages/Chat.svelte";
  import Error from "$pages/Error.svelte";
  import { onMount } from "svelte";
  import { store } from "$store/store";
  import { connect, initialize, isConnected } from "$lib/NcloudChat";

  const routes = {
    "/": Login,
    "/home": Home,
    "/chat/:id": Chat,
    "/error": Error,
  };

  onMount(async () => {
    let session = window.sessionStorage.getItem("store");
    if (session) {
      $store = JSON.parse(session);

      if (!isConnected()) {
        const id = `chat_${$store.user.id}`;

        initialize();
        await connect(id, $store.user.name, $store.user.profile);
      }

      if (location.href === "/") {
        location.href = "/#/home";
      }
    }
  });
</script>

<Router {routes} />
