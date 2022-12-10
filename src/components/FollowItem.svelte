<script lang="ts">
  export let item: any;
  export let group: any;

  function onChange({ target }) {
    const { value, checked } = target;
    if (checked) {
      group = [...group, value];
    } else {
      group = group.filter((item) => item !== value);
    }
  }
</script>

<div class="box box1">
  <div class="box_cont">
    <div
      class="c_avata back_img"
      style="background-image:url({item.profile_image_url});"
    >
      <img src="../img/img_basic1.png" class="basic_img" />
    </div>
    <div class="txt_box">
      <div class="tb">
        <div class="tbc">
          <div class="info info1">
            <em class="rec">Lv. {item.level}</em>
            <div class="left aggro">{item.nickname}</div>
          </div>
          <div class="info info2">
            <p>팔로우 <span>{item.follow_count}</span>명</p>
          </div>
        </div>
      </div>
    </div>
    <div class="chk_wrap">
      <div class="tb">
        <div class="tbc">
          {#if item.is_subscribe}
            <div class="c_ing">참여중</div>
          {:else}
            <div class="check_box check_box2">
              <input
                type="checkbox"
                id={item.idx}
                value={item.idx}
                checked={group.includes(item.idx)}
                on:change={onChange}
              />
              <label for={item.idx}>선택</label>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
