import { useState } from "react";

export default function RandomAvatar({ onSelect, onClose }) {
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const handleSelectAvatar = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleConfirmSelection = () => {
    onSelect(selectedAvatar);
    onClose();
  };

  const avatars = [
    "https://i.pravatar.cc/300?img=63",
    "https://i.pravatar.cc/300?img=65",
    "https://i.pravatar.cc/300?img=69",
    "https://i.pravatar.cc/300?img=70",
    "https://i.pravatar.cc/300?img=33",
    "https://i.pravatar.cc/300?img=9",
    "https://i.pravatar.cc/300?img=5",
    "https://i.pravatar.cc/300?img=1",
    "https://i.pravatar.cc/300?img=19",
    "https://i.pravatar.cc/300?img=26",
    "https://i.pravatar.cc/300?img=11",
    "https://i.pravatar.cc/300?img=18",
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div className="w-80 bg-container-light dark:bg-container-dark p-4 rounded border text-black dark:text-white border-black/20 dark:border-white/20">
          <div className="">
            <h1 className="text-xl font-bold mb-4">Välj din Avatar</h1>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {avatars.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt={`avatar-${index}`}
                onClick={() => handleSelectAvatar(avatar)}
                className={`cursor-pointer rounded-full hover:scale-110 transition-transform ${
                  selectedAvatar === avatar
                    ? "border-4 border-container-dark dark:border-container-light"
                    : ""
                }`}
              />
            ))}
          </div>
          <div className="flex justify-end pt-5">
            <button
              onClick={onClose}
              className="mr-1 px-2 py-1 rounded bg-btnNeutral-light dark:bg-btnNeutral-dark  dark:text-black  text-white"
            >
              Avbryt
            </button>
            <button
              onClick={handleConfirmSelection}
              disabled={!selectedAvatar}
              className="px-2 py-1 bg-btnPrimary-light dark:bg-btnPrimary-dark text-white rounded"
            >
              Bekräfta
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
