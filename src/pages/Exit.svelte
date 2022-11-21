<script lang="ts">
  import Spinner from "$components/Spinner.svelte";
  import {
    apiCreateUserSubscription,
    apiGetDeletedUserSubscriptions,
  } from "$lib/api";

  export let params: any;

  $: users = [];

  async function getDeletedUserSubscriptions() {
    try {
      users = await apiGetDeletedUserSubscriptions(params.id);
    } catch (err) {
      console.error(err);
    }
  }

  function clear(idx: number) {
    apiCreateUserSubscription(params.id, idx);
    users = users.filter((v) => v.idx !== idx);
  }
</script>

<div id="sendList" class="chat_setting">
  <div class="chat_header">
    <div class="inner">
      <div class="left l_prev">
        <a href="/#/chat/{params.id}" class="svg">이전으로</a>
      </div>
      <div class="r_title">
        <h2 class="aggro">내보내기 목록</h2>
      </div>
    </div>
  </div>

  <div id="sub" class="chatting chat_idx send_list">
    <div class="section">
      <div class="size">
        <div class="inner pt-[60px] pb-[130px]">
          <div class="txt_area mb-[20px]">
            <b class="aggro">방장이 내보낸 대화 상대예요</b>
            <p>
              해제 버튼을 눌러 내보내기를 해제하면<br />
              해당 사용자는 다시 채팅방에 참여할 수 있어요.
            </p>
          </div>
          <div class="chat_area setting_list scrollbar-hide">
            <div class="open_chat active">
              <div class="chat_list2 scroll">
                <ul>
                  {#await getDeletedUserSubscriptions()}
                    <div
                      class="fixed top-0 left-0 w-full h-full bg-gray-400 bg-opacity-20"
                      style="z-index: 200;"
                    >
                      <div
                        class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      >
                        <Spinner />
                      </div>
                    </div>
                  {:then}
                    {#if users.length > 0}
                      {#each users as user}
                        <li>
                          <div class="box">
                            <div class="info_w">
                              <div
                                class="c_avata back_img"
                                style="background-image:url({user.profile});"
                              >
                                <img
                                  src="../img/img_basic2.png"
                                  class="basic_img"
                                  alt="basic_img"
                                />
                              </div>
                              <div class="txt_box">
                                <div class="tb">
                                  <div class="tbc">
                                    <strong class="aggro_M">
                                      {user.nickname}
                                    </strong>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <span
                              class="a_state"
                              on:click={() => clear(user.idx)}>해제</span
                            >
                          </div>
                        </li>
                      {/each}
                    {:else}
                      <div class="text-center">
                        <span class="aggro" style="font-size: 15px;"
                          >내보내진 사용자가 없어요.</span
                        >
                      </div>
                    {/if}
                  {/await}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
