import { useEffect, useState } from "react";
import { useAuth, useMessage, useUser } from "@hooks/useContextHooks";
import { getParticipantsInfo } from "@utils/chatUtils";
import { useUnreadMessages } from "@hooks/useUnreadMessages";
import InviteSender from "@notifications/InviteSender";
import NotificationBell from "@notifications/NotificationBell";
import { DefaultAvatar, AddSign } from "@utils/svgIcons";
import DOMPurify from "dompurify";
import * as Sentry from "@sentry/react";

export default function ConversationInbox({
  openConversation,
  refreshHistory,
}) {
  const { user } = useAuth();
  const { userList } = useUser();
  const { messages, fetchConversation, handleInvite, createMessage } =
    useMessage();
  const [uniqueConversation, setUniqueConversation] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const unreadMessages = useUnreadMessages();

  // remove or not?
  if (!unreadMessages) {
    return null;
  }

  // render & map unique conversations for user by date (new @ top)
  useEffect(() => {
    if (messages.length > 0) {
      // collect unique conIds
      const conversationIds = Array.from(
        new Set(messages.map((message) => message.conversationId))
      );

      // collect all conversations by conId
      const fetchAllConversations = async () => {
        const fetchedConversations = await Promise.all(
          conversationIds.map((conversationId) =>
            fetchConversation(conversationId)
          )
        );

        // sanitize output test
        const sanitizedConversations = fetchedConversations.map(
          (conversation) =>
            conversation.map((message) => ({
              ...message,
              text: DOMPurify.sanitize(message.text),
            }))
        );

        const validConversations = sanitizedConversations.filter(
          (conversation) => conversation && conversation.length > 0
        );

        // sort conversations by date, newest at top
        const sortedConversations = validConversations.sort((a, b) => {
          const lastMessageA = a[a.length - 1];
          const lastMessageB = b[b.length - 1];
          if (
            lastMessageA &&
            lastMessageB &&
            lastMessageA.createdAt &&
            lastMessageB.createdAt
          ) {
            return (
              new Date(lastMessageB.createdAt) -
              new Date(lastMessageA.createdAt)
            );
          }
          return 0;
        });
        // set unique conversations
        setUniqueConversation(sortedConversations);
      };
      fetchAllConversations();
    }
  }, [messages, user, refreshHistory]);

  // handle invite thru ChatInvite Module & message context-api
  const handleInviteUser = async (userId) => {
    try {
      const newConversation = await handleInvite(userId);
      return newConversation;
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  // do not render page if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <>
      <div className="pt-1 bg-chatHeader-light dark:bg-chatHeader-dark text-black dark:text-white rounded-lg border border-black/20 dark:border-white/20">
        <div className="flex justify-end">
          <div className="py-2 pr-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex justify-around rounded-2xl font-semibold text-sm items-center py-2 pl-1 pr-3 bg-btnUpdate-light dark:bg-btnUpdate-dark"
            >
              <AddSign className="icon pr-1 mb" height={15} />
              Ny Chatt
            </button>
          </div>
        </div>

        <h1 className="text-start font-semibold pl-4 text-lg">Inkorg</h1>

        <div className="mx-auto border-black dark:border-white overflow-x-hidden max-h-[60vh]">
          {uniqueConversation.map((conversation) => {
            if (!conversation || conversation.length === 0) {
              return null; // handle empty conversations - ex after invite
            }

            const lastMessage = conversation[conversation.length - 1];
            if (!lastMessage) {
              return null; // handle empty messages
            }

            const { participants, participantsUsername, participantsAvatar } =
              getParticipantsInfo(
                conversation,
                user.id,
                userList,
                DefaultAvatar
              );
            // limit avatars display to three pictures
            const limitedAvatars = participantsAvatar.slice(0, 3);

            // limit usernames in groupchat to 30 characters
            const limitedUsernames =
              participantsUsername.length > 30
                ? participantsUsername.substring(0, 30) + "..."
                : participantsUsername;

            // message counter for display of each unique chat

            const unreadData = unreadMessages[conversation[0].conversationId];
            const messageCounter =
              unreadData && unreadData.count ? unreadData.count : 0;

            return (
              <div
                key={lastMessage.conversationId}
                className="p-3 flex flex-col 2xl:flex-row items-start justify-between border-t border-black/20 dark:border-white/20"
              >
                <div className="flex items-center flex-grow mb-2 sm:mb-0">
                  <div className="flex justify-start -space-x-4 w-20 sm:w-24">
                    {limitedAvatars.length > 0 ? (
                      limitedAvatars.map((avatar, index) => (
                        <img
                          key={index}
                          className="object-scale-down h-8 w-8 lg:h-10 lg:w-10 ring-1 ring-secondary-light dark:ring-secondary-dark rounded-full bg-white"
                          src={avatar}
                          alt="User Avatar"
                        />
                      ))
                    ) : (
                      /* no image to display? display default avatar */
                      <img
                        className="object-scale-down h-8 w-8 lg:h-10 lg:w-10 ring-1 ring-secondary-light dark:ring-secondary-dark rounded-full bg-white"
                        src={DefaultAvatar}
                        alt="User Avatar"
                      />
                    )}
                  </div>

                  <div className="flex flex-col ml-4 w-40 sm:w-52 md:w-64 flex-grow">
                    {limitedUsernames && limitedUsernames.length > 0 ? (
                      <p className="leading-snug text-xs xl:text-sm font-bold pb-1">
                        {limitedUsernames}
                      </p>
                    ) : (
                      <p className="leading-snug text-xs xl:text-sm font-bold pb-1">
                        Inbjudan skickad, inväntar svar...
                      </p>
                    )}
                    <p className="leading-snug text-xs">
                      {lastMessage.userId === user.id
                        ? `Du: ${
                            lastMessage.text.length > 10
                              ? `${lastMessage.text.substring(0, 10)}...`
                              : lastMessage.text
                          }`
                        : `${
                            lastMessage.text.length > 10
                              ? `${lastMessage.text.substring(0, 10)}...`
                              : lastMessage.text
                          }`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end w-full space-x-2">
                  {/*  display notifier for number of unread (new messages since last response from signedIn user) */}
                  {messageCounter > 0 && (
                    <div className="flex items-center">
                      <NotificationBell notifications={[messageCounter]} />
                    </div>
                  )}

                  <button
                    onClick={() =>
                      openConversation({
                        conversationId: lastMessage.conversationId,
                        messages: conversation,
                      })
                    }
                    className="h-6 px-3 text-sm font-bold rounded-full border border-black dark:border-white text-black dark:text-white"
                  >
                    Öppna
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* popup module for inviting user to new chat */}
      {isModalOpen && (
        <InviteSender
          userList={userList}
          onClose={() => setIsModalOpen(false)}
          onInvite={handleInviteUser}
          createMessage={createMessage}
        />
      )}
    </>
  );
}
