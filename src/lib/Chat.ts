import type { Chat } from "$lib/types/type";

import { convertChatDate, convertSendAt } from "./Date";

export function updateChatItems(data: Chat[]) {
  let previous: Chat;
  let result: Chat[] = [];

  for (let [key, item] of Object.entries(data)) {
    item.show_profile = true;
    item.show_nickname = true;
    item.show_date = true;

    if (key === "0") {
      previous = item;
      result.push(item);
      continue;
    }

    const previousDate = new Date(previous.created_at).getDate();
    const itemDate = new Date(item.created_at).getDate();

    if (
      previous.type !== "date" &&
      item.type !== "date" &&
      previousDate !== itemDate
    ) {
      result.push({
        idx: 0,
        user_idx: 0,
        channel_idx: item.channel_idx,
        type: "date",
        message: convertChatDate(previous.created_at),
        created_at: "",
      });
    }

    if (
      item.type !== "date" &&
      previous.user_idx === item.user_idx &&
      convertSendAt(previous.created_at) === convertSendAt(item.created_at)
    ) {
      previous.show_profile = false;
      previous.show_nickname = false;
      item.show_date = false;
    }

    result.push(item);
    previous = item;
  }

  return result;
}
