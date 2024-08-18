import { useState } from "react";
import { useAuth } from "@hooks/useContextHooks";
export default function InviteSender({
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
  const { user } = useAuth();

  // filter users and find by searchinput
  const filteredUsers = userList
    .filter((u) => u.userId !== user.id)
    .filter((u) =>
      u.username?.toLowerCase().includes(userSearch.toLowerCase())
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
        <div className="w-80 bg-container-light dark:bg-container-dark p-4 rounded border text-black dark:text-white border-black/20 dark:border-white/20">
          {!isStepTwo ? (
            <>
              <h1 className="text-xl font-bold mb-4">Skapa en ny chatt</h1>
              <input
                type="text"
                placeholder="Hitta Användare"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full p-2 border rounded mb-4 text-black"
              />
              <p className="text-sm font-semibold">Hitta en vän</p>
              <span className="flex w-full border border-white my-2"></span>
              <ul className="max-h-72 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <li
                    key={user.userId}
                    className={`px-2 rounded py-2 ${
                      selectedUser === user
                        ? "bg-container-dark dark:bg-container-light text-white dark:text-black"
                        : ""
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <p className="font-semibold text-xs cursor-pointer">
                      {user.username}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="flex justify-end mt-4">
                <button
                  onClick={onClose}
                  className="mr-2 px-2 py-1 bg-btnNeutral-light dark:bg-btnNeutral-dark text-white dark:text-black rounded"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleInviteSubmit}
                  className="px-2 py-1 bg-btnPrimary-light dark:bg-btnPrimary-dark text-white rounded"
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
                className="w-full p-2 border rounded mb-4 text-black"
              />
              <button
                onClick={onClose}
                className="mr-2 px-2 py-1 bg-btnNeutral-light dark:bg-btnNeutral-dark text-white dark:text-black rounded"
              >
                Avbryt
              </button>
              <button
                onClick={createFirstMessage}
                className="px-2 py-1 bg-btnPrimary-light dark:bg-btnPrimary-dark text-white rounded"
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
