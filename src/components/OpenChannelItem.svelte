<script lang="ts">
  import type { Channel } from "$lib/types/type";

  import { checkCreatedNew, convertLastChat } from "$lib/Date";
  import { createEventDispatcher } from "svelte";

  export let item: Channel;

  const dispatch = createEventDispatcher();
  function open(item: Channel) {
    dispatch("open", { item: item });
  }

  function convertTags(tags: any) {
    if (tags.length === 0) {
      return "";
    }

    let taglist = [];
    let tagLen = 0;
    let overflow = "";
    for (let t of tags) {
      tagLen += getBytelength(t.tag);
      if (tagLen > 50) {
        overflow = "...";
        break;
      }
      taglist.push(t.tag);
    }

    return `#${taglist.join(" #")}${overflow}`;
  }

  function getBytelength(str: string) {
    let byte = 0;
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 127) {
        byte += 2;
      } else if (str.charCodeAt(i) > 64 && str.charCodeAt(i) < 91) {
        byte += 2;
      } else {
        byte++;
      }
    }
    return byte;
  }
</script>

<div
  class="box box1 {checkCreatedNew(item.created_at) ? 'newR' : ''}"
  on:click={() => open(item)}
>
  <div class="box_cont">
    {#if item.image_url}
      <div
        class="c_avata back_img"
        style="background-image:url({item.image_url});"
      >
        <img
          src="../img/img_basic1.png"
          class="basic_img"
          alt="channel_image"
        />
      </div>
    {:else}
      <div
        class="c_avata back_img"
        style="background-image:url('../img/img_chat_avata4_1.png');"
      >
        <img
          src="../img/img_basic1.png"
          class="basic_img"
          alt="channel_image"
        />
      </div>
    {/if}
    <div class="txt_box">
      <div class="tb">
        <div class="tbc">
          <div class="info info1">
            <div class="left aggro_M">
              {item.name} <em class="o_num">{item.subscriptions_count}명</em>
            </div>
            <div class="hash_list">
              <ul class="clear">
                <li
                  class="w-full whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  {convertTags(item.tags)}
                </li>
              </ul>
            </div>
          </div>
          <div class="info info2">
            <ul class="clear">
              <li class="r_leader">
                {#if item.profile}
                  <p
                    class="c_avata back_img"
                    style="background-image:url({item.profile});"
                  >
                    <img
                      src="../img/img_basic4.png"
                      class="basic_img"
                      alt="profile_image"
                    />
                  </p>
                {:else}
                  <p
                    class="c_avata back_img"
                    style="background-image:url('../img/img_basic4.png');"
                  >
                    <img
                      src="../img/img_basic4.png"
                      class="basic_img"
                      alt="profile_image"
                    />
                  </p>
                {/if}
                <span class="name">{item.nickname}</span>
              </li>
              <li class="r_time">
                {convertLastChat(item.last_chat_at)}
                {#if item.is_subscription}
                  <span class="r_state">참여중</span>
                {/if}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
