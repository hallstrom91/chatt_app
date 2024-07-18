import React, { useState } from "react";
import UserProfile from "@users/UserProfile";
import UserNavigation from "@interface/UserNavigation";
import UpdateUser from "@users/edit/UpdateUser";
import RemoveUser from "@users/edit/RemoveUser";
import UserSecurity from "@users/edit/UserSecurity";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <UpdateUser />;
      case "security":
        return <UserSecurity />;
      default:
        return <UpdateUser />;
    }
  };
  return (
    <>
      <main className="pt-16 w-full bg-secondary-light dark:bg-secondary-dark shadow-xl shadow-black/20 dark:shadow-white/20">
        <div className="flex w-full">
          <div className="w-1/4 lg:w-1/6 flex flex-col pb-10">
            <div className="w-full h-full rounded-tl-lg rounded-bl-lg mx-2 bg-navbar-light dark:bg-navbar-dark">
              <UserNavigation setActiveTab={setActiveTab} />
            </div>
          </div>
          <div className="w-3/4 lg:w-5/6 flex flex-row pb-10">
            <div className="w-full h-full rounded-br-lg rounded-tr-xl mx-2 bg-primary-light dark:bg-primary-dark">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
