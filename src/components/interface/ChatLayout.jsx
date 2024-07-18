import React, { useEffect, useState, useTransition } from "react";
import DefaultAvatar from "@images/DefaultAvatar.svg";
import { useMessage } from "@hooks/useMessage";
import { useAuth } from "@hooks/useAuth";
import { useUser } from "@hooks/useUser";
import {
  formatDate,
  getParticipantsInfo,
  getUserInfoById,
} from "@helpers/helpers";
import ChatInfo from "@svg/ChatInfo.svg?react";
import TrashCan from "@svg/TrashCan.svg?react";

export default function ChatLayout({ conversation }) {
  const { user } = useAuth();
  const { createMessage } = useMessage();
  const { userList } = useUser();
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = async () => {
    if (newMessage.trim()) {
      try {
        await createMessage({
          text: newMessage,
          conversationId: conversation.conversationId,
        });
        setNewMessage("");
      } catch (error) {
        console.error("Failed to submit message:", error);
      }
    }
  };

  const getUsernameById = (userId) => {
    const guest = userList.find(
      (guest) => String(guest.userId) === String(userId)
    );
    return guest ? guest.username : "Okänd användare";
  };
  /* 

  const getAvatarById = (userId) => {
    const guest = userList.find(
      (guest) => String(guest.userId) === String(userId)
    );
    return guest ? guest.avatar : DefaultAvatar;
  };

  const guestAvatars = conversation.messages
    .map((msg) => (msg.userId !== user.id ? getAvatarById(msg.userId) : null))
    .filter((avatar, index, self) => avatar && self.indexOf(avatar) === index);

  const guestUsers = conversation.messages
    .map((msg) => (msg.userId !== user.id ? getUsernameById(msg.userId) : null))
    .filter(
      (username, index, self) => username && self.indexOf(username) === index
    )
    .join(", "); */

  const { participantsUsername, participantsAvatar } = getParticipantsInfo(
    conversation.messages,
    user.id,
    userList,
    DefaultAvatar
  );

  if (!user) {
    return null;
  }

  return (
    <>
      <section className="pt-1 bg-chatHeader-light dark:bg-chatHeader-dark text-black dark:text-white rounded-t-lg">
        <div className="flex flex-col h-auto  max-w-3xl bg-chatBg-light border-lines-light text-font-light  dark:border-lines-dark dark:text-font-dark dark:bg-chatBg-dark">
          <div className="flex-grow overflow-y-auto">
            <div className="w-full flex items-center bg-chatHead-light dark:bg-chatHead-dark text-font-light dark:text-font-dark p-2">
              <div className="flex w-full justify-start  items-center">
                {/* rendera bilder på alla deltagare - inte på den inloggad person. */}
                <div className="flex -space-x-4 w-full lg:w-1/4">
                  {participantsAvatar.map((avatar, index) => (
                    <img
                      key={index}
                      src={avatar}
                      alt="User Avatar"
                      className="object-scale-down h-10 w-10 ring-1 ring-white rounded-full bg-white"
                    />
                  ))}
                </div>
                <div className="pl-3">
                  <h1 className="font-semibold text-xs lg:text-lg">
                    {participantsUsername}
                  </h1>
                </div>
              </div>
              {/* view current chat info btn (conversationId, userIds etc) */}
              <div className="flex justify-end w-full items-center">
                <div className="py-1 pr-1">
                  <ChatInfo className="icon" height={20} />
                </div>
              </div>
            </div>
            {/* current chat - render */}
            <div className="flex flex-col mb-4 gap-4 py-3">
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
                          ? "bg-chatUser-light dark:bg-chatUser-dark"
                          : "bg-chatGuest-light dark:bg-chatGuest-dark"
                      } rounded-lg px-2 py-2 max-w-[80%]`}
                    >
                      <p className="text-xs text-end tracking-tighter font-light">
                        {formatDate(msg.createdAt)}
                      </p>
                      <p
                        className={`text-sm ${
                          msg.userId === user.id ? "text-white" : "text-black"
                        }`}
                      >
                        {msg.text}
                      </p>
                      <p className="text-[0.5rem] text-gray-800 text-end">
                        {getUsernameById(msg.userId)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex justify-center items-center py-2  px-4 bg-chatHead-light dark:bg-chatHead-dark">
            <textarea
              className="border-lines-light dark:border-lines-dark border rounded-lg py-2 px-4 w-full max-w-lg mr-4 resize-none"
              placeholder="Skriv Något?"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              onClick={handleSubmit}
              className="bg-button-light dark:bg-button-dark text-white font-bold py-2 px-4 rounded text-sm"
            >
              Sänd
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

{
  {
    /*                  show trashcan in every chat from user to remove
    {msg.userId === user.id && (
      <div className="flex w-full justify-end">
      <TrashCan height={13} />
      </div>
    )} */
  }
  /* chat owner */
}
{
  /*       
    <div className="bg-gray-200 rounded-lg px-4 py-2 max-w-[80%]">
    <p className="text-black text-sm">Gästens Meddelande</p>
    </div>
<div className="flex justify-end px-4">
<div className="bg-blue-500 rounded-lg px-4 py-2 max-w-[80%]">
<p className="text-white text-sm">Mitt mess</p>
</div>
</div> */
}

{
  /*         <div className="flex justify-center">
  <div className="py-2 pr-4">Aktiv</div>
</div> */
}
