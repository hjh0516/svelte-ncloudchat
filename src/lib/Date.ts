export function convertDate(value: string | number | Date) {
  const today = new Date();
  const date = new Date(value);

  if (today.getFullYear() > date.getFullYear()) {
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
  }

  if (today.getDate() > date.getDate()) {
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  }

  const hours = date.getHours();
  const minutes = date.getMinutes();

  if (hours > 12) {
    return `오후 ${pad(hours - 12)}:${pad(minutes)}`;
  } else if (hours === 12) {
    return `오후 ${pad(hours)}:${pad(minutes)}`;
  } else {
    return `오전 ${pad(hours)}:${pad(minutes)}`;
  }
}

export function convertLastChat(value: string) {
  if (!value) {
    return "대화 없음";
  }

  const now = new Date().getTime();
  const lastChat = new Date(value).getTime();

  const diff = now - lastChat;
  const min = Math.round(diff / 1000 / 60);
  const hour = Math.round(diff / 1000 / 60 / 60);
  const day = Math.round(diff / 1000 / 60 / 60 / 24);

  if (hour > 24) {
    return `${day}일 전 대화`;
  } else if (hour > 1) {
    return `${hour}시간 전 대화`;
  } else if (min > 1) {
    return `${min}분 전 대화`;
  } else {
    return `방금 전 대화`;
  }
}

export function convertChatDate(value: string | Date) {
  const date = new Date(value);
  const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAY[date.getDay()];

  return `${year}년 ${month}월 ${day}일 ${weekday}요일`;
}

export function convertSendAt(value: string | Date) {
  const date = new Date(value);

  const hours = date.getHours();
  const minutes = date.getMinutes();

  if (hours > 12) {
    return `오후 ${pad(hours - 12)}:${pad(minutes)}`;
  } else if (hours === 12) {
    return `오후 ${pad(hours)}:${pad(minutes)}`;
  } else {
    return `오전 ${pad(hours)}:${pad(minutes)}`;
  }
}

function pad(date: number) {
  return date.toString().padStart(2, "0");
}
