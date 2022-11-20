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
    location.href="godetail://";
    // window.webkit?.messageHandlers.godetail.postMessage();
  }
}

function gohome() {
  if (isMobile.Android()) {
    window.emoApp?.gohome();
  } else if (isMobile.iOS()) {
    location.href="gohome://";
    // window.webkit?.messageHandlers.gohome.postMessage();
  }
}

function goemoticon() {
  if (isMobile.Android()) {
    window.emoApp?.goemoticon();
  } else if (isMobile.iOS()) {
    location.href="goemoticon://";
    // window.webkit?.messageHandlers.goemoticon.postMessage();
  }
}

function showsetting() {
  window.setShowSettingModal(true);
}

function goback() {
  if(typeof imgDetail !== "undefined" || typeof roomInfo !== "undefined" ) {
      $('#close').click()
    }else if(typeof roomInfo !== "undefined" ) {
      gohome();
        $('#close').click()
      }else{
      history.back();
    }
}

function getchannelidx() {
  const store = JSON.parse(window.sessionStorage.getItem("store"));
  return store.channel ? store.channel.idx : null;
}

function gochannel(channel_id) {
  location.href = `/#/chat/${channel_id}`;
  location.reload();
  godetail();
}

