<script lang="ts">
  export let input = "";
  export let send = () => {};
  export let uploadImage = (e) => {};
</script>

<div class="chat_util2">
  <div class="util_area">
    <div class="req_area">
      <div class="req_wrap">
        <div class="more">
          <input
            id="upload_image"
            type="file"
            class="svg"
            accept=".jpg, .jpeg, .gif, .png"
            on:change={(e) => {
              uploadImage(e);
            }}
          />
        </div>
        <div class="ipt_area">
          <input type="text" bind:value={input} />
          <span class="clear">
            <input type="submit" class="svg" on:click={send} />
          </span>
        </div>
      </div>
    </div>
    <div class="emoge_area">
      <div class="emoge_case ">
        <ul class="scroll">
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 23px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 23px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              class="on"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 23px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 23px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 23px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 23px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 23px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 23px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 23px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 23px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 23px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 23px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 23px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 23px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 23px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 23px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 23px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 23px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 23px;"
            />
          </li>
        </ul>
        <a href="javascript:;" class="go_store svg">이모티콘 스토어</a>
      </div>
      <div class="emoge_list">
        <ul class="scroll clear">
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 44px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              class="on"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 44px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 44px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 44px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 44px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 44px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 44px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 44px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 44px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 44px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 44px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 44px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 44px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 44px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 44px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 44px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 44px;"
            />
          </li>
          <li>
            <a
              href="javascript:;"
              style="background-image:url('../img/ex_img.svg'); background-size:122px 44px;"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
