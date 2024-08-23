import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useMessage, useUser } from "@hooks/useContextHooks";
import { validateEmail, validatePassword } from "@utils/authUtils";
import RandomAvatar from "@shared/RandomAvatar";
import UploadAvatar from "@shared/UploadAvatar";
import * as Sentry from "@sentry/react";

export default function ProfileUpdate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { deleteAllMessages } = useMessage();
  const { deleteUser, updateUser } = useUser();
  const [error, setError] = useState("");
  const [dangerZoneError, setDangerZoneError] = useState("");
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(false);
  const [confirmDeleteMessages, setConfirmDeleteMessages] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showRandomAvatars, setShowRandomAvatars] = useState(false);
  const [showUploadAvatar, setShowUploadAvatar] = useState(false);
  let timeoutId; // change to ref

  const handleShowRandomAvatars = () => {
    setShowRandomAvatars(!showRandomAvatars);
  };

  const handleShowUploadAvatar = () => {
    setShowUploadAvatar(!showUploadAvatar);
  };

  const handleAvatarUpdate = (avatar) => {
    if (!avatar) return;
    setSelectedAvatar(avatar);
    setUpdateUserInfo((prev) => ({
      ...prev,
      avatar: avatar,
    }));
  };

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
      timeoutId = setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }

    // validate email format
    if (updateUserInfo.email && !validateEmail(updateUserInfo.email)) {
      setError("Ogiltig Epost-adress.");
      timeoutId = setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }

    // validate password strength
    if (updateUserInfo.password && !validatePassword(updateUserInfo.password)) {
      setError(
        "Lösenordet måste vara sex tecken långt, innehålla en siffra och ett specialtecken !&#$%^&*"
      );
      timeoutId = setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }

    // empty object for updating data
    const updateData = {};
    // control if value needs to be included and updated
    if (updateUserInfo.password && updateUserInfo.password.trim()) {
      updateData.password = updateUserInfo.password;
    }

    if (updateUserInfo.email && updateUserInfo.email.trim()) {
      updateData.email = updateUserInfo.email;
    }

    if (updateUserInfo.avatar && updateUserInfo.avatar.trim()) {
      updateData.avatar = updateUserInfo.avatar;
    }

    if (Object.keys(updateData).length === 0) {
      setError("Inga giltiga uppgifter att uppdatera.");
      setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }

    try {
      const updatedData = await updateUser(user.id, updateData);

      // get new values to update localStorage values
      const updateUserInMemory = {
        ...user,
        ...(updateUserInfo.avatar && { avatar: updateUserInfo.avatar }),
        ...(updateUserInfo.email && { email: updateUserInfo.email }),
      };

      localStorage.setItem("user", JSON.stringify(updateUserInMemory));
      setUpdateUserInfo({
        password: "",
        confirmPassword: "",
        email: "",
        username: "",
        avatar: "",
      });
      setSelectedAvatar(null);
    } catch (error) {
      Sentry.captureException(error);
      setError("Användardata kunde inte uppdateras.");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  // delete all messages from user
  const handleDeleteAllMessages = async () => {
    try {
      await deleteAllMessages();
      setConfirmDeleteMessages(false);
    } catch (error) {
      setConfirmDeleteMessages(false);
      Sentry.captureException(error);
      setDangerZoneError(
        "Ett fel uppstod. Dina Meddelande kunde inte raderas."
      );
      setTimeout(() => {
        setDangerZoneError("");
      }, 5000);
    }
  };

  // delete all messages and account
  const handleDeleteUser = async () => {
    try {
      await deleteAllMessages();
      await deleteUser(user.id);
      setConfirmDeleteUser(false);
      navigate("/", { replace: true });
    } catch (error) {
      setConfirmDeleteUser(false);
      Sentry.captureException(error);
      setDangerZoneError(
        "Ett fel uppstod. Ditt konto kunde inte tas bort just nu."
      );
      setTimeout(() => {
        setDangerZoneError("");
      }, 5000);
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
            <h2 className="text-base font-bold">Uppdatera Konto</h2>
            <div className="border-2 sm:w-48 xl:56 2xl:w-72 border-black/30 rounded"></div>
            <p className="text-xs 2xl:text-sm tracking-tight py-2">
              Uppdatera lösenord, byt email eller välj ny avatar.
            </p>
            <div className="flex flex-col w-3/4 lg:w-2/3 pt-3">
              <label
                htmlFor="password"
                className="text-sm font-semibold tracking-tight"
              >
                Nytt Lösenord
              </label>
              <input
                id="password"
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
                Bekräfta Nytt Lösenord
              </label>
              <input
                id="confirmPassword"
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
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={updateUserInfo.email}
                onChange={handleInput}
                className="mb-2 p-1 border rounded text-black"
                placeholder="Uppdatera@email.se"
              />
            </div>

            {error && (
              <p className="text-black dark:text-white text-xs my-2">
                {error}
                <span className="text-btnDelete-light dark:text-btnDelete-dark">
                  *
                </span>
              </p>
            )}
            {/* change avatar to random or upload */}
            <div className="flex flex-col w-full justify-start mb-4 lg:w-2/3 items-start mt-4">
              <p className="text-xs tracking-tight font-semibold mb-2">
                Avatar alternativ
              </p>
              <button
                className="w-full ml-1 mb-2 px-2 py-1 text-xs rounded bg-btnNeutral-light dark:bg-btnNeutral-dark  dark:text-black  text-white"
                onClick={handleShowRandomAvatars}
              >
                Välj Avatar
              </button>
              <button
                className="w-full ml-1 px-2 py-1 text-xs rounded bg-btnNeutral-light dark:bg-btnNeutral-dark  dark:text-black  text-white"
                onClick={handleShowUploadAvatar}
              >
                Ladda upp
              </button>
            </div>
            {selectedAvatar && (
              <div className="flex flex-col w-1/2 items-end">
                <div className="flex pr-4 mb-2 lg:pl-6">
                  <p className="text-xs tracking-tight font-semibold">
                    Förhandsvisning
                  </p>
                </div>
                <div className="flex">
                  <img
                    src={selectedAvatar}
                    alt="user avatar"
                    className="object-cover w-20 h-20 lg:w-32 lg:h-32 rounded-full border-4 border-container-dark dark:border-container-light"
                  />
                </div>
              </div>
            )}
            <div className="flex w-full justify-center mt-4 pl-10 lg:pl-0 lg:w-2/3 lg:justify-end">
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
            <div className="border-2 sm:w-48 xl:56 2xl:w-72 border-black/30 rounded"></div>
            <p className="text-xs 2xl:text-sm tracking-tight py-2">
              Alla val i <span className="font-serif">"DangerZone"</span>
              är <span className="font-bold">permanenta.</span>
            </p>
            <div className="pt-4">
              <p className="text-sm">Ta bort ditt konto?</p>
              <p className="text-xs tracking-tight">
                Kontot och alla dina skickade meddelanden raderas.
              </p>
              <button
                onClick={() => setConfirmDeleteUser(true)}
                className="mt-2 px-4 py-2 bg-btnDelete-light dark:bg-btnDelete-dark text-white rounded text-sm"
              >
                Ta Bort Konto
              </button>
            </div>
            <div className="pt-4">
              <p className="text-sm">Ta bort alla dina meddelanden?</p>
              <p className="text-xs tracking-tight">
                Alla dina skickade meddelanden raderas.
              </p>
              <button
                onClick={() => setConfirmDeleteMessages(true)}
                className="mt-2 px-4 py-2 bg-btnDelete-light dark:bg-btnDelete-dark text-white rounded text-sm"
              >
                Ta Bort Meddelanden
              </button>
            </div>
            {dangerZoneError && (
              <p className="text-black dark:text-white text-xs my-2">
                {dangerZoneError}
                <span className="text-btnDelete-light dark:text-btnDelete-dark">
                  *
                </span>
              </p>
            )}
          </div>
        </div>

        {/* delete user modul-poup confirm / decline */}
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
        {/* delete all messages for user modul-popup confirm / decline */}
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
      {showRandomAvatars && (
        <>
          <RandomAvatar
            onSelect={handleAvatarUpdate}
            onClose={() => setShowRandomAvatars(false)}
          />
        </>
      )}
      {showUploadAvatar && (
        <>
          <UploadAvatar
            onSelect={handleAvatarUpdate}
            onClose={() => setShowUploadAvatar(false)}
          />
        </>
      )}
    </>
  );
}
