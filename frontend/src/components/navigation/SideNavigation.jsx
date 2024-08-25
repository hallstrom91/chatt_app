import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@hooks/useContextHooks";
import { useUnreadMessages } from "@hooks/useUnreadMessages";
import { NavOpen, NavClose, Bell, InviteBell } from "@utils/svgIcons";
import ProfileNavDisplay from "@profile/ProfileNavDisplay";
import InviteResponse from "@notifications/InviteResponse";
import NotificationBell from "@notifications/NotificationBell";
import UnreadMessagesPopup from "@notifications/UnreadMessagesPopup";

export default function SideNavigation() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const unreadMessages = useUnreadMessages();
  const { invites, fetchUserInvites, handleInviteResponse } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showInviteResponse, setShowInviteResponse] = useState(false);
  //unread msg popup
  const [showUnreadPopup, setShowUnreadPopup] = useState(false);
  const closeRef = useRef(null);
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

  // get length for total invites
  const inviteCounter = (invites || []).length;

  // convert to array
  const unreadMessagesArray = Object.values(unreadMessages);

  // filter out all conversations with 0 count
  const totalUnreadMessages = unreadMessagesArray.reduce((total, item) => {
    // if item is object with count prop, add the count to the total
    if (typeof item === "object" && item !== null && "count" in item) {
      return total + item.count;
    }
    return total;
  }, 0);

  // toggle component display
  const handleOpenUnread = () => {
    setShowUnreadPopup(!showUnreadPopup);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (closeRef.current && !closeRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleToggle]);

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
          <button onClick={handleToggle} className="flex items-center pr-1">
            {isOpen ? (
              <NavClose className="icon" height={35} />
            ) : (
              <NavOpen className="icon" height={35} />
            )}
          </button>
        </span>
      </div>

      <div
        ref={closeRef}
        className={`z-50 fixed top-0 left-0 h-full bg-navbar-light dark:bg-navbar-dark text-black dark:text-white w-64 min-h-screen transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500`}
      >
        <div className="p-4 border-b-2 border-black/50 dark:border-white/50">
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
                className="px-2 py-2 mt-2 text-base rounded bg-btnDelete-light dark:bg-btnDelete-dark text-white"
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
            invites={invites}
            handleInvite={handleInviteResponse}
            onClose={() => setShowInviteResponse(false)}
          />
        </>
      )}
    </>
  );
}
