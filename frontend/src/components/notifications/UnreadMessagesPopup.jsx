import { useEffect, useState, useRef } from "react";
import { useMessage } from "@hooks/useContextHooks";
import { useNavigate } from "react-router-dom";
import { useUnreadMessages } from "@hooks/useUnreadMessages";
import { DefaultAvatar, NavClose } from "@utils/svgIcons";
import * as Sentry from "@sentry/react";

export default function UnreadMessagesPopup({ unreadMessages, onClose }) {
  const { setActiveConversation, fetchConversation } = useMessage();
  const navigate = useNavigate();
  const closeRef = useRef(null);

  // handle selection of specific unread message/conversation
  const handleMessageClick = async (conversationId) => {
    try {
      const conversation = await fetchConversation(conversationId);
      navigate("/chat");
      setActiveConversation({
        conversationId,
        messages: conversation,
      });
      onClose();
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const hasUnreadMessages = Object.values(unreadMessages).some(
    (details) => details.count > 0
  );

  // close when click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (closeRef.current && !closeRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <>
      <div
        ref={closeRef}
        className="absolute top-[4rem] right-2 border rounded-lg z-40 p-2 bg-container-light dark:bg-container-dark text-black dark:text-white border-black/20 dark:border-white/20 "
      >
        <h3 className="text-sm font-bold mb-2 mt-3">Nya Meddelanden</h3>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xs font-semibold"
        >
          <NavClose height={15} className="icon" />
        </button>
        {Object.keys(unreadMessages).length === 0 || !hasUnreadMessages ? (
          <p className="text-xs">Inga olästa meddelanden.</p>
        ) : (
          <ul className="pl-4 w-52">
            {Object.entries(unreadMessages)
              .filter(([, details]) => details.count > 0)
              .sort(
                ([, detailsA], [, detailsB]) =>
                  new Date(detailsB.lastMessage.createdAt) -
                  new Date(detailsA.lastMessage.createdAt)
              )
              .map(([conversationId, details]) => (
                <li
                  key={conversationId}
                  className="cursor-pointer pt-1"
                  onClick={() => handleMessageClick(conversationId)}
                >
                  <div className="flex justify-start  items-center border-b border-black dark:border-white py-2">
                    {details.userAvatar ? (
                      <img
                        className="object-scale-down h-4 w-4 lg:h-6 lg:w-6 ring-1 ring-secondary-light dark:ring-secondary-dark rounded bg-white"
                        src={details.userAvatar}
                        alt="User Avatar"
                      />
                    ) : (
                      <img
                        className="object-scale-down h-4 w-4 lg:h-6 lg:w-6 ring-1 ring-secondary-light dark:ring-secondary-dark rounded  bg-white"
                        src={DefaultAvatar}
                        alt="User Avatar"
                      />
                    )}
                    <p className="text-xs font-semibold pl-2">
                      {`${details.username}:`}
                    </p>
                    <p className="text-xs pl-1">
                      {`${
                        details.lastMessage.text.length > 10
                          ? `${details.lastMessage.text.substring(0, 10)}...`
                          : details.lastMessage.text
                      }`}
                    </p>
                    <span className="absolute right-4 block h-4 w-4 transform translate-x-1/6 -translate-y-1/6 rounded-full bg-container-light dark:bg-container-dark  ring-2 ring-btnDelete-light dark:ring-btnDelete-dark">
                      <p className="flex items-center justify-center text-xs text-black dark:text-white">
                        {details.count}
                      </p>
                    </span>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </>
  );
}
