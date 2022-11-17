<script lang="ts">
  import type { Channel } from "$lib/types/type";

  import { createEventDispatcher } from "svelte";
  import Flicking, { FlickingPanel } from "@egjs/svelte-flicking";
  import "@egjs/svelte-flicking/dist/flicking.css";
  import { convertDate } from "$lib/Date";
  import { apiUpdateChannelNotification } from "$lib/api";

  export let index: number;
  export let item: Channel;

  let flicking: Flicking;

  const dispatch = createEventDispatcher();
  function exit(channelId: string) {
    dispatch("exit", {
      channelId: channelId,
    });
  }

  function clickItem(channel_id: string) {
    location.href = `/#/chat/${channel_id}`;
    location.reload();
    godetail();
  }

  function updateNotification() {
    item.notification = !item.notification;
    try {
      apiUpdateChannelNotification(item.channel_id, item.notification);
    } catch (err) {
      console.error(err);
    }
    flicking.moveTo(0);
  }
</script>

<Flicking
  class="-mt-10 -mb-10 pb-5 -ml-10 pl-10 -mr-10 pr-10 {index === 0
    ? 'pt-10'
    : 'pt-5'}"
  options={{ align: "next", bound: true }}
  bind:this={flicking}
>
  <FlickingPanel class="w-full">
    <div class="box box1" on:click={() => clickItem(item.channel_id)}>
      <div class="box_cont">
        {#if item.image_url}
          <div
            class="c_avata back_img"
            style="background-image: url({item.image_url});"
          >
            <img
              class="basic_img"
              src="img/img_basic1.png"
              alt="channel_image"
            />
          </div>
        {:else}
          <div
            class="c_avata back_img"
            style="background-image: url('img/img_chat_avata1.png');"
          >
            <img
              class="basic_img"
              src="img/img_basic1.png"
              alt="channel_image"
            />
          </div>
        {/if}
        <div class="txt_box">
          <div class="tb">
            <div class="tbc">
              <div class="info">
                <div class="left aggro_M">
                  {item.name}
                  {#if item.type === "PUBLIC" || item.type === "FOLLOWER"}
                    <b class="h_num">({item.subscriptions_count}명)</b>
                  {/if}
                </div>
                <div class="right">
                  {item.last_chat_at
                    ? convertDate(item.last_chat_at)
                    : convertDate(item.created_at)}
                </div>
              </div>
              <div class="cont">
                {#if item.chat_type === "file"}
                  이미지
                {:else if item.message}
                  {item.message.length >= 50
                    ? item.message.substring(0, 50) + "..."
                    : item.message}
                {:else}
                  <br />
                {/if}
                <b class="m_num aggro_M">
                  {item.unread_count ? item.unread_count : 0}
                </b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </FlickingPanel>
  <FlickingPanel class="ml-10">
    <div class="rt_btn clear">
      {#if item.notification}
        <div class="box2 box_alram off" on:click={updateNotification}>
          <!-- svelte-ignore a11y-invalid-attribute -->
          <a href="javascript:;">
            <div class="tb">
              <div class="tbc">
                <span class="ico svg">알림 상태</span>
                <em>알림끄기</em>
              </div>
            </div>
          </a>
        </div>
      {:else}
        <div class="box2 box_alram on" on:click={updateNotification}>
          <!-- svelte-ignore a11y-invalid-attribute -->
          <a href="javascript:;">
            <div class="tb">
              <div class="tbc">
                <span class="ico svg">알림 상태</span>
                <em>알림켜기</em>
              </div>
            </div>
          </a>
        </div>
      {/if}
      <div
        class="box2 box_exit"
        on:click={() => {
          exit(item.channel_id);
          flicking.moveTo(0);
        }}
      >
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a href="javascript:;">
          <div class="tb">
            <div class="tbc">
              <span class="ico svg">나가기</span>
              <em>나가기</em>
            </div>
          </div>
        </a>
      </div>
    </div>
  </FlickingPanel>
</Flicking>
