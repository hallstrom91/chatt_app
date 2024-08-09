import { Routes, Route } from "react-router-dom";
import AuthProtection from "@routes/AuthProtection";
import Dashboard from "@pages/Dashboard";
import ChatInterface from "@pages/ChatInterface";
import SideNavigation from "@navigation/SideNavigation";

export default function PrivateRoutes() {
  return (
    <>
      <AuthProtection>
        <SideNavigation />
      </AuthProtection>
      <Routes>
        <Route
          path="/profile"
          element={
            <AuthProtection>
              <Dashboard />
            </AuthProtection>
          }
        />
        <Route
          path="/chat"
          element={
            <AuthProtection>
              <ChatInterface />
            </AuthProtection>
          }
        />
      </Routes>
    </>
  );
}
