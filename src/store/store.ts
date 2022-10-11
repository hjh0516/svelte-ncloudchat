import { writable } from "svelte/store";
import type { User } from "$lib/types/type";

export const store = writable({
  tabItems: ["My 채팅", "오픈 채팅"],
  activeItem: "My 채팅",
  user: {} as User,
  token: "",
});
