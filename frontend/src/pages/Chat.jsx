import { useState, useEffect } from "react";
import { useAuth, useMessage, useUser } from "@hooks/useContextHooks";
import ConversationDisplay from "@chat/ConversationDisplay";
import ConversationInbox from "@chat/ConversationInbox";
import Loader from "@shared/Loader";
import * as Sentry from "@sentry/react";

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
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoadingChat(true);
      Promise.all([fetchMessages(), fetchAllUsers()])
        .then(() => {
          setIsLoadingInbox(false);
        })
        .catch((error) => {
          Sentry.captureException(error);
          setIsLoadingChat(false);
        });
    }
  }, [user]);

  const handleSetActiveConversation = async (conversation) => {
    setIsLoadingChat(true);
    try {
      const openConversation = await fetchConversation(
        conversation.conversationId
      );

      setActiveConversation({
        ...conversation,
        messages: openConversation,
      });
    } catch (error) {
      Sentry.captureException(error);
    } finally {
      setIsLoadingChat(false);
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
      Sentry.captureException(error);
    }
  };

  return (
    <>
      {isLoadingChat ? (
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
              {activeConversation && (
                <ConversationDisplay
                  conversation={activeConversation}
                  refreshConversation={handleRefreshConversation}
                />
              )}
            </div>
          </div>
        </main>
      )}
    </>
  );
}
