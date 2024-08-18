import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useUser, useMessage } from "@hooks/useContextHooks";
import { useUnreadMessages } from "@hooks/useUnreadMessages";
import ProfileNavDisplay from "@profile/ProfileNavDisplay";
import InviteResponse from "@invites/InviteResponse";
import NotificationBell from "@shared/NotificationBell";
import NavOpen from "@svg/NavOpen.svg?react";
import NavClose from "@svg/NavClose.svg?react";
import Bell from "@svg/Bell.svg?react";
import InviteBell from "@svg/InviteBell.svg?react";
import useLocalStorage from "@hooks/useLocalStorage";
import UnreadMessagesPopup from "@invites/UnreadMessagesPopup";

export default function SideNavigation() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const unreadMessages = useUnreadMessages();
  const { activeConversation, setActiveConversation, fetchConversation } =
    useMessage();
  const {
    invites,
    handleIgnoreInvite,
    ignoredInvites,
    setIgnoredInvites,
    fetchUserInvites,
    acceptedInvites,
    setAcceptedInvites,
    handleAcceptInvite,
  } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showInviteResponse, setShowInviteResponse] = useState(false);
  //unread msg popup
  const [showUnreadPopup, setShowUnreadPopup] = useState(false);
  const [selectedUnreadId, setSelectedUnreadId] = useState(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    handleToggle();
    navigate("/", { replace: true });
  };

  // collect all invites for user - ADD TIMER?
  useEffect(() => {
    if (user) {
      const accepted = localStorage.getItem(`${user.id}_acceptedInvites`);
      setAcceptedInvites(accepted ? JSON.parse(accepted) : []);

      const ignored = localStorage.getItem(`${user.id}_ignoredInvites`);
      setIgnoredInvites(ignored ? JSON.parse(ignored) : []);

      /* const unread = localStorage.getItem(`${user.id}_unread`) */

      fetchUserInvites(user.id);
    }
  }, [user]);
  /* 
===========================
Invite and Message Display
===========================
*/

  // handle invite manger display / close
  const handleNotificationClick = () => {
    setShowInviteResponse(!showInviteResponse);
  };

  // exclude accepted & ignored invites from list
  const filteredInvites = (invites || []).filter(
    (invite) =>
      !ignoredInvites.includes(invite.conversationId) &&
      !acceptedInvites.includes(invite.conversationId)
  );

  // get length for total invites
  const inviteCounter = filteredInvites.length;

  // convert to array

  const unreadMessagesArray = Object.values(unreadMessages);

  // count array messages
  const totalUnreadMessages = unreadMessagesArray.reduce(
    (total, count) => total + count,
    0
  );

  // toggle component display
  const handleOpenUnread = () => {
    setShowUnreadPopup(!showUnreadPopup);
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="bg-container-light dark:bg-container-dark border border-black/20 dark:border-white/20 rounded-lg fixed top-2 right-4 z-50 flex items-center space-x-1">
        <span className="z-30">
          <NotificationBell
            notifications={[totalUnreadMessages]}
            onNotificationsClick={handleOpenUnread}
            icon={Bell}
          />
        </span>
        <span className="z-30">
          <NotificationBell
            notifications={[inviteCounter]}
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
              <Link to="/profile" onClick={handleToggle}>
                Profil
              </Link>
            </li>
            <li className="my-2">
              <Link to="/chat" onClick={handleToggle}>
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
      {/* popup list for unread messages  */}
      {showUnreadPopup && (
        <>
          <UnreadMessagesPopup
            unreadMessages={unreadMessages}
            onClose={() => setShowUnreadPopup(false)}
          />
        </>
      )}
      {/* popup modul to accept or decline invites from others */}
      {showInviteResponse && (
        <>
          <InviteResponse
            invites={filteredInvites}
            handleIgnoreInvite={handleIgnoreInvite}
            handleAcceptInvite={handleAcceptInvite}
            onClose={() => setShowInviteResponse(false)}
          />
        </>
      )}
    </>
  );
}