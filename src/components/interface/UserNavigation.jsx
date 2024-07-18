import EditUser from "@svg/EditUser.svg?react";
import EditUserSecure from "@svg/EditUserSecure.svg?react";
export default function UserNavigation({ setActiveTab }) {
  return (
    <>
      <nav className="p-2 text-font-light  dark:text-font-dark ">
        <ul className="flex-col justify-center items-center align-middle">
          <li
            onClick={() => setActiveTab("profile")}
            className="py-2 text-xs lg:text-sm flex items-center cursor-pointer font-bold border-b border-lines-light dark:border-lines-dark"
          >
            <span className="pr-1">
              <EditUser className="icon" height={20} />
            </span>
            Profil
          </li>
          <li
            onClick={() => setActiveTab("security")}
            className="py-2 text-xs lg:text-sm flex items-center cursor-pointer font-bold"
          >
            <span className="pr-1">
              <EditUserSecure className="icon" height={20} />
            </span>
            Säkerhet
          </li>
        </ul>
      </nav>
    </>
  );
}
