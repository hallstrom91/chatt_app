import { useState, useEffect } from "react";
import { useAuth, useMessage, useUser } from "@hooks/useContextHooks";
import ConversationDisplay from "@chat/ConversationDisplay";
import ConversationInbox from "@chat/ConversationInbox";
import Loader from "@shared/Loader";

export default function Chat() {
  const { user } = useAuth();
  const {
    fetchMessages,
    fetchConversation,
    activeConversation,
    setActiveConversation,
  } = useMessage();
  const { fetchAllUsers } = useUser();
  const [updateIndicator, setUpdateIndicator] = useState(0);
  const [isLoadingInbox, setIsLoadingInbox] = useState(false);
  const [isLoadingChatRender, setIsLoadingChatRender] = useState(false);

  /*   useEffect(() => {
    // get a mount after login
    if (user) {
      fetchMessages();
      fetchAllUsers();
    }
  }, []); */

  useEffect(() => {
    if (user) {
      setIsLoadingInbox(true);
      Promise.all([fetchMessages(), fetchAllUsers()])
        .then(() => {
          setIsLoadingInbox(false);
        })
        .catch((error) => {
          console.error("Failed to fetch inital data", error);
          setIsLoadingInbox(false);
        });
    }
  }, [user]);

  const handleSetActiveConversation = async (conversation) => {
    setIsLoadingChatRender(true);
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
    } finally {
      setIsLoadingChatRender(false);
    }
  };

  const handleRefreshConversation = async (message) => {
    setIsLoadingChatRender(true);
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
    } finally {
      setIsLoadingChatRender(false);
    }
  };

  return (
    <>
      {isLoadingInbox ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : (
        <main className="pt-16 px-2">
          <div className="flex flex-col md:flex-row p-2">
            <div className="w-full lg:w-2/6 lg:pr-1 lg:pb-0 mb-4 order-2 md:order-none">
              <ConversationInbox
                openConversation={handleSetActiveConversation}
                refreshHistory={updateIndicator}
              />
            </div>
            <div className="w-full lg:w-4/6 lg:pl-1 mb-4 order-1 md:order-none">
              {isLoadingChatRender ? (
                <div className="">
                  <Loader />
                </div>
              ) : (
                activeConversation && (
                  <ConversationDisplay
                    conversation={activeConversation}
                    refreshConversation={handleRefreshConversation}
                  />
                )
              )}
            </div>
          </div>
        </main>
      )}
    </>
  );
}
