import { useState } from "react";
import UserNavigation from "@navigation/UserNavigation";
import ProfileDisplay from "@profile/ProfileDisplay";
import ProfileUpdate from "@profile/ProfileUpdate";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileDisplay />;
      case "security":
        return <ProfileUpdate />;
      default:
        return <ProfileDisplay />;
    }
  };

  return (
    <>
      <main className="pt-16 px-2 w-full">
        <div className="flex w-full">
          <div className="w-1/4 lg:w-1/6 flex flex-col pb-10">
            <div className="w-full h-full rounded-tl-lg rounded-bl-lg mx-2 bg-navbar-light dark:bg-navbar-dark border-l border-b border-t border-black/20 dark:border-white/20">
              <UserNavigation setActiveTab={setActiveTab} />
            </div>
          </div>
          <div className="w-3/4 lg:w-5/6 flex flex-row pb-10">
            <div className="w-full h-full rounded-br-lg rounded-tr-xl mx-2 bg-container-light dark:bg-container-dark border-r border-b border-t border-black/20 dark:border-white/20">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
