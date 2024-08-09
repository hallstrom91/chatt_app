import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@hooks/useContextHooks";
import { useUnreadMessages } from "@hooks/useUnreadMessages";
import ProfileNavDisplay from "@profile/ProfileNavDisplay";
import InviteManager from "@invites/InviteManager";
import NotificationBell from "@shared/NotificationBell";
import NavOpen from "@svg/NavOpen.svg?react";
import NavClose from "@svg/NavClose.svg?react";
import Bell from "@svg/Bell.svg?react";
import InviteBell from "@svg/InviteBell.svg?react";

export default function SideNavigation() {
  const navigate = useNavigate(); // remove?
  const { user, logout } = useAuth();
  const unreadMessages = useUnreadMessages();
  const {
    invites,
    handleIgnoreInvite,
    ignoredInvites,
    fetchUserInvites,
    acceptedInvites,
    handleAcceptInvite,
  } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showInviteManager, setShowInviteManager] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    handleToggle();
  };

  // collect all invites for user - ADD TIMER?
  useEffect(() => {
    if (user) {
      fetchUserInvites(user.id);
    }
  }, [user]);

  // handle invite manger display / close
  const handleNotificationClick = () => {
    setShowInviteManager(!showInviteManager);
  };

  // exclude accepted & ignored invites from list
  const filteredInvites = (invites || []).filter(
    (invite) =>
      !ignoredInvites.includes(invite.conversationId) &&
      !acceptedInvites.includes(invite.conversationId)
  );

  const inviteCounter = filteredInvites.map((invite) => 1);

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="bg-container-light dark:bg-container-dark border border-black/20 dark:border-white/20 rounded-lg fixed top-2 right-4 z-50 flex items-center space-x-1">
        <span className="z-30">
          <NotificationBell
            notifications={Object.values(unreadMessages)}
            icon={Bell}
          />
        </span>
        <span className="z-30">
          <NotificationBell
            notifications={inviteCounter}
            onNotificationsClick={handleNotificationClick}
            icon={InviteBell}
          />
        </span>
        <span className="z-50">
          <button onClick={handleToggle} className="p-1 rounded">
            {isOpen ? (
              <NavClose className="icon" height={35} />
            ) : (
              <NavOpen className="icon" height={35} />
            )}
          </button>
        </span>
      </div>

      <div
        className={`z-50 fixed top-0 left-0 h-full bg-navbar-light dark:bg-navbar-dark text-black dark:text-white w-64 min-h-screen transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500`}
      >
        <div className="p-4 border-b-2 border-black dark:border-white">
          <ProfileNavDisplay />
        </div>
        <nav className="p-4 h-full">
          <ul className="mb-4 text-xl font-semibold">
            <li className="my-2">
              <Link to="/app/profile" onClick={handleToggle}>
                Profil
              </Link>
            </li>
            <li className="my-2">
              <Link to="/app/chat" onClick={handleToggle}>
                Chatt
              </Link>
            </li>
            <li className="my-2 pt-10 flex justify-end">
              <button
                onClick={handleLogout}
                className="px-2 py-1 mt-2 text-sm border border-black rounded bg-white text-black"
              >
                Logga ut
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {showInviteManager && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-container-light dark:bg-container-dark p-4 rounded border text-black dark:text-white border-black/20 dark:border-white/20">
            <InviteManager
              invites={filteredInvites}
              handleIgnoreInvite={handleIgnoreInvite}
              handleAcceptInvite={handleAcceptInvite}
            />
            <div className="flex justify-end pt-5">
              <button
                onClick={handleNotificationClick}
                className="mr-1 px-2 py-1 rounded text-sm font-semibold bg-btnDelete-light dark:bg-btnDelete-dark  text-white"
              >
                Stäng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
