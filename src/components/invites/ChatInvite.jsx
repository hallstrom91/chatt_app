import { useState } from "react";

export default function ChatInvite({
  userList,
  onClose,
  onInvite,
  createMessage,
}) {
  const [userSearch, setUserSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isStepTwo, setIsStepTwo] = useState(false);
  const [newConversationId, setNewConversationId] = useState(null);
  const [firstMessage, setFirstMessage] = useState("");

  // filter users by searchinput
  const filteredUsers = userList.filter((user) =>
    user.username?.toLowerCase().includes(userSearch.toLowerCase())
  );

  // handle invite submit and go to next step -> first message
  const handleInviteSubmit = async () => {
    if (selectedUser) {
      try {
        const newChatInviteId = await onInvite(selectedUser.userId);
        if (newChatInviteId) {
          setNewConversationId(newChatInviteId);
          setIsStepTwo(true);
        } else {
          throw new Error("No conversation ID returned...");
        }
      } catch (error) {
        console.error("Failed to invite user.", error);
      }
    }
  };
  // create first message after invite
  const createFirstMessage = async () => {
    if (firstMessage.trim() && newConversationId) {
      try {
        const message = {
          text: firstMessage.trim(),
          conversationId: newConversationId,
        };
        await createMessage(message);
        onClose();
      } catch (error) {
        console.error("Failed to send first message:", error);
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
        <div className="bg-white p-4 rounded-lg shadow-lg w-80 text-black">
          {!isStepTwo ? (
            <>
              <h2 className="text-xl font-bold mb-4">Skapa en ny chatt</h2>
              <input
                type="text"
                placeholder="Hitta Användare"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
              <ul className="max-h-40 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <li
                    key={user.userId}
                    className={`p-2 cursor-pointer text-xs ${
                      selectedUser === user ? "bg-gray-400 rounded" : ""
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    {user.username}
                  </li>
                ))}
              </ul>
              <div className="flex justify-end mt-4">
                <button
                  onClick={onClose}
                  className="mr-2 px-4 py-2 bg-btnNeutral-light dark:bg-btnNeutral-dark text-white dark:text-black rounded"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleInviteSubmit}
                  className="px-4 py-2 bg-btnPrimary-light dark:bg-btnPrimary-dark text-white rounded"
                >
                  Skicka
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4">Skapa Meddelanden</h2>
              <textarea
                placeholder="Meddelande..."
                value={firstMessage}
                onChange={(e) => setFirstMessage(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
              <button
                onClick={onClose}
                className="mr-2 px-4 py-2 bg-btnNeutral-light dark:bg-btnNeutral-dark text-white dark:text-black rounded"
              >
                Avbryt
              </button>
              <button
                onClick={createFirstMessage}
                className="px-4 py-2 bg-btnPrimary-light dark:bg-btnPrimary-dark text-white rounded"
              >
                Skicka
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
