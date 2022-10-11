<script lang="ts">
  import Chat from "./pages/Chat.svelte";
  import Home from "./pages/Home.svelte";
  import Login from "./pages/Login.svelte";
  import Router from "svelte-spa-router";
  import { onMount } from "svelte";
  import { store } from "$store/store";
  import { connect, initialize, isConnected } from "$lib/NcloudChat";

  const routes = {
    "/": Login,
    "/home": Home,
    "/chat/:id": Chat,
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
    }
  });
</script>

<Router {routes} />
