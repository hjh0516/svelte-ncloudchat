import type { Channel, User } from "$lib/types/type";

import { writable } from "svelte/store";

export const store = writable({
  tabItems: ["My 채팅", "오픈 채팅"],
  activeItem: "My 채팅",
  user: {} as User,
  token: "",
  channel: {} as Channel,
});
