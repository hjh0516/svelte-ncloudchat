<script lang="ts">
  import FollowItem from "$components/FollowItem.svelte";
  import InfiniteScroll from "$components/InfiniteScroll.svelte";
  import Spinner from "$components/Spinner.svelte";
  import { apiGetFollows } from "$lib/api";

  export let params: any;

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
</script>

<div class="chat_header">
  <div class="inner">
    <div class="left l_prev">
      <a href="javascript:history.back()" class="svg">이전으로</a>
    </div>
    <div class="r_title">
      <h2 class="aggro">초대하기</h2>
    </div>
    <div class="right r_txt">
      <a href="javascript:;" class="aggro">확인</a>
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
          <!-- 오픈채팅 -->
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
                        <FollowItem {item} bind:checked />
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
