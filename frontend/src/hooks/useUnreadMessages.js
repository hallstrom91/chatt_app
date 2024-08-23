import { useState, useEffect, useCallback } from "react";
import { useAuth, useMessage, useUser } from "@hooks/useContextHooks";
import Cookies from "js-cookie";
import useLocalStorage from "./useLocalStorage";
import useSessionStorage from "./useSessionStorage";

export const useUnreadMessages = () => {
  const { user } = useAuth();
  const { fetchMessages, fetchConversation } = useMessage();
  const { fetchUserById } = useUser();
  const token = Cookies.get("token");
  const keyForUnreadMsg = user ? `${user.id}_unread` : "unread";

  const [unreadMessages, setUnreadMessages] = useLocalStorage(
    keyForUnreadMsg,
    {}
  );

  // fetch unread messages function
  const fetchUnreadMessages = useCallback(async () => {
    // get all messages
    const messages = await fetchMessages();

    // collect unique conId's
    const conversationIds = Array.from(
      new Set(messages.map((message) => message.conversationId))
    );
    // fetch all conversations with the unique conId
    const fetchedConversations = await Promise.all(
      conversationIds.map((conversationId) => fetchConversation(conversationId))
    );

    // object to hold values
    const updateUnreadMessages = {};

    // control each conversation
    await Promise.all(
      fetchedConversations.map(async (conversation) => {
        if (conversation.length === 0) return;

        // get latest msg
        const lastMessage = conversation[conversation.length - 1];

        // filter out msg sent by user
        const userMessages = conversation.filter(
          (msg) => msg.userId === user.id
        );
        if (userMessages.length === 0) return;

        // get last message from user
        const userLastMessage = userMessages[userMessages.length - 1];
        if (!userLastMessage) return;

        // if last message is from user, set count to 0
        if (lastMessage.userId === user.id) {
          updateUnreadMessages[lastMessage.conversationId] = 0;
        } else {
          // else count number of new messages since last message by user
          const newMessageCount = conversation.filter(
            (msg) =>
              new Date(msg.createdAt) > new Date(userLastMessage.createdAt) &&
              msg.userId !== user.id
          ).length;

          if (newMessageCount > 0) {
            const messageFromUserArray = await fetchUserById(
              lastMessage.userId
            );
            const messageFromUser = messageFromUserArray[0];
            // add more values to object about latest msg
            updateUnreadMessages[lastMessage.conversationId] = {
              count: newMessageCount,
              lastMessage,
              username: messageFromUser?.username || "Borttagen användare",
              userAvatar: messageFromUser?.avatar,
            };
          }
        }
      })
    );

    setUnreadMessages((prev) => ({
      ...prev,
      ...updateUnreadMessages,
    }));
  }, [user, setUnreadMessages]);

  useEffect(() => {
    // if user && jwtToken run at mount
    if (user && token) {
      fetchUnreadMessages();
    }

    // repeat at interval 60-180s
    const interval = setInterval(() => {
      if (user && token) {
        fetchUnreadMessages();
      }
    }, 60000); // now 60s

    return () => clearInterval(interval); // clear interval
  }, [user, token]);

  return unreadMessages;
};
