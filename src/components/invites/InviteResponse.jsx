import { useEffect, useState } from "react";
import { useAuth, useMessage, useUser } from "@hooks/useContextHooks";
import NotificationBell from "@shared/NotificationBell";

export default function InviteResponse({
  invites = [],
  handleIgnoreInvite,
  handleAcceptInvite,
  onClose,
}) {
  const { user } = useAuth();
  const { createMessage } = useMessage();

  // handle invite decline
  const handleIgnore = (conversationId) => {
    handleIgnoreInvite(conversationId);
  };

  // handle invite accept
  const handleAccept = (conversationId) => {
    const message = {
      text: `${user.username} har accepterat inbjudan.`,
      conversationId: conversationId,
    };
    createMessage(message);
    handleAcceptInvite(conversationId);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div className="w-80 bg-container-light dark:bg-container-dark p-4 rounded border text-black dark:text-white border-black/20 dark:border-white/20">
          <h1 className="text-xl font-bold mb-4">Invite Manager</h1>
          {invites.length === 0 ? (
            <p className="text-sm">Inga nya invites.</p>
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
                      className="mr-1 px-2 py-1 rounded tracking-tight text-sm font-semibold bg-btnDelete-light dark:bg-btnDelete-dark text-white"
                    >
                      Avböj
                    </button>
                    <button
                      onClick={() => handleAccept(invite.conversationId)}
                      className="ml-1 px-2 py-1 rounded tracking-tight text-sm font-semibold bg-btnPrimary-light dark:bg-btnPrimary-dark text-white"
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
              className="mr-1 px-2 py-1 rounded text-sm font-semibold bg-btnNeutral-light dark:bg-btnNeutral-dark  dark:text-black  text-white"
            >
              Stäng
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
