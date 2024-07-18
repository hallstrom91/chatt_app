import React, { useState, useEffect } from "react";
import ChatLayout from "@interface/ChatLayout";
import UserList from "@interface/UserList";
import ChatHistory from "@interface/ChatHistory";
import { useMessage } from "@hooks/useMessage";
import { useUser } from "@hooks/useUser";
import { useAuth } from "@hooks/useAuth";

export default function ChatInterface() {
  const { user } = useAuth();
  const {
    messages,
    fetchMessages,
    fetchConversation,
    currentConversation,
    setCurrentConversation,
  } = useMessage();
  const { userList, fetchAllUsers } = useUser();
  const [activeConversation, setActiveConversation] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchAllUsers();
    }
  }, []);

  const handleSetActiveConversation = async (conversation) => {
    try {
      const openConversation = await fetchConversation(
        conversation.conversationId
      );

      setActiveConversation({
        ...conversation,
        messages: openConversation,
      });
    } catch (error) {
      console.error("Failed to open conversation:", error);
    }
  };

  return (
    <>
      <main className="pt-16 text-black dark:text-white bg-primary-light dark:bg-primary-dark shadow-xl shadow-black/20 dark:shadow-white/20">
        <div className="flex flex-col md:flex-row p-2">
          <div className="w-full lg:w-2/6 p-2">
            <div className="">
              <ChatHistory
                setActiveConversation={handleSetActiveConversation}
              />
            </div>
          </div>
          <div className="w-full lg:w-4/6">
            {activeConversation && (
              <ChatLayout conversation={activeConversation} />
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row">
          {/*           <div className="w-full lg:w-2/6 my-2">
            <h1 className="text-center font-semibold mb-2">Användarlista</h1>
            {userList.map((guest) => (
              <div key={guest.userId}>
                <UserList user={guest} />
              </div>
            ))}
          </div> */}
        </div>
      </main>
    </>
  );
}
