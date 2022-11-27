let isMobile = {
  Android: () => {
    return navigator.userAgent.match(/Android/i) !== null ? true : false;
  },
  iOS: () => {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i) !== null
      ? true
      : false;
  },
  any: () => {
    return isMobile.Android() || isMobile.iOS();
  },
};

function godetail() {
  if (isMobile.Android() && window.emoApp) {
    location.href = "godetail://";
  } else if (isMobile.iOS()) {
    location.href = "godetail://";
  }
}

function gohome() {
  if (isMobile.Android() && window.emoApp) {
       location.href = "gohome://";
  } else if (isMobile.iOS()) {
    location.href = "gohome://";
  }
}

function goemoticon() {
  if (isMobile.Android() && window.emoApp) {
    location.href = "goemoticon://";
  }else if (isMobile.iOS()) {
    location.href = "goemoticon://";
  }
}

function showsetting() {
  window.setShowSettingModal(true);
}

function goback() {
  const chatRoom = document.getElementById("chatRoom");
  const myChat = document.getElementById("myChat");
  const chatListSetting = document.getElementById("chatListSetting");
  const chatMaking = document.getElementById("chatMaking");
  const openChat = document.getElementById("openChat");
  const imgDetail = document.getElementById("imgDetail");
  const chatRoomSetting = document.getElementById("chatRoomSetting");
  const exitRoom = document.getElementById("exitRoom");
  const chatShare = document.getElementById("chatShare");
  const userInfo = document.getElementById("userInfo2");
  const roomInfo = document.getElementById("roomInfo");

  if (chatRoom && !imgDetail && !chatRoomSetting && !exitRoom && !chatShare && !userInfo) {
    gohome();
  } else if (
    (myChat || openChat) &&
    !chatRoomSetting &&
    !chatListSetting &&
    !chatMaking &&
    !roomInfo
  ) {
    
    if (isMobile.Android() && window.emoApp) {
      location.href = "gomain://";
    }
    return;
  }

  if (document.referrerm) {
    history.back();
  } else if (!imgDetail & !chatRoomSetting & !exitRoom & !chatShare & !userInfo) {
    location.href = `/#/home`;
  } else {
    history.back();
  }
}

function getchannelidx() {
  const store = JSON.parse(window.sessionStorage.getItem("store"));
  return store.channel ? store.channel.idx : null;
}

function gochannel(channel_id) {
  location.href = `/#/chat/${channel_id}`;
}
