import { useState, useEffect } from "react";
import { useAuth, useMessage, useUser } from "@hooks/useContextHooks";
import { DefaultAvatar } from "@utils/svgIcons";

export default function ProfileDisplay() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  //DELETE THIS
  // Error tester
  const [count, setCount] = useState(0);

  const forceError = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    if (count === 2) {
      throw new Error("Crash Test Successfull!");
    }
  });

  return (
    <>
      <section className="p-2 text-black dark:text-white">
        {/*  page text display */}
        <h1 className="lg:text-xl text-lg font-bold uppercase">Profil</h1>

        <div className="flex flex-col lg:flex-row">
          {/* display current user info */}
          <div className="w-2/3 flex justify-start pt-3">
            <div className="pt-2 w-full">
              <p className="lg:text-sm text-xs font-semibold">
                Unikt-Id:{" "}
                <span className="lg:text-sm text-xs tracking-tight font-normal bg-neutral-300 dark:bg-neutral-600 px-2 rounded-sm">
                  {user.id}
                </span>
              </p>
              <p className="lg:text-sm text-xs font-semibold">
                Namn:{" "}
                <span className="lg:text-sm text-xs tracking-tight font-normal bg-neutral-300 dark:bg-neutral-600 px-2 rounded-sm">
                  {user.username}
                </span>
              </p>
              <p className="lg:text-sm text-xs font-semibold">
                Epost:{" "}
                <span className="lg:text-sm text-xs tracking-tight font-normal bg-neutral-300 dark:bg-neutral-600 px-2 rounded-sm">
                  {user.email}
                </span>
              </p>
              <div className="w-full mt-2 border-2 border-black/20 rounded"></div>
            </div>
          </div>
          <div className="w-full flex justify-end">
            <img
              className="object-cover w-20 h-20 lg:w-32 lg:h-32 rounded-full border-4 border-container-dark dark:border-container-light"
              src={user.avatar || DefaultAvatar}
              alt="user avatar"
            />
          </div>
        </div>
        <div className="flex flex-row">
          <div className="w-3/4 flex justify-start py-2">
            <button
              onClick={forceError}
              className="tracking-tighter text-sm border rounded border-white px-2"
            >
              En överraskningsknapp - Click Me x2
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
