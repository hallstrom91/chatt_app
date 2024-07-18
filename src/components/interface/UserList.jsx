import DefaultAvatar from "@images/DefaultAvatar.svg";

export default function UserList({ user }) {
  return (
    <>
      <div className="max-w-sm mx-auto bg-chatBg-light border-lines-light text-font-light  dark:border-lines-dark dark:text-font-dark dark:bg-chatBg-dark">
        <div className="p-3 flex items-center justify-between border-t border-secondary-light dark:border-secondary-dark cursor-pointer">
          <div className="flex items-center">
            <img
              className="rounded-full h-10 w-10"
              src={user.avatar ? user.avatar : DefaultAvatar}
              alt="user avatar"
            />
            <div className="ml-2 flex flex-col">
              <p className="leading-snug text-sm font-bold">@{user.username}</p>
              <p className="leading-snug text-xs">Id: {user.userId}</p>
            </div>
          </div>
          <button className="h-8 px-3 text-sm font-bold rounded-full border border-lines-light dark:border-lines-dark">
            Starta Chatt
          </button>
        </div>
      </div>
    </>
  );
}
