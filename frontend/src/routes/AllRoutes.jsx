import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "@pages/Login";
import Register from "@pages/Register";
import Chat from "@pages/Chat";
import Dashboard from "@pages/Dashboard";
import NotFound from "@shared/NotFound";
import { UserProvider } from "@contexts/UserContext";
import { MessageProvider } from "@contexts/MessageContext";

export default function AllRoutes() {
  return (
    <>
      <Routes>
        <Route index path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
