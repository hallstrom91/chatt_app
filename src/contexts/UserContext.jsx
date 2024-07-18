import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "@hooks/useAuth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const API_URL = "https://chatify-api.up.railway.app";
  const { user, jwtToken } = useAuth();
  const [userList, setUserList] = useState([]);
  //remove?
  const [userById, setUserById] = useState([]);

  useEffect(() => {
    if (user && jwtToken) {
      fetchAllUsers();
    }
  }, [user, jwtToken]);

  // fetch all users in app - for friend req etc..
  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setUserList(data);
    } catch (error) {
      console.error("Failed to fetch list of all users", error);
    }
  };

  // fetch specific user
  const fetchUserById = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data.username;
    } catch (error) {
      console.error("Failed to fetch user by id.", error);
      return null;
    }
  };

  // update user info
  const updateUser = async (userId, updateData) => {
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, updateData }),
      });
      return await response.json();
    } catch (error) {
      console.error(`Failed to update user ${userId}`, error);
      return null;
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });
      setUserList((prevUserList) =>
        prevUserList.filter((user) => user.id !== userId)
      );
    } catch (error) {
      console.error(`Failed to delete user ${userId}`, error);
    }
  };

  const value = {
    userList,
    fetchAllUsers,
    fetchUserById,
    updateUser,
    deleteUser,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
