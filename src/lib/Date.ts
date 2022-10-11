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

function pad(date: number) {
  return date.toString().padStart(2, "0");
}
