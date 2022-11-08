export let isMobile = {
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

export function godetail() {
  alert("godetail");
  if (isMobile.any()) {
    if (isMobile.Android()) {
      android.emoApp.godetail();
    } else if (isMobile.iOS()) {
      webkit.messageHandlers.godetail.postMessage();
    }
  }
}

export function gohome() {
  alert("gohome");
  if (isMobile.any()) {
    if (isMobile.Android()) {
      android.emoApp.gohome();
    } else if (isMobile.iOS()) {
      webkit.messageHandlers.gohome.postMessage();
    }
  }
}

export function showSetting() {
  alert("showSetting");
  showSettingModal = true;
}
