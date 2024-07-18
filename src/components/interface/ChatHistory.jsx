import React, { useEffect, useState } from "react";
import DefaultAvatar from "@images/DefaultAvatar.svg";
import { useMessage } from "@hooks/useMessage";
import { useAuth } from "@hooks/useAuth";
import { useUser } from "@hooks/useUser";
import { getParticipantsInfo } from "@helpers/helpers";
import AddSign from "@svg/AddSign.svg?react";

export default function ChatHistory({ setActiveConversation }) {
  const { user } = useAuth();
  const { userList } = useUser();
  const { messages, fetchConversation } = useMessage();
  const [uniqueConversation, setUniqueConversation] = useState([]);

  useEffect(() => {
    if (messages.length > 0) {
      const conversationIds = Array.from(
        new Set(messages.map((message) => message.conversationId))
      );

      const fetchAllConversations = async () => {
        const conversations = await Promise.all(
          conversationIds.map((conversationId) =>
            fetchConversation(conversationId)
          )
        );
        setUniqueConversation(conversations);
      };
      fetchAllConversations();
    }
  }, [messages, user]);

  // do not render page if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <>
      <section className="pt-1 bg-chatHeader-light dark:bg-chatHeader-dark text-black dark:text-white rounded-t-lg">
        <div className="flex justify-end">
          <div className="py-2 pr-4">
            <button className="flex justify-around rounded-2xl font-semibold text-sm items-center border py-2 pl-1 pr-3 border-lines-light text-font-light bg-button-light dark:bg-button-dark dark:text-font-dark dark:border-lines-dark">
              <AddSign className="icon pr-1 mb" height={15} />
              Ny Chatt
            </button>
          </div>
        </div>

        <h1 className="text-start font-semibold pl-4 text-lg">Inkorg</h1>

        <div className="max-w-sm mx-auto bg-chatLayout-light border-secondary-light  dark:border-secondary-dark  dark:bg-chatLayout-dark">
          {uniqueConversation.map((conversation) => {
            const lastMessage = conversation[conversation.length - 1];
            const { participants, participantsUsernames, participantsAvatar } =
              getParticipantsInfo(
                conversation,
                user.id,
                userList,
                DefaultAvatar
              );

            return (
              <div
                key={lastMessage.conversationId}
                className="p-3 flex items-center justify-between border-t border-secondary-light dark:border-secondary-dark"
              >
                <div className="flex items-center">
                  <div className="flex -space-x-4">
                    {participantsAvatar.map((avatar, index) => (
                      <img
                        key={index}
                        className="inline-block h-10 w-10 rounded-full ring-1 ring-white bg-white"
                        src={avatar}
                        alt="User Avatar"
                      />
                    ))}
                  </div>

                  <div className="ml-2 flex flex-col">
                    <p className="leading-snug text-xs lg:text-sm font-bold">
                      {participantsUsernames}
                    </p>
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

                <div className="">
                  <button
                    onClick={() =>
                      setActiveConversation({
                        conversationId: lastMessage.conversationId,
                        messages: conversation,
                      })
                    }
                    className="h-8 px-3 text-sm font-bold rounded-full border border-lines-light dark:border-lines-dark ml-1"
                  >
                    Öppna
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

/* export default function ChatHistory({ setActiveConversation }) {
  const { user } = useAuth();
  const { userList } = useUser();
  const { messages, fetchConversation } = useMessage();
  const [uniqueConversation, setUniqueConversation] = useState([]);

  useEffect(() => {
    if (messages.length > 0) {
      const conversationIds = Array.from(
        new Set(messages.map((message) => message.conversationId))
      );

      const fetchAllConversations = async () => {
        const conversations = await Promise.all(
          conversationIds.map((conversationId) =>
            fetchConversation(conversationId)
          )
        );
        setUniqueConversation(conversations);
      };
      fetchAllConversations();
    }
  }, [messages, user]);

  // do not render page if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <>
      <section className="pt-1 bg-chatHead-light dark:bg-chatHead-dark text-font-light dark:text-font-dark rounded-t-lg">
        <div className="flex justify-end">
          <div className="py-2 pr-4">
            <button className="flex justify-around rounded-2xl font-semibold text-sm items-center border py-2 pl-1 pr-3 border-lines-light text-font-light bg-button-light dark:bg-button-dark dark:text-font-dark dark:border-lines-dark">
              <AddSign className="icon pr-1 mb" height={15} />
              Ny Chatt
            </button>
          </div>
        </div>

        <h1 className="text-start font-semibold pl-4 text-lg">Inkorg</h1>

        <div className="max-w-sm mx-auto bg-chatBg-light border-secondary-light text-font-light  dark:border-secondary-dark dark:text-font-dark dark:bg-chatBg-dark">
          {uniqueConversation.map((conversation) => {
            const lastMessage = conversation[conversation.length - 1];

            const otherUserIds = conversation
              .map((msg) => msg.userId)
              .filter((id) => id !== user.id);

            const participants = userList.filter((u) =>
              otherUserIds.includes(u.userId)
            );

            const participantsNames = participants
              .filter((p) => p.userId !== user.id)
              .map((p) => p.username)
              .join(", ");

            const participantsAvatar = participants[0]?.avatar || DefaultAvatar;

            return (
              <div
                key={lastMessage.conversationId}
                className="p-3 flex items-center justify-between border-t border-secondary-light dark:border-secondary-dark"
              >
                <div className="flex items-center">
                  <div className="flex -space-x-6 overflow-hidden">
                    {participants.map((participant) => (
                      <img
                        key={participant.userId}
                        className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-white"
                        src={participant.avatar || DefaultAvatar}
                        alt="User Avatar"
                      />
                    ))}
                  </div>

                  <div className="ml-2 flex flex-col">
                    <p className="leading-snug text-xs lg:text-sm font-bold">
                      {participantsNames}
                    </p>
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

                <div className="">
                  <button
                    onClick={() =>
                      setActiveConversation({
                        conversationId: lastMessage.conversationId,
                        messages: conversation,
                      })
                    }
                    className="h-8 px-3 text-sm font-bold rounded-full border border-lines-light dark:border-lines-dark ml-1"
                  >
                    Öppna
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
} */
