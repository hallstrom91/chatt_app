import { useState, useEffect } from "react";
import { useAuth, useMessage, useUser } from "@hooks/useContextHooks";
import DefaultAvatar from "@images/DefaultAvatar.svg";

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

        <div className="flex flex-row">
          {/* display current user info */}
          <div className="w-3/4 flex justify-start pt-3">
            <div className="pt-2 w-full">
              <p className="lg:text-sm text-xs font-semibold">
                Id:{" "}
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
                Avatar:{" "}
                <span className="lg:text-sm text-xs tracking-tight font-normal bg-neutral-300 dark:bg-neutral-600 px-2 rounded-sm">
                  {user.avatar}
                </span>
              </p>
              <div className="w-full mt-2 border-2 border-black/20 rounded"></div>
            </div>
          </div>
          <div className="w-1/4 flex justify-end">
            <div className="flex-col">
              <div className="border-2 rounded-sm w-20 h-20 lg:w-32 lg:h-32">
                <img
                  className="object-contain border-2 border-double border-black bg-white"
                  src={user.avatar || DefaultAvatar}
                />
              </div>
              <div className="flex justify-end">
                <button className="px-2 py-1 mt-2 text-sm border border-black rounded bg-white text-black">
                  Ändra
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="w-3/4 flex justify-start pb-2">input fields here</div>
          {/* error test - DELETE THIS */}
          <div className="w-1/4 flex justify-end py-2">
            <button
              onClick={forceError}
              className="tracking-tighter text-sm border rounded border-white px-2"
            >
              Trigger Error
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
