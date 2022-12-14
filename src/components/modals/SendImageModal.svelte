<script lang="ts">
  import type { Content } from "$lib/types/type";

  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import { apiGetContents } from "$lib/api";

  export let uploadImage = (e) => {};
  export let showContentArea = false;
  export let contents: Content[];
  export let showEmojiArea = false;
  export let emojiPath: string;

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");
</script>

<div class="c_mbg block" style="z-index: 150;" on:click={close} />
<div
  id="imgChange"
  class="chat_pop"
  transition:slide={{ delay: 100, duration: 300 }}
>
  <div class="pop_inner">
    <div class="pop_cont" style="margin-top: 0;">
      <form>
        <div class="ipt_area2">
          <ul>
            <li>
              <div
                on:click={async () => {
                  close();
                  const res = await apiGetContents(1);
                  contents = res.data;
                  emojiPath = "";
                  showEmojiArea = false;
                  showContentArea = !showContentArea;
                }}
              >
                내 컨텐츠에서 선택하기
              </div>
            </li>
            <li>
              <label for="camera">
                <input
                  id="camera"
                  type="file"
                  class="sr-only"
                  accept="image/*"
                  capture
                  on:change={(e) => {
                    uploadImage(e);
                    close();
                  }}
                />
                <div>지금 사진 찍어서 등록하기</div>
              </label>
            </li>
            <li>
              <label for="album">
                <input
                  id="album"
                  type="file"
                  class="sr-only"
                  accept="image/*"
                  on:change={(e) => {
                    uploadImage(e);
                    close();
                  }}
                />
                <div>사진첩 사진으로 등록하기</div>
              </label>
            </li>
          </ul>
        </div>
      </form>
    </div>
  </div>
</div>
