<script lang="ts">
  import type { Channel } from "$lib/types/type";

  import Spinner from "$components/Spinner.svelte";
  import { onMount } from "svelte";
  import { querystring } from "svelte-spa-router";
  import { store } from "$store/store";
  import {
    connect,
    createChannel,
    initialize,
    subscribe,
  } from "$lib/NcloudChat";
  import {
    apiCreateChannel,
    apiCreateChannelNotification,
    apiGetChannel,
    apiGetPrivateChannel,
    apiGetUser,
    apiSubscribe,
  } from "$lib/api";

  let user: any;
  let loading = false;
  let id: string;
  let channel: Channel;

  onMount(async () => {
    const params = new URLSearchParams($querystring);
    if (!params.has("token")) {
      location.href = $store.token ? "/#/home" : "/#/error";
      return;
    }

    $store.token = params.get("token");

    try {
      user = await apiGetUser();
      id = "chat_" + user.idx;

      $store.user = {
        id: user.idx,
        name: user.nickname,
        profile: user.profile,
        level: user.level,
        use_chat: user.use_chat,
        chat_notification: user.chat_notification,
      };

      window.sessionStorage.setItem("store", JSON.stringify($store));
    } catch (err) {
      location.href = "/#/error";
      return;
    }

    try {
      initialize();
      await connect(id, user.nickname, user.profile);
      if (
        params.has("privatechat") &&
        params.has("user_idx") &&
        params.get("privatechat") === "true"
      ) {
        await createPrivateChannel(Number(params.get("user_idx")));
      } else if (
        params.has("openchat") &&
        params.has("channel_id") &&
        params.get("openchat") === "true"
      ) {
        await goOpenChat(params.get("channel_id"));
      } else {
        location.href = "/#/home";
        gohome();
      }
    } catch (err) {
      console.log(err);
      return;
    }
  });

  async function createPrivateChannel(user_idx: number) {
    if (!user_idx) {
      return;
    }

    loading = true;
    try {
      const channel = await apiGetPrivateChannel(user_idx);
      if (channel) {
        location.href = `/#/chat/${channel.channel_id}`;
        godetail();
        return;
      }
      const privateChannel = await createChannel(
        `private_channel_${$store.user.id}`
      );
      await apiCreateChannel(
        privateChannel.id,
        privateChannel.name,
        "PRIVATE",
        privateChannel.image_url,
        privateChannel.link_url,
        privateChannel.push
      );
      await apiCreateChannelNotification(privateChannel.id, true);
      await apiCreateChannelNotification(privateChannel.id, true, user_idx);
      await apiSubscribe(privateChannel.id);
      await apiSubscribe(privateChannel.id, user_idx);

      await subscribe(privateChannel.id);
      location.href = `/#/chat/${privateChannel.id}?token=${$store.token}`;
      godetail();
    } catch (err) {
      console.error(err);
    }
    loading = false;
  }

  async function goOpenChat(channel_id: string) {
    if (!channel_id) {
      return;
    }

    channel = await apiGetChannel(channel_id);
    const find = channel.subscriptions.findIndex(
      (x) => x.user_idx === Number($store.user.id)
    );

    if (find !== -1) {
      location.href = `/#/chat/${channel_id}`;
      return;
    }

    $store.activeItem = "오픈 채팅";
    window.sessionStorage.setItem("store", JSON.stringify($store));
    location.href = `/#/home?channel_id=${channel_id}`;
  }
</script>

<div
  class="fixed top-0 left-0 w-full h-full bg-gray-400 bg-opacity-10"
  style="z-index: 200;"
>
  <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <Spinner />
  </div>
</div>
<div
  class="bg-gray-50 flex justify-center items-center text-center pt-32"
  style="height: calc(var(--vh, 1vh) * 100)"
>
  <span class="aggro" style="font-size: 16px;">채팅 접속 중입니다...</span>
</div>

{#if loading}
  <div
    class="fixed top-0 left-0 w-full h-full bg-gray-400 bg-opacity-10"
    style="z-index: 200;"
  >
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Spinner />
    </div>
  </div>
{/if}
