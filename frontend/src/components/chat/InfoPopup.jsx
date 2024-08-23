import { useEffect, useState, useRef } from "react";
import { NavClose } from "@utils/svgIcons";

export default function InfoPopup({ onClose, chatInfo }) {
  const closeRef = useRef(null);

  // close when click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (closeRef.current && !closeRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const hasMessages =
    chatInfo && chatInfo.messages && chatInfo.messages.length > 0;
  const hasConId = chatInfo && chatInfo.conversationId;
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div
          ref={closeRef}
          className="w-56 border rounded-lg z-40 p-2 bg-container-light dark:bg-container-dark text-black dark:text-white border-black/20 dark:border-white/20 "
        >
          <h1 className="text-base font-bold mb-4 mt-3">Information</h1>
          {hasMessages || hasConId ? (
            <ul className="pl-4 w-36">
              {hasMessages ? (
                <>
                  <li className="text-xs pb-1">
                    <span className="font-semibold tracking-tight flex">
                      Deltagares ID:
                    </span>
                    <span className="font-serif">
                      {chatInfo.messages.map((msg) => msg.userId).join(", ")}
                    </span>
                  </li>
                  <li className="text-xs pb-1">
                    <span className="font-semibold tracking-tight flex">
                      Antal Meddelanden:
                    </span>
                    <span className="font-serif">
                      {chatInfo.messages.length} st
                    </span>
                  </li>
                </>
              ) : (
                <li className="text-xs pb-1">
                  Ingen meddelande information hittad.
                </li>
              )}
              {hasConId ? (
                <li className="text-xs pb-1">
                  <span className="font-semibold tracking-tight flex">
                    ConID:
                  </span>
                  <span className="font-serif">{chatInfo.conversationId}</span>
                </li>
              ) : (
                <li className="text-xs pb-1">Inget conversationId hittat.</li>
              )}
            </ul>
          ) : (
            <p className="text-xs pb-1">Ingen information tillgänglig.</p>
          )}
          <div className="flex justify-end pt-5">
            <button
              onClick={onClose}
              className="mr-1 px-2 py-1 rounded text-sm font-semibold bg-btnNeutral-light dark:bg-btnNeutral-dark  dark:text-black  text-white"
            >
              Stäng
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
