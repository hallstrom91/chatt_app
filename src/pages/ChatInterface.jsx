import { useState, useEffect } from "react";
import { useAuth, useMessage, useUser } from "@hooks/useContextHooks";
import ChatLayout from "@chat/ChatLayout";
import ChatHistory from "@chat/ChatHistory";

export default function ChatInterface() {
  const { user } = useAuth();
  const { fetchMessages, fetchConversation } = useMessage();
  const { userList, fetchAllUsers } = useUser();

  const [activeConversation, setActiveConversation] = useState(null);
  const [updateIndicator, setUpdateIndicator] = useState(0);

  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchAllUsers();
    }
  }, []);

  // set active conversation in ChatLayout
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

  const handleRefreshConversation = async (message) => {
    try {
      const updatedConversation = await fetchConversation(
        message.conversationId
      );
      setActiveConversation((prevConversation) => {
        if (
          prevConversation &&
          prevConversation.conversationId === message.conversationId
        ) {
          return {
            ...prevConversation,
            messages: updatedConversation,
          };
        }
        return prevConversation;
      });
      setUpdateIndicator((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to update chat:", error);
    }
  };

  return (
    <>
      <main className="pt-16 px-2">
        <div className="flex flex-col md:flex-row p-2">
          <div className="w-full lg:w-2/6 lg:pr-1 lg:pb-0 pb-1">
            <div className="">
              <ChatHistory
                setActiveConversation={handleSetActiveConversation}
                refreshHistory={updateIndicator}
              />
            </div>
          </div>
          <div className="w-full lg:w-4/6 lg:pl-1">
            {activeConversation && (
              <ChatLayout
                conversation={activeConversation}
                refreshConversation={handleRefreshConversation}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
