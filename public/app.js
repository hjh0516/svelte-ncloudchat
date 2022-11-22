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
  if (isMobile.Android()) {
    window.emoApp?.godetail();
  } else if (isMobile.iOS()) {
    location.href = "godetail://";
  }
}

function gohome() {
  if (isMobile.Android()) {
    window.emoApp?.gohome();
  } else if (isMobile.iOS()) {
    location.href = "gohome://";
  }
}

function goemoticon() {
  if (isMobile.Android()) {
    window.emoApp?.goemoticon();
  } else if (isMobile.iOS()) {
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

  if (chatRoom && !imgDetail && !chatRoomSetting && !exitRoom && !chatShare) {
    gohome();

  }else if (isMobile.Android() && (myChat || openChat) && !chatRoomSetting && !chatListSetting && !chatMaking) {
    window.emoApp?.goMain();
    return;
  }
  if ( document.referrer ) { 
    history.back();
  } else { 
    location.href = `/#/home`;
  }
}

function getchannelidx() {
  const store = JSON.parse(window.sessionStorage.getItem("store"));
  return store.channel ? store.channel.idx : null;
}

function gochannel(channel_id) {
  location.href = `/#/chat/${channel_id}`;
}
