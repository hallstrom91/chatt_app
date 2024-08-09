import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "@hooks/useContextHooks";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const API_URL = "https://chatify-api.up.railway.app";
  const { user, jwtToken, logout } = useAuth();
  const [userList, setUserList] = useState([]);
  const [invites, setInvites] = useState([]);
  const [ignoredInvites, setIgnoredInvites] = useState([]);
  const [acceptedInvites, setAcceptedInvites] = useState([]);

  useEffect(() => {
    // collect at mount if user/jwtToken
    if (user && jwtToken) {
      console.log("useEffect in usercontext");
      fetchAllUsers();
      // get declined invites for signed in user
      const storedIgnoredInvites =
        JSON.parse(localStorage.getItem(`${user.id}_ignoredInvites`)) || [];
      setIgnoredInvites(storedIgnoredInvites);

      // get accepted invites for signed in user
      const storedAcceptedInvites =
        JSON.parse(localStorage.getItem(`${user.id}_acceptedInvites`)) || [];
      setAcceptedInvites(storedAcceptedInvites);
      // fetch invites
      fetchUserInvites(user.id);
    }

    // check for new invites with interval
    const interval = setInterval(() => {
      if (user & jwtToken) {
        console.log("Check for new invites inteval = 3min.");
        fetchUserInvites(user.id);
      }
    }, 180000); // 180s - 3min

    return () => clearInterval(interval);
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

  // accept invite function
  const handleAcceptInvite = (conversationId) => {
    const updatedAcceptedInvites = [...acceptedInvites, conversationId];
    setAcceptedInvites(updatedAcceptedInvites);
    localStorage.setItem(
      `${user.id}_acceptedInvites`,
      JSON.stringify(updatedAcceptedInvites)
    );
  };

  // decline invite function
  const handleIgnoreInvite = (conversationId) => {
    const updateIgnoredInvites = [...ignoredInvites, conversationId];
    setIgnoredInvites(updateIgnoredInvites);
    localStorage.setItem(
      `${user.id}_ignoredInvites`,
      JSON.stringify(updateIgnoredInvites)
    );
  };

  // export values
  const value = {
    userList,
    invites,
    ignoredInvites,
    acceptedInvites,
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
