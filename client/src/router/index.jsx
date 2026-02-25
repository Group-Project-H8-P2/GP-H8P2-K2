import { createBrowserRouter } from "react-router-dom";
import JoinPage from "../pages/JoinPage";
import ChatPage from "../pages/ChatPage";

export const router = createBrowserRouter([
  { path: "/", element: <JoinPage /> },
  { path: "/chat", element: <ChatPage /> },
]);