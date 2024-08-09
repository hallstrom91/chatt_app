import { useState, useEffect, useCallback } from "react";
import { useAuth, useMessage } from "@hooks/useContextHooks";

export function useUnreadMessages() {
  const { user, jwtToken } = useAuth();
  const { fetchMessages, messages, fetchConversation } = useMessage();
  const [unreadMessages, setUnreadMessages] = useState({});

  // fetch unread messages function
  const fetchUnreadMessages = async () => {
    await fetchMessages();

    const conversationIds = Array.from(
      new Set(messages.map((message) => message.conversationId))
    );

    const fetchedConversations = await Promise.all(
      conversationIds.map((conversationId) => fetchConversation(conversationId))
    );

    const updateUnreadMessages = {};

    fetchedConversations.forEach((conversation) => {
      if (conversation.length === 0) return;

      const lastMessage = conversation[conversation.length - 1];
      const userMessages = conversation.filter((msg) => msg.userId === user.id);

      if (userMessages.length === 0) return;

      const userLastMessage = userMessages[userMessages.length - 1];
      if (!userLastMessage) return;

      const newMessageCount = conversation.filter(
        (msg) =>
          new Date(msg.createdAt) > new Date(userLastMessage.createdAt) &&
          msg.userId !== user.id
      ).length;

      if (newMessageCount > 0) {
        updateUnreadMessages[lastMessage.conversationId] = newMessageCount;
      }
    });
    setUnreadMessages((prev) => {
      const mergedUnread = { ...prev, ...updateUnreadMessages };
      localStorage.setItem(`${user.id}_unread`, JSON.stringify(mergedUnread));
      return mergedUnread;
    });
  };

  useEffect(() => {
    // if user && jwtToken run at mount
    if (user && jwtToken) {
      const savedUnreadMsg = localStorage.getItem(`${user.id}_unread`);
      const initialUnreadMsg = savedUnreadMsg ? JSON.parse(savedUnreadMsg) : {};
      setUnreadMessages(initialUnreadMsg);
      fetchUnreadMessages();
    }

    let isFetching = false;

    // repeat at interval 60-180s
    const interval = setInterval(() => {
      if (user && jwtToken && !isFetching) {
        console.log("Interval Unread - 60s");
        isFetching = true;
        fetchUnreadMessages().finally(() => (isFetching = false));
      }
    }, 60000); // now 60s

    return () => clearInterval(interval); // clear interval
  }, [user, jwtToken]);

  return unreadMessages;
}
