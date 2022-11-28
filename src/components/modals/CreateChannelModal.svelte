<script lang="ts">
  import type { Channel } from "$lib/types/type";

  import Spinner from "$components/Spinner.svelte";
  import UploadImageModal from "$components/modals/UploadImageModal.svelte";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { getNotificationsContext } from "svelte-notifications";
  import { store } from "$store/store";
  import { slide } from "svelte/transition";
  import { createChannel, subscribe } from "$lib/NcloudChat";
  import {
    apiCreateChannel,
    apiCreateChannelNotification,
    apiGetChannel,
    apiSubscribe,
    apiUploadChannelImage,
  } from "$lib/api";
  import { drawImage } from "$lib/Image";

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");
  const { addNotification, clearNotifications } = getNotificationsContext();

  export let newChannel: Channel = null;

  let name = "";
  $: nameLen = name.length;

  let tag: string;
  let loading = false;
  let onlyFollowers = false;
  let showUploadImageModal = false;
  let isBack = false;
  let inputName: HTMLElement;
  let inputTag: HTMLElement;
  let canvas: HTMLCanvasElement;
  let defaultImage: HTMLElement;
  let channelImage: any;

  async function submit() {
    if (!name) {
      inputName.focus();
      return;
    }

    if (nameLen > 20) {
      clearNotifications();
      addNotification({
        text: "채팅방 이름은 최대 20자까지 입력할 수 있어요.",
        position: "bottom-center",
        removeAfter: 1500,
      });
      inputName.focus();
      return;
    }

    if (tag) {
      let matches = tag.match(/#[a-z|A-z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|0-9]+/g);

      if (!matches) {
        clearNotifications();
        addNotification({
          text: '"#" 을 포함해서 입력해주세요.',
          position: "bottom-center",
          removeAfter: 1500,
        });
        inputTag.focus();
        return;
      }

      let checkTagLength = false;
      matches.map((v) => {
        if (v.length > 10) {
          checkTagLength = true;
          return;
        }
      });

      if (checkTagLength) {
        clearNotifications();
        addNotification({
          text: "태그는 최대 10자까지 입력할 수 있어요.",
          position: "bottom-center",
          removeAfter: 1500,
        });
        inputTag.focus();
        return;
      }

      if (matches.length > 10) {
        clearNotifications();
        addNotification({
          text: "최대 10개까지 입력할 수 있어요.",
          position: "bottom-center",
          removeAfter: 1500,
        });
        inputTag.focus();
        return;
      }
    }

    loading = true;
    try {
      let fileurl = "";
      if (channelImage) {
        const res = await apiUploadChannelImage(channelImage);
        fileurl = import.meta.env.VITE_CDN_URL + res;
      } else {
        fileurl = $store.user.profile;
      }

      const channel = await createChannel(name, fileurl);
      await apiCreateChannel(
        channel.id,
        channel.name,
        onlyFollowers ? "FOLLOWER" : "PUBLIC",
        channel.image_url,
        channel.link_url,
        channel.push,
        tag
      );
      apiCreateChannelNotification(channel.id, true);
      apiSubscribe(channel.id);
      subscribe(channel.id);

      newChannel = await apiGetChannel(channel.id);
    } catch (err) {
      console.error(err);
    }
    loading = false;
    close();
  }

  async function uploadImage(e) {
    channelImage = e.target.files[0];
    drawImage(canvas, channelImage);
    canvas.classList.remove("hidden");
    defaultImage.classList.add("hidden");
    showUploadImageModal = false;
  }

  function resetImage() {
    channelImage = null;
    canvas.classList.add("hidden");
    defaultImage.classList.remove("hidden");
    showUploadImageModal = false;
  }

  function back() {
    isBack = true;
    close();
  }

  onMount(() => {
    history.pushState(null, "", location.href);
    window.addEventListener("popstate", back);
  });

  onDestroy(() => {
    window.removeEventListener("popstate", back);
    if (!isBack) {
      history.back();
    }
  });
</script>

<div class="c_mbg block" on:click={close} />
<div
  id="chatMaking"
  class="chat_pop"
  transition:slide={{ delay: 100, duration: 300 }}
>
  <div class="pop_inner" style="min-height: 475px;">
    <div class="pop_title">
      <h3 class="aggro">채팅방 만들기</h3>
    </div>
    <div class="pop_cont">
      <div class="img_area">
        <div class="flex justify-center max-h-[99px]">
          <canvas
            class="w-[95px] h-[95px] border-2 border-dashed border-gray-200 rounded-full mb-3 hidden"
            bind:this={canvas}
          />
          <img
            src={$store.user.profile}
            class="w-[95px] h-[95px] border-2 border-dashed border-gray-200 rounded-full mb-3"
            alt="basic_image"
            bind:this={defaultImage}
          />
        </div>
        <div class="file_check">
          <div
            on:click={() => {
              showUploadImageModal = true;
            }}
          >
            수정하기
          </div>
        </div>
      </div>
      <div class="ipt_area">
        <div class="ipt_box1 chat_name">
          <input
            type="text"
            placeholder="채팅방 이름을 입력해주세요. (20자)"
            bind:this={inputName}
            bind:value={name}
          />
        </div>
        <div class="ipt_box1 chat_hash">
          <input
            type="text"
            placeholder="해시태그로 채팅방을 소개해주세요. (최대 10개)"
            bind:this={inputTag}
            bind:value={tag}
          />
        </div>
        <div class="wrap clear">
          <h4>팔로워만 입장</h4>
          <div class="check_box check_box1">
            <input
              id="only_followers"
              type="checkbox"
              bind:checked={onlyFollowers}
            />
            <label for="only_followers" class="aggro">
              {onlyFollowers ? "ON" : "OFF"}
            </label>
          </div>
        </div>
      </div>
      <div class="btn_area">
        <input
          type="submit"
          class="cBtn {nameLen === 0 ? 'gr2' : ''}"
          value="완료"
          on:click={submit}
        />
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
</div>

{#if showUploadImageModal}
  <UploadImageModal
    {uploadImage}
    {resetImage}
    on:close={() => (showUploadImageModal = false)}
  />
{/if}
