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
  message?: string,
  file?: any
) {
  let headers = setHeader();
  let body: any;

  if (type === "text") {
    body = JSON.stringify({
      type: type,
      message: message,
    });
  } else if (type === "image") {
    delete headers["Content-Type"];

    const formData = new FormData();
    formData.append("type", "file");
    formData.append("file", file);

    body = formData;
  }

  const response = await fetch(`${API_URL}/chats/${channel_id}`, {
    method: "POST",
    headers: headers,
    body: body,
  });
  return await handleResponse(response);
}

export async function apiGetChannelBans() {
  const response = await fetch(`${API_URL}/channels/bans`, {
    method: "GET",
    headers: setHeader(),
  });
  return await handleResponse(response);
}

export async function apiCreateChannelBans(target: number) {
  const response = await fetch(`${API_URL}/channels/bans`, {
    method: "POST",
    headers: setHeader(),
    body: JSON.stringify({
      target: target,
    }),
  });
  return await handleResponse(response);
}

export async function apiDeleteChannelBans(target: number) {
  const response = await fetch(`${API_URL}/channels/bans/${target}`, {
    method: "DELETE",
    headers: setHeader(),
  });
  return await handleResponse(response);
}

export async function apiGetChatBans(channel_id: string) {
  const response = await fetch(`${API_URL}/chats/bans/${channel_id}`, {
    method: "GET",
    headers: setHeader(),
  });
  return await handleResponse(response);
}

export async function apiCreateChatBans(channel_id: string, target: number) {
  const response = await fetch(`${API_URL}/chats/bans/${channel_id}`, {
    method: "POST",
    headers: setHeader(),
    body: JSON.stringify({
      target: target,
    }),
  });
  return await handleResponse(response);
}

export async function apiDeleteChatBans(channel_id: string, target: number) {
  const response = await fetch(
    `${API_URL}/chats/bans/${channel_id}/${target}`,
    {
      method: "DELETE",
      headers: setHeader(),
    }
  );
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

export async function apiUploadChannelImage(file: any) {
  let headers = setHeader();
  delete headers["Content-Type"];

  const formData = new FormData();
  formData.append("type", "file");
  formData.append("file", file);

  const response = await fetch(`${API_URL}/file/channel`, {
    method: "POST",
    headers: headers,
    body: formData,
  });
  return await handleResponse(response);
}

export async function apiGetEmoticonOrders() {
  const response = await fetch(`${API_URL}/emoticons/orders`, {
    method: "GET",
    headers: setHeader(),
  });
  return await handleResponse(response);
}

export async function apiSendPush(channe_id: string, message: string) {
  const response = await fetch(`${API_URL}/channels/push/${channe_id}`, {
    method: "POST",
    headers: setHeader(),
    body: JSON.stringify({
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
    throw new Error(res.message);
  }
}
