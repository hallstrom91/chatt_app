import { EditUser, EditUserSecure } from "@utils/svgIcons";

export default function UserNavigation({ setActiveTab }) {
  return (
    <>
      <nav className="p-2 text-black  dark:text-white">
        <ul className="flex-col justify-center items-center align-middle">
          <li
            onClick={() => setActiveTab("profile")}
            className="py-2 text-xs lg:text-sm flex items-center cursor-pointer font-bold border-b"
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
            Inställningar
          </li>
        </ul>
      </nav>
    </>
  );
}
