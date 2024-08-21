import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useMessage, useUser } from "@hooks/useContextHooks";

export default function ProfileUpdate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { deleteAllMessages } = useMessage();
  const { deleteUser, updateUser } = useUser();
  const [error, setError] = useState("");
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(false);
  const [confirmDeleteMessages, setConfirmDeleteMessages] = useState(false);

  // update state
  const [updateUserInfo, setUpdateUserInfo] = useState({
    avatar: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  // update input
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUpdateUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle update submit
  const handleSubmit = async () => {
    if (updateUserInfo.password !== updateUserInfo.confirmPassword) {
      setError("Lösenorden matchar inte varandra.");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    const updateData = {};
    if (updateUserInfo.password) updateData.password = updateUserInfo.password;
    if (updateUserInfo.email) updateData.email = updateUserInfo.email;
    if (updateUserInfo.username) updateData.username = updateUserInfo.username;
    if (updateUserInfo.avatar) updateData.avatar = updateUserInfo.avatar;

    try {
      const updatedData = await updateUser(user.id, updateData);
      console.log("User updated:", updatedData);
      setUpdateUserInfo({
        password: "",
        confirmPassword: "",
        email: "",
      });
    } catch (error) {
      console.error("Failed to update user:", error);
      setError("Användardata kunde inte uppdateras.");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handleDeleteAllMessages = async () => {
    try {
      await deleteAllMessages();
      setConfirmDeleteMessages(false);
    } catch (error) {
      console.error("Failed to delete all messages.", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      // add deleteallmessages first
      await deleteAllMessages();
      await deleteUser(user.id);
      setConfirmDeleteUser(false);
      navigate("/", { replace: true });
    } catch (error) {
      console.error(`Failed to delete user ${user.id}:`, error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <section className="p-2 text-black dark:text-white">
        {/*  page text display with bg??*/}
        <h1 className="lg:text-xl text-lg font-bold uppercase">Säkerhet</h1>
        <div className="flex flex-col lg:flex-row w-full p-2">
          <div className="flex flex-col w-full lg:w-1/2 pt-5">
            <h2 className="text-base font-semibold">Uppdatera Konto</h2>
            <div className="flex flex-col w-3/4 lg:w-2/3 pt-3">
              <label
                htmlFor="password"
                className="text-sm font-semibold tracking-tight"
              >
                Nytt Lösenord:
              </label>
              <input
                type="password"
                name="password"
                value={updateUserInfo.password}
                onChange={handleInput}
                className="mb-2 p-1 border rounded text-black"
              />
            </div>
            <div className="flex flex-col w-3/4 lg:w-2/3 pt-3">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-semibold tracking-tight"
              >
                Repetera Nytt Lösenord:
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={updateUserInfo.confirmPassword}
                onChange={handleInput}
                className="mb-2 p-1 border rounded text-black"
              />
            </div>
            <div className="flex flex-col w-3/4 lg:w-2/3 pt-3">
              <label
                htmlFor="email"
                className="text-sm font-semibold tracking-tight"
              >
                Uppdatera Email:
              </label>
              <input
                type="email"
                name="email"
                value={updateUserInfo.email}
                onChange={handleInput}
                className="mb-2 p-1 border rounded text-black"
              />
            </div>

            {error && (
              <p className="text-black dark:text-white text-xs">{error}</p>
            )}
            <div className="flex w-full justify-center pl-10 lg:pl-0 lg:w-2/3 lg:justify-end">
              <button
                onClick={() => handleSubmit()}
                className="px-4 py-2 bg-btnUpdate-light dark:bg-btnUpdate-dark text-white rounded text-sm"
              >
                Uppdatera
              </button>
            </div>
          </div>
          <div className="flex flex-col w-full lg:w-1/2 pt-5">
            <h2 className="text-base font-semibold">DangerZone</h2>
            <p className="text-sm font-semibold py-2">
              Alla val i "Danger Zone" är permanenta.
            </p>
            <div className="border-2 w-72 border-black/30 rounded"></div>

            <div className="pt-4">
              <p className="text-sm">Ta bort ditt konto?</p>
              <button
                onClick={() => setConfirmDeleteUser(true)}
                className="px-4 py-2 bg-btnDelete-light dark:bg-btnDelete-dark text-white rounded text-sm"
              >
                Ta Bort Konto
              </button>
            </div>
            <div className="pt-4">
              <p className="text-sm">Ta bort alla dina meddelanden?</p>
              <button
                onClick={() => setConfirmDeleteMessages(true)}
                className="px-4 py-2 bg-btnDelete-light dark:bg-btnDelete-dark text-white rounded text-sm"
              >
                Ta Bort Meddelanden
              </button>
            </div>
          </div>
        </div>
        {confirmDeleteUser && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg text-black">
              <p className="font-bold text-sm lg:text-base">
                Är du säker på att du vill ta bort ditt konto?
              </p>
              <p className="text-sm">Åtgärden går inte att ångra.</p>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleDeleteUser()}
                  className="mr-2 px-4 py-2 bg-btnDelete-light dark:bg-btnDelete-dark text-white rounded text-sm"
                >
                  Ja, ta bort mitt konto.
                </button>
                <button
                  onClick={() => setConfirmDeleteUser(false)}
                  className="px-4 py-2 bg-btnNeutral-light dark:bg-btnNeutral-dark text-white dark:text-black rounded text-sm"
                >
                  Avbryt
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmDeleteMessages && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center px-4">
            <div className="bg-white p-4 rounded-lg text-black">
              <p className="font-bold text-sm lg:text-base">
                Är du säker på att du vill ta bort ALLA meddelanden?
              </p>
              <p className="text-sm">Åtgärden går inte att ångra.</p>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleDeleteAllMessages()}
                  className="mr-2 px-4 py-2 bg-btnDelete-light dark:bg-btnDelete-dark text-white rounded text-sm"
                >
                  Ja, ta bort alla meddelanden.
                </button>
                <button
                  onClick={() => setConfirmDeleteMessages(false)}
                  className="px-4 py-2 bg-btnNeutral-light dark:bg-btnNeutral-dark text-white dark:text-black rounded text-sm"
                >
                  Avbryt
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
