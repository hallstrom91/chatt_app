import { useEffect, useState, useRef } from "react";
import { useAuth, useMessage, useUser } from "@hooks/useContextHooks";
import {
  formatDate,
  getParticipantsInfo,
  getUserInfoById,
} from "@utils/chatUtils";
import { DefaultAvatar, ChatInfo, TrashCan, AddSign } from "@utils/svgIcons";
import InfoPopup from "./InfoPopup";
import InviteSender from "@notifications/InviteSender";
import DOMPurify from "dompurify";
import * as Sentry from "@sentry/react";

export default function ConversationDisplay({
  conversation,
  refreshConversation,
}) {
  const { user } = useAuth();
  const { createMessage, deleteMessage } = useMessage();
  const { userList } = useUser();
  const [newMessage, setNewMessage] = useState("");
  const messageEndRef = useRef(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // unique conversation information
  const handleOpenInfoModal = () => {
    setIsInfoModalOpen(!isInfoModalOpen);
  };

  // handle submit of new message
  const handleSubmitMessage = async () => {
    if (newMessage.trim()) {
      try {
        // sanitize input
        const sanitizedMessage = DOMPurify.sanitize(newMessage);

        const submittedMsg = await createMessage({
          text: sanitizedMessage,
          conversationId: conversation.conversationId,
        });
        setNewMessage("");
        if (submittedMsg) {
          refreshConversation(submittedMsg);
        }
      } catch (error) {
        Sentry.captureException(error);
      }
    }
  };

  // handle delete of message removal one by one in active chat
  const handleDeleteMessage = async (msgId) => {
    try {
      await deleteMessage(msgId);
      refreshConversation(conversation);
    } catch (error) {
      Sentry.captureException(error);
    }
  };
  // Collect username for other users
  const getUsernameById = (userId) => {
    const guest = userList.find(
      (guest) => String(guest.userId) === String(userId)
    );
    return guest ? guest.username : "Okänd användare";
  };

  // helper functions from chatUtils
  const { participantsUsername, participantsAvatar } = getParticipantsInfo(
    conversation.messages,
    user.id,
    userList,
    DefaultAvatar
  );
  // limit number of profile pictures that are shown in conversationList and conversationDetails
  const limitedAvatars = participantsAvatar.slice(0, 3);

  // limit number of usernames that are shown in conversationList and conversationDetails
  const limitUsernames =
    participantsUsername.length > 30
      ? participantsUsername.substring(0, 30) + "..."
      : participantsUsername;

  // auto scroll to newest message in conversationDetails
  const AutoScrollToEnd = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    AutoScrollToEnd();
  }, [conversation.messages]);

  // if no user value, do not render page.
  if (!user) {
    return null;
  }

  return (
    <>
      <section className="bg-chatLayout-light dark:bg-chatLayout-dark text-black dark:text-white rounded-lg border border-black/20 dark:border-white/20">
        <div className="flex flex-col h-auto">
          <div className="flex-grow overflow-y-auto">
            <div className="w-full flex items-center px-2 py-3 rounded-t-lg bg-chatHeader-light dark:bg-chatHeader-dark">
              <div className="flex w-full justify-start items-center">
                <div className="flex -space-x-4 w-60 lg:w-48 pr-5 md:pr-0">
                  {/* rendera pics of participants, not the signed in user*/}
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
                {/* display friends names */}
                <div className="flex">
                  {limitUsernames && limitUsernames.length > 0 ? (
                    <h1 className="font-semibold text-sm lg:text-lg">
                      {limitUsernames}
                    </h1>
                  ) : (
                    <h1 className="font-semibold text-sm lg:text-lg">
                      Inbjudan skickad, inväntar svar...
                    </h1>
                  )}
                </div>
                <div className="flex justify-end w-full items-center">
                  {/* add more users to the chat (invite) */}
                  <div className="py-1 pr-1">
                    <AddSign className="icon pr-1 mb" height={15} />
                  </div>
                  {/* view current chat info btn (conversationId, userIds etc) */}
                  <div className="relative inline-block py-1 pr-1">
                    <ChatInfo
                      className="icon"
                      height={20}
                      onClick={handleOpenInfoModal}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* current chat - render */}
            <div className="flex flex-col mb-4 gap-4 py-3 overflow-x-hidden max-h-[60vh]">
              {conversation.messages &&
                conversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.userId === user.id ? "justify-end" : "justify-start"
                    }  px-4`}
                  >
                    <div
                      className={`${
                        msg.userId === user.id
                          ? "bg-chatUser-light dark:bg-chatUser-dark border border-black/20 dark:border-white/20"
                          : "bg-chatGuest-light dark:bg-chatGuest-dark border border-black/20 dark:border-white/20"
                      } rounded-lg px-2 py-2 max-w-[80%] break-words`}
                    >
                      <div className="flex justify-end">
                        <p className="flex text-xs tracking-tighter font-light pr-2 ">
                          {formatDate(msg.createdAt)}
                        </p>{" "}
                        {msg.userId === user.id && (
                          <div className="flex">
                            <TrashCan
                              height={13}
                              className="lg:hover:bg-btnDelete-light dark:lg:hover:bg-btnDelete-dark rounded"
                              onClick={() => handleDeleteMessage(msg.id)}
                            />
                          </div>
                        )}
                      </div>

                      <p
                        className={`text-sm ${
                          msg.userId === user.id
                            ? "text-black dark:text-white"
                            : "text-black dark:text-white"
                        }`}
                      >
                        {msg.text}
                      </p>
                      <p className="text-[0.5rem] text-black dark:text-white text-end">
                        {getUsernameById(msg.userId)}
                      </p>
                    </div>
                  </div>
                ))}
              {/* message ref 2 scroll down to latest  */}
              <div ref={messageEndRef} />
            </div>
          </div>
          <div className="flex justify-start items-center py-2 px-4">
            <textarea
              className="border-black dark:border-white text-black border rounded-lg py-2 px-4 w-full mr-4 resize-none"
              placeholder="Skriv Något?"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              onClick={handleSubmitMessage}
              className="px-4 py-2 bg-btnPrimary-light dark:bg-btnPrimary-dark text-white rounded"
            >
              Sänd
            </button>
          </div>
        </div>
      </section>
      {isInfoModalOpen && (
        <InfoPopup
          onClose={() => setIsInfoModalOpen(false)}
          chatInfo={conversation}
        />
      )}
    </>
  );
}
