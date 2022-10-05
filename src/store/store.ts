import { writable } from "svelte/store";
import type { MemberType } from "../lib/types/MemberType";

export const tabItems = writable(["My 채팅", "오픈 채팅"]);
export const activeItem = writable("My 채팅");
export const user = writable<MemberType>();
