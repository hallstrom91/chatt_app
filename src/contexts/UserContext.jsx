import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "@hooks/useContextHooks";
import useLocalStorage from "@hooks/useLocalStorage";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const { user, jwtToken, logout } = useAuth();
  const [userList, setUserList] = useState([]);
  const [invites, setInvites] = useState([]);

  const [ignoredInvites, setIgnoredInvites] = useLocalStorage(
    user ? `${user.id}_ignoredInvites` : null,
    []
  );
  const [acceptedInvites, setAcceptedInvites] = useLocalStorage(
    user ? `${user.id}_acceptedInvites` : null,
    []
  );

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
      console.error("Failed to fetch list of all users:", error);
    }
  };

  // fetch specific user by ID
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
      return data;
    } catch (error) {
      console.error("Failed to fetch user by id:", error);
    }
  };

  // update user account info
  const updateUser = async (userId, updateData) => {
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId, updatedData: updateData }),
      });
      const data = await response.json();
      console.log("updated user success", data);
      return data;
    } catch (error) {
      console.error(`Failed to update user ${userId}:`, error);
    }
  };

  // delete user account
  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        logout();
      }
    } catch (error) {
      console.error(`Failed to delete user ${userId}:`, error);
    }
  };

  // Invite Manager

  // display invites sent to user
  const fetchUserInvites = async (userId) => {
    const userDataArray = await fetchUserById(userId);
    if (userDataArray && userDataArray.length > 0) {
      const userData = userDataArray[0];
      if (userData && userData.invite) {
        try {
          const parsedInvites = JSON.parse(userData.invite);
          setInvites(parsedInvites);
        } catch (error) {
          console.error("Failed to parse invites:", error);
          console.info("Raw invite data:", userData.invite);
        }
      }
    }
  };

  // accept invite functions

  const handleAcceptInvite = (conversationId) => {
    const updatedAcceptedInvites = [...acceptedInvites, conversationId];
    setAcceptedInvites(updatedAcceptedInvites);
  };

  const handleIgnoreInvite = (conversationId) => {
    const updatedIgnoredInvites = [...ignoredInvites, conversationId];
    setIgnoredInvites(updatedIgnoredInvites);
  };

  // export values
  const value = {
    userList,
    invites,
    ignoredInvites,
    setIgnoredInvites,
    acceptedInvites,
    setAcceptedInvites,
    handleAcceptInvite,
    handleIgnoreInvite,
    fetchUserInvites,
    fetchAllUsers,
    fetchUserById,
    updateUser,
    deleteUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
