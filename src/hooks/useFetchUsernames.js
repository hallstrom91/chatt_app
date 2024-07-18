import React, { useState, useEffect } from "react";
import { useUser } from "@hooks/useUser";

export default function useFetchUsernames(messages) {
  const { fetchUserById } = useUser();
  const [usernames, setUsernames] = useState({});

  useEffect(() => {
    const fetchUsernames = async () => {
      const fetchedUsernames = {};
      try {
        await Promise.all(
          messages.map(async (msg) => {
            if (!usernames[msg.userId]) {
              const userFromList = userList.find(
                (user) => user.id === msg.userId
              );
              if (userFromList) {
                fetchedUsernames[msg.userId] = userFromList.username;
              } else {
                const username = await fetchUserById(msg.userId);
                fetchedUsernames[msg.userId] = username;
              }
            }
          })
        );

        setUsernames((prevUsernames) => ({
          ...prevUsernames,
          ...fetchedUsernames,
        }));
      } catch (error) {
        console.error("Failed to fetch usernames", error);
      }
    };
    if (messages.length > 0) {
      fetchUsernames();
    }
  }, [messages]);
  return usernames;
}
