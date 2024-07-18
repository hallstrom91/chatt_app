import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "@hooks/useAuth";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const API_URL = "https://chatify-api.up.railway.app";
  const { user, jwtToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);

  /*   useEffect(() => {
    if (user && jwtToken) {
      fetchMessages();
    }
  }, [user, jwtToken]); */

  // fetch messages connected to conversation id
  const fetchConversation = async (conversationId) => {
    try {
      const response = await fetch(
        `${API_URL}/messages?conversationId=${conversationId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("return data - Fetch Conversations:", data);
      return data;
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      throw error;
    }
  };

  // fetch all messages for user

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("messages state - Fetch Messages function:", data);
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages", error);
      throw error;
    }
  };

  // create message - *** ADD UUID ***
  const createMessage = async (message) => {
    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
      const newMessage = await response.json();
      if (newMessage.conversationId === currentConversation) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
      fetchMessages(currentConversation);
    } catch (error) {
      console.error("Failed to create and send message:", error);
      throw error;
    }
  };

  // delete message related to user
  const deleteMessage = async (msgId) => {
    try {
      await fetch(`${API_URL}/messages/${msgId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== msgId)
      );
      fetchMessages(currentConversation);
    } catch (error) {
      console.error("Failed to delete message:");
      throw error;
    }
  };

  // add msg together to conversation/chat
  const groupMessagesByConversation = (messages) => {
    const grouped = messages.reduce((acc, message) => {
      const { conversationId } = message;
      if (!acc[conversationId]) {
        acc[conversationId] = [];
      }
      acc[conversationId].push(message);
      return acc;
    }, {});

    return Object.keys(grouped).map((conversationId) => ({
      conversationId,
      messages: grouped[conversationId],
      friendId: grouped[conversationId][0].userId,
      friendUsername: grouped[conversationId][0].username,
      friendAvatar: grouped[conversationId][0].avatar,
    }));
  };

  // export value
  const value = {
    messages,
    currentConversation,
    fetchConversation,
    setCurrentConversation,
    fetchMessages,
    createMessage,
    deleteMessage,
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};

export default MessageContext;
