const API_URL = "https://chatify-api.up.railway.app";

export const fetchAllMessages = async (jwtToken, conversationId = null) => {
  const url = conversationId
    ? `${API_URL}/messages?conversationId=${conversationId}`
    : `${API_URL}/messages`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${jwtToken}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }
  return await response.json();
};

export const createMessage = async (text, conversationId, jwtToken) => {
  const message = { text, conversationId };
  const response = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${jwtToken}`,
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    throw new Error("Failed to create message");
  }
  return await response.json();
};

export const deleteMessage = async (msgId, jwtToken) => {
  await fetch(`${API_URL}/messages/${msgId}`, {
    method: "DELETE",
    Authorization: `bearer ${jwtToken}`,
  });
};
