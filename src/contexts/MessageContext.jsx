import { createContext, useState, useEffect } from "react";
import { useAuth } from "@hooks/useContextHooks";
import { v4 as uuidv4 } from "uuid";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const API_URL = "https://chatify-api.up.railway.app";
  const { user, jwtToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);

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
      setMessages(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch messages", error);
      throw error;
    }
  };

  // create message
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
      const data = await response.json();
      const newMessage = data.latestMessage;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      return newMessage;
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
    } catch (error) {
      console.error("Failed to delete message:");
      throw error;
    }
  };

  // delete ALL messages related to user
  const deleteAllMessages = async () => {
    try {
      const response = await fetchMessages();
      await Promise.all(response.map((msg) => deleteMessage(msg.id)));
    } catch (error) {
      console.error(
        `Failed to delete all messages for userId ${user.id}:`,
        error
      );
      throw error;
    }
  };

  // Invite user to new chat -- RENMAE?? createInvite??
  const handleInvite = async (userId) => {
    const createInviteUUID = uuidv4();
    try {
      const response = await fetch(`${API_URL}/invite/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversationId: createInviteUUID }),
      });
      if (response.ok) {
        const data = await response.json();
        return createInviteUUID;
      }
      throw new Error("Invitation Failed");
    } catch (error) {
      console.error("Error with invite", error);
      throw error;
    }
  };

  // export value
  const value = {
    messages,
    currentConversation,
    handleInvite,
    fetchConversation,
    setCurrentConversation,
    fetchMessages,
    createMessage,
    deleteMessage,
    deleteAllMessages,
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};

export default MessageContext;
