import { useEffect, useState } from "react";
import { useAuth, useMessage, useUser } from "@hooks/useContextHooks";
import NotificationBell from "@shared/NotificationBell";

export default function InviteManager({
  invites = [],
  handleIgnoreInvite,
  handleAcceptInvite,
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
      <div className="">
        <h1 className="text-xl font-bold px-10">Invite Manager</h1>
        {invites.length === 0 ? (
          <p className="text-sm">Inga nya invites.</p>
        ) : (
          <ul className="">
            {invites.map((invite) => (
              <li
                key={invite.conversationId}
                className="border-b border-white pb-2 pt-1"
              >
                <p className="text-sm">Du har fått chatt invite från:</p>
                <span className="font-semibold">{invite.username}</span>
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
      </div>
    </>
  );
}
