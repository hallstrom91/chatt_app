import { useState, useEffect, useCallback } from "react";
import { useAuth, useMessage } from "@hooks/useContextHooks";
import Cookies from "js-cookie";
import useLocalStorage from "./useLocalStorage";

export function useUnreadMessages() {
  const { user, jwtToken } = useAuth();
  const token = Cookies.get("token");
  const { fetchMessages, messages, fetchConversation } = useMessage();
  const [unreadMessages, setUnreadMessages] = useLocalStorage(
    `${user?.id}_unread`,
    {}
  );

  // fetch unread messages function
  const fetchUnreadMessages = useCallback(async () => {
    console.log("FetchUnreadMsg Callback - hook");
    // request messages -> remove?
    /* await fetchMessages(); */

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
    fetchedConversations.forEach((conversation) => {
      if (conversation.length === 0) return;

      // get latest msg and filter
      const lastMessage = conversation[conversation.length - 1];
      const userMessages = conversation.filter((msg) => msg.userId === user.id);

      if (userMessages.length === 0) return;

      const userLastMessage = userMessages[userMessages.length - 1];
      if (!userLastMessage) return;

      if (lastMessage.userId === user.id) {
        updateUnreadMessages[lastMessage.conversationId] = 0;
      } else {
        const newMessageCount = conversation.filter(
          (msg) =>
            new Date(msg.createdAt) > new Date(userLastMessage.createdAt) &&
            msg.userId !== user.id
        ).length;

        if (newMessageCount > 0) {
          updateUnreadMessages[lastMessage.conversationId] = newMessageCount;
        }
      }
    });
    setUnreadMessages((prev) => ({
      ...prev,
      ...updateUnreadMessages,
    }));
  }, []);

  useEffect(() => {
    // if user && jwtToken run at mount
    if (user && token) {
      fetchUnreadMessages();

      let isFetching = false;

      // repeat at interval 60-180s
      const interval = setInterval(() => {
        if (user && token && !isFetching) {
          console.log("Interval Unread - 60s");
          isFetching = true;
          fetchMessages();
          fetchUnreadMessages().finally(() => (isFetching = false));
        }
      }, 60000); // now 60s

      return () => clearInterval(interval); // clear interval
    }
  }, [user, token]);

  return unreadMessages;
}
