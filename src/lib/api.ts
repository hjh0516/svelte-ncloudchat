import { store } from "$store/store";
import { get } from "svelte/store";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export async function apiGetUser() {
  const response = await fetch(API_URL + "user", {
    method: "GET",
    headers: setHeader(),
  });
  return await handleResponse(response);
}

export async function apiGetChannels(type: string, page: number) {
  const response = await fetch(API_URL + `channels?type=${type}&page=${page}`, {
    method: "GET",
    headers: setHeader(),
  });
  return await handleResponse(response);
}

export async function apiCreateChannel(
  channel_id: string,
  name: string,
  type: string,
  image_url?: string,
  link_url?: string,
  push?: boolean
) {
  const response = await fetch(API_URL + `channels`, {
    method: "POST",
    headers: setHeader(),
    body: JSON.stringify({
      channel_id: channel_id,
      name: name,
      type: type,
      image_url: image_url,
      link_url: link_url,
      push: push,
    }),
  });
  return await handleResponse(response);
}

export async function apiSubscribe(channel_idx: number) {
  const response = await fetch(API_URL + `channels/subscriptions`, {
    method: "POST",
    headers: setHeader(),
    body: JSON.stringify({
      channel_idx: channel_idx,
    }),
  });
  return await handleResponse(response);
}

export async function apiGetMessages(channel_id: string, page: number) {
  const response = await fetch(API_URL + `chats/${channel_id}?page=${page}`, {
    method: "GET",
    headers: setHeader(),
  });
  return await handleResponse(response);
}

export async function apiCreateMessage(
  channel_id: string,
  type: string,
  message: string
) {
  const response = await fetch(API_URL + `chats/${channel_id}`, {
    method: "POST",
    headers: setHeader(),
    body: JSON.stringify({
      type: type,
      message: message,
    }),
  });
  return await handleResponse(response);
}

function setHeader() {
  return {
    Authorization: `Bearer ${get(store).token.trim()}`,
    "X-Authorization": API_KEY,
    "Content-Type": "application/json",
  };
}

async function handleResponse(response: Response) {
  const res = await response.json();

  if (res.code === 0) {
    return res.data;
  } else {
    throw new Error(JSON.stringify(res));
  }
}
