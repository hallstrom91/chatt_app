import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "@hooks/useContextHooks";
import useLocalStorage from "@hooks/useLocalStorage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { user, jwtToken, logout } = useAuth();
  const [userList, setUserList] = useState([]);
  const [invites, setInvites] = useState([]);

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
      Sentry.captureException(error);
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
      Sentry.captureException(error);
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
      return data;
    } catch (error) {
      Sentry.captureException(error);
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
      Sentry.captureException(error);
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
          Sentry.captureException(error);
        }
      }
    }
  };

  // function to remove accepted or ignored invite.
  const removeUserInvite = async (conversationId) => {
    // filter out the selected invite for removal
    const updatedInvites = invites.filter(
      (invite) => invite.conversationId !== conversationId
    );
    // update state
    setInvites(updatedInvites);
    // send updated invite-data to API
    const updateData = { invite: JSON.stringify(updatedInvites) };
    await updateUser(user.id, updateData);
  };

  // function to handle invites, accept / ignore and remove invite from API.
  const handleInviteResponse = async (conversationId) => {
    await removeUserInvite(conversationId);
  };

  // export values
  const value = {
    userList,
    invites,
    fetchUserInvites,
    handleInviteResponse,
    fetchAllUsers,
    fetchUserById,
    updateUser,
    deleteUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
