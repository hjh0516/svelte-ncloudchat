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
  alert("godetail");
  if (isMobile.any()) {
    if (isMobile.Android()) {
      window.emoApp.godetail();
    } else if (isMobile.iOS()) {
      webkit.messageHandlers.godetail.postMessage();
    }
  }
}

function gohome() {
  alert("gohome");
  if (isMobile.any()) {
    if (isMobile.Android()) {
      window.emoApp.gohome();
    } else if (isMobile.iOS()) {
      webkit.messageHandlers.gohome.postMessage();
    }
  }
}

function showsetting() {
  alert("showsetting");
  showSettingModal = true;
}
