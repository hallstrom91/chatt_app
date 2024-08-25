import { useEffect, useState, useRef } from "react";
import { useAuth, useMessage, useUser } from "@hooks/useContextHooks";
import NotificationBell from "@notifications/NotificationBell";

export default function InviteResponse({
  invites = [],
  onClose,
  handleInvite,
}) {
  const { user } = useAuth();
  const { createMessage } = useMessage();
  const closeRef = useRef(null);
  // handle invite decline
  const handleIgnore = (conversationId) => {
    handleInvite(conversationId);
  };

  // handle invite accept
  const handleAccept = (conversationId) => {
    const message = {
      text: `${user.username} har accepterat inbjudan.`,
      conversationId: conversationId,
    };
    createMessage(message);
    handleInvite(conversationId);
  };

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
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div
          ref={closeRef}
          className="w-80 bg-container-light dark:bg-container-dark p-4 rounded border text-black dark:text-white border-black/20 dark:border-white/20"
        >
          <h1 className="text-xl font-bold mb-4">Dina Förfrågningar</h1>
          {invites.length === 0 ? (
            <p className="text-sm">Du har inga nya förfrågningar.</p>
          ) : (
            <ul className="max-h-72 overflow-y-auto">
              {invites.map((invite) => (
                <li
                  key={invite.conversationId}
                  className="border-b border-black dark:border-white pb-2 pt-1"
                >
                  <p className="text-sm">Du har fått chatt invite från:</p>
                  <p className="font-semibold text-xs">{invite.username}</p>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleIgnore(invite.conversationId)}
                      className="mr-1 px-2 py-2 rounded text-sm font-semibold bg-btnDelete-light dark:bg-btnDelete-dark text-white"
                    >
                      Avböj
                    </button>
                    <button
                      onClick={() => handleAccept(invite.conversationId)}
                      className="ml-1 px-2 py-2 rounded text-sm font-semibold bg-btnPrimary-light dark:bg-btnPrimary-dark text-white"
                    >
                      Acceptera
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-end pt-5">
            <button
              onClick={onClose}
              className="mr-1 px-2 py-2 rounded text-base font-semibold bg-btnNeutral-light dark:bg-btnNeutral-dark  dark:text-black  text-white"
            >
              Stäng
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
