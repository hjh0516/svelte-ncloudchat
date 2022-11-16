<script lang="ts">
  import Router from "svelte-spa-router";
  import Login from "./pages/Login.svelte";
  import Home from "./pages/Home.svelte";
  import Chat from "./pages/Chat.svelte";
  import Error from "$pages/Error.svelte";
  import LoginTemp from "$pages/LoginTemp.svelte";
  import Notifications from "svelte-notifications";
  import CustomNotification from "$components/CustomNotification.svelte";
  import { onMount } from "svelte";
  import { store } from "$store/store";
  import { connect, initialize, isConnected } from "$lib/NcloudChat";

  const routes = {
    "/": LoginTemp,
    "/login": Login,
    "/home": Home,
    "/chat/:id": Chat,
    "/error": Error,
  };

  let vh = 0;

  onMount(() => {
    vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    let session = window.sessionStorage.getItem("store");
    if (session) {
      $store = JSON.parse(session);

      if (!isConnected()) {
        const id = `chat_${$store.user.id}`;

        initialize();
        connect(id, $store.user.name, $store.user.profile);
      }

      if (location.href === "/") {
        location.href = "/#/home";
      }
    }
  });
</script>

<svelte:head>
  <script src="/app.js"></script>
</svelte:head>

<Notifications item={CustomNotification} zIndex="150">
  <Router {routes} />
</Notifications>
