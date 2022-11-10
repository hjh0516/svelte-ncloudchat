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
    window.emoApp.godetail();
  } else if (isMobile.iOS()) {
    window.webkit.messageHandlers.godetail.postMessage();
  }
}

function gohome() {
  if (isMobile.Android()) {
    window.emoApp.gohome();
  } else if (isMobile.iOS()) {
    window.webkit.messageHandlers.gohome.postMessage();
  }
}

function showsetting() {
  showSettingModal = true;
}

function goback() {
  history.back();
}
