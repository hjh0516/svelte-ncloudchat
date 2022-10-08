import { writable } from "svelte/store";
import type { User } from "$lib/types/type";

export const tabItems = writable(["My 채팅", "오픈 채팅"]);
export const activeItem = writable("My 채팅");
export const user = writable<User>();
export const isConnected = writable(false);
export const token = writable<string>();
