const API_URL = "https://chatify-api.up.railway.app";

export const getAllUsers = async () => {
  const response = await fetch(`${API_URL}/users`, {});
  return await response.json();
};

export const getUserById = async (userId) => {
  const response = await fetch(`${API_URL}/users/${userId}`);
  return await response.json();
};

export const updateUser = async (user) => {
  const response = await fetch(`${API_URL}/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return await response.json();
};

export const deleteUser = async (userId) => {
  await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
  });
};
