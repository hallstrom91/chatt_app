import { useEffect, useState } from "react";
import { useMessage, useUser } from "@hooks/useContextHooks";
import { useNavigate } from "react-router-dom";
import DefaultAvatar from "@images/DefaultAvatar.svg";

export default function UnreadMessagesPopup({ unreadMessages, onClose }) {
  const { activeConversation, setActiveConversation, fetchConversation } =
    useMessage();
  const { fetchUserById } = useUser();
  const [unreadDetails, setUnreadDetails] = useState({});
  const navigate = useNavigate();
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
      console.error("Failed to fetch conversation", error);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // empty object
        const details = {};

        const fetchConversationsUnread = Object.entries(unreadMessages)
          .filter(([_, count]) => count > 0)
          .map(async ([conversationId, count]) => {
            const conversation = await fetchConversation(conversationId);
            const lastMessage = conversation[conversation.length - 1];

            const messageFromUserArray = await fetchUserById(
              lastMessage.userId
            );
            const messageFromUser = messageFromUserArray[0];

            // add new values to object
            details[conversationId] = {
              lastMessage,
              username: messageFromUser?.username || "Borttagen användare",
              userAvatar: messageFromUser?.avatar,
              count,
            };
          });
        await Promise.all(fetchConversationsUnread);
        setUnreadDetails(details);
        console.log("details", details);
      } catch (error) {
        console.error("Failed to fetch unread conversation details", error);
      }
    };
    fetchDetails();
  }, [unreadMessages]);

  return (
    <>
      <div className="absolute top-[4rem] right-2 border rounded-lg z-40 p-2 bg-container-light dark:bg-container-dark text-black dark:text-white border-black/20 dark:border-white/20 ">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xs font-semibold"
        >
          Stäng
        </button>
        <h3 className="text-base font-bold mb-2 mt-3">Olästa meddelanden</h3>
        {Object.keys(unreadDetails).length === 0 ? (
          <p>Inget nytt här.</p>
        ) : (
          <ul className="pl-4 w-52">
            {Object.entries(unreadDetails).map(([conversationId, details]) => (
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
                    /* no image to display? display default avatar */
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
