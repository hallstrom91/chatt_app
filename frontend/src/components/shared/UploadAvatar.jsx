import { useState } from "react";
import * as Sentry from "@sentry/react";

export default function UploadAvatar({ onSelect, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const IMGBB_TOKEN = import.meta.env.VITE_IMGBB_TOKEN;

  const handleFileLoad = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const resizedFile = await resizeImage(file, 300, 300);

      setSelectedFile(resizedFile);
    }
  };

  const handleConfirmSelection = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_TOKEN}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.success) {
        onSelect(data.data.display_url);
        onClose();
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // calc the new dimensions and keep aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        /* set new dimensions */
        canvas.width = width;
        canvas.height = height;

        // draw new pic-size to canvas
        ctx.drawImage(img, 0, 0, width, height);

        /* convert to Blob */
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          file.type,
          1.0
        );
      };
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="w-80 bg-container-light dark:bg-container-dark p-4 rounded border text-black dark:text-white border-black/20 dark:border-white/20">
        <div className="">
          <h1 className="text-xl font-bold mb-4">Ladda upp Avatar</h1>
        </div>
        <div>
          <input type="file" accept="image/*" onChange={handleFileLoad} />
        </div>

        <div className="flex justify-end pt-5">
          <button
            onClick={onClose}
            className="mr-1 px-2 py-2 rounded bg-btnNeutral-light dark:bg-btnNeutral-dark  dark:text-black  text-white"
          >
            Avbryt
          </button>
          <button
            onClick={handleConfirmSelection}
            className="px-2 py-2 bg-btnPrimary-light dark:bg-btnPrimary-dark text-white rounded"
          >
            Bekräfta
          </button>
        </div>
      </div>
    </div>
  );
}
