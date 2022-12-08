<script lang="ts">
  import FollowItem from "$components/FollowItem.svelte";
  import InfiniteScroll from "$components/InfiniteScroll.svelte";
  import Spinner from "$components/Spinner.svelte";
  import {
    apiCreateChannel,
    apiCreateChannelNotification,
    apiCreateMessage,
    apiGetChannel,
    apiGetFollows,
    apiGetPrivateChannel,
    apiSubscribe,
  } from "$lib/api";
  import { getNotificationsContext } from "svelte-notifications";
  import { store } from "$store/store";
  import { createChannel, sendMessage, subscribe } from "$lib/NcloudChat";

  export let params: any;

  const { addNotification, clearNotifications } = getNotificationsContext();

  let tab = "follower";
  let page = 1;
  let data = [];
  let newData = [];
  let searchText: string;
  let loading = false;
  let checked = [];

  async function loadFollows(searchText?: string) {
    try {
      const res = await apiGetFollows(tab, params.id, page, searchText);
      newData = res.data;
      data = [...data, ...newData];
    } catch (err) {
      console.error(err);
      return;
    }
  }

  async function tabChange(s: string) {
    if (tab !== s) {
      tab = s;
      page = 1;
      data = [];
      checked = [];

      loading = true;
      await loadFollows();
      loading = false;
    }
  }

  async function searchFollows() {
    page = 1;
    data = [];

    loading = true;
    await loadFollows(searchText);
    loading = false;
  }

  function submit() {
    if (!checked.length) {
      return;
    }

    loading = true;
    try {
      checked.forEach(async (user_idx) => {
        let channel_id: string;
        let channel = await apiGetPrivateChannel(user_idx);
        const sharedChannel = await apiGetChannel(params.id);

        if (channel) {
          channel_id = channel.channel_id;
        } else {
          channel = await createChannel(`private_channel_${$store.user.id}`);
          channel_id = channel.id;
          await apiCreateChannel(
            channel_id,
            channel.name,
            "PRIVATE",
            channel.image_url,
            channel.link_url,
            channel.push
          );
          await apiCreateChannelNotification(channel_id, true);
          await apiCreateChannelNotification(channel_id, true, user_idx);
          await apiSubscribe(channel_id);
          await apiSubscribe(channel_id, user_idx);
          await subscribe(channel_id);
        }

        const link = `<a href='${location.protocol}//${location.host}/#/home?channel_id=${params.id}'>${sharedChannel.name}</a>`;
        const message = JSON.stringify({
          user_idx: $store.user.id,
          type: "link",
          content: link,
        });
        await sendMessage(channel_id, "text", message);
        await apiCreateMessage(channel_id, "link", link);

        clearNotifications();
        addNotification({
          text: "1:1 채팅방으로 링크가 공유되었어요.",
          position: "bottom-center",
          removeAfter: 1500,
        });
      });
    } catch (err) {
      console.error(err);
    }
    loading = false;

    setTimeout(() => {
      history.back();
    }, 500);
  }
</script>

<div class="chat_header">
  <div class="inner">
    <div class="left l_prev">
      <a on:click={() => history.back()} class="svg">이전으로</a>
    </div>
    <div class="r_title">
      <h2 class="aggro">초대하기</h2>
    </div>
    <div class="right r_txt">
      <a on:click={submit} class="aggro">확인</a>
    </div>
  </div>
</div>

<div id="sub" class="chatting chat_idx follower">
  <div class="section">
    <div class="size">
      <div class="inner" style="padding: 60px 0 60px;">
        <div class="chat_case">
          <ul class="clear aggro">
            <li>
              <a
                on:click={async () => {
                  await tabChange("follower");
                }}
                class={tab == "follower" ? "on" : ""}
              >
                <span>팔로워</span>
              </a>
            </li>
            <li>
              <a
                on:click={async () => {
                  await tabChange("following");
                }}
                class={tab == "following" ? "on" : ""}
              >
                <span>팔로잉</span>
              </a>
            </li>
          </ul>
        </div>
        <div class="chat_area scrollbar-hide" style="padding-bottom: 20px;">
          <div class="chat_srch">
            <div class="srch_wr ver2">
              <input
                type="text"
                placeholder="검색어"
                bind:value={searchText}
                on:keypress={(e) => {
                  if (e.key === "Enter") {
                    searchFollows();
                  }
                }}
              />
              <input type="button" class="svg" />
            </div>
          </div>
          {#await loadFollows()}
            <div
              class="fixed top-0 left-0 w-full h-full bg-gray-400 bg-opacity-10"
              style="z-index: 200;"
            >
              <div
                class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <Spinner />
              </div>
            </div>
          {:then}
            {#if data.length > 0}
              <div class="open_chat active">
                <div class="chat_list follower_list" style="margin-top: 65px;">
                  <ul>
                    {#each data as item}
                      <li>
                        <FollowItem {item} bind:group={checked} />
                      </li>
                    {/each}
                  </ul>
                </div>
              </div>
              <InfiniteScroll
                hasMore={newData.length > 0}
                threshold={200}
                on:loadMore={async () => {
                  page++;
                  await loadFollows(searchText);
                }}
              />
            {:else if loading == false}
              <div id="openChat" class="none_msg active">
                <div class="tb">
                  <div class="tbc">
                    <div class="msg">
                      <strong class="aggro">검색된 데이터가 없어요!</strong>
                    </div>
                  </div>
                </div>
              </div>
            {/if}
          {/await}
        </div>
      </div>
    </div>
  </div>
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
