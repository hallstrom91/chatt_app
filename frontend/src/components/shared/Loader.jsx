import { useState, useEffect } from "react";

export default function Loader() {
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-b-primary-dark border-t-secondary-dark dark:border-b-primary-light dark:border-t-secondary-light"></div>
        <div className="text-bold text-lg pt-2">Laddar...</div>
      </div>
    </>
  );
}
