import { store } from "$store/store";
import { get } from "svelte/store";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export async function apiGetUser() {
  const response = await fetch(`${API_URL}/user`, {
    method: "GET",
    headers: setHeader(),
  });
  return await handleResponse(response);
}

export async function apiUpdateUseChat(use_chat: boolean) {
  const response = await fetch(`${API_URL}/user`, {
    method: "PUT",
    headers: setHeader(),
    body: JSON.stringify({
      use_chat: use_chat,
    }),
  });
  return await handleResponse(response);
}

export async function apiUpdateChatNotification(chat_notification: boolean) {
  const response = await fetch(`${API_URL}/user`, {
    method: "PUT",
    headers: setHeader(),
    body: JSON.stringify({
      chat_notification: chat_notification,
    }),
  });
  return await handleResponse(response);
}

export async function apiGetChannels(
  type: string,
  page: number,
  search_text?: string
) {
  let url = `${API_URL}/channels?type=${type}&page=${page}`;
  if (search_text) {
    url += `&search_text=${search_text}`;
  }
  const response = await fetch(url, {
    method: "GET",
    headers: setHeader(),
  });
  return await handleResponse(response);
}

export async function apiGetChannel(channel_id: string) {
  const response = await fetch(`${API_URL}/channels/${channel_id}`, {
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
  push?: boolean,
  tag?: string
) {
  const response = await fetch(`${API_URL}/channels`, {
    method: "POST",
    headers: setHeader(),
    body: JSON.stringify({
      channel_id: channel_id,
      name: name,
      type: type,
      image_url: image_url,
      link_url: link_url,
      push: push,
      tag: tag,
    }),
  });
  return await handleResponse(response);
}

export async function apiSubscribe(channel_id: string) {
  const response = await fetch(`${API_URL}/channels/subscriptions`, {
    method: "POST",
    headers: setHeader(),
    body: JSON.stringify({
      channel_id: channel_id,
    }),
  });
  return await handleResponse(response);
}

export async function apiUnsubscribe(channel_id: string) {
  const response = await fetch(
    `${API_URL}/channels/subscriptions/${channel_id}`,
    {
      method: "DELETE",
      headers: setHeader(),
    }
  );
  return await handleResponse(response);
}

export async function apiGetMessages(channel_id: string, page: number) {
  const response = await fetch(`${API_URL}/chats/${channel_id}?page=${page}`, {
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
  const response = await fetch(`${API_URL}/chats/${channel_id}`, {
    method: "POST",
    headers: setHeader(),
    body: JSON.stringify({
      type: type,
      message: message,
    }),
  });
  return await handleResponse(response);
}

export async function apiGetChatBans() {
  const response = await fetch(`${API_URL}/chats/bans`, {
    method: "GET",
    headers: setHeader(),
  });
  return await handleResponse(response);
}

export async function apiGetChannelNotification(channel_id: string) {
  const response = await fetch(
    `${API_URL}/channels/notifications/${channel_id}`,
    {
      method: "GET",
      headers: setHeader(),
    }
  );
  return await handleResponse(response);
}

export async function apiCreateChannelNotification(
  channel_id: string,
  notification: boolean
) {
  const response = await fetch(
    `${API_URL}/channels/notifications/${channel_id}`,
    {
      method: "POST",
      headers: setHeader(),
      body: JSON.stringify({
        notification: notification,
      }),
    }
  );
  return await handleResponse(response);
}

export async function apiUpdateChannelNotification(
  channel_id: string,
  notification: boolean
) {
  const response = await fetch(
    `${API_URL}/channels/notifications/${channel_id}`,
    {
      method: "PUT",
      headers: setHeader(),
      body: JSON.stringify({
        notification: notification,
      }),
    }
  );
  return await handleResponse(response);
}

export async function apiDeleteChannelNotification(channel_id: string) {
  const response = await fetch(
    `${API_URL}/channels/notifications/${channel_id}`,
    {
      method: "DELETE",
      headers: setHeader(),
    }
  );
  return await handleResponse(response);
}

export async function apiCreateChatRead(channel_id: string) {
  const response = await fetch(`${API_URL}/chats/reads/${channel_id}`, {
    method: "POST",
    headers: setHeader(),
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
    console.log(res.message);
  }
}
