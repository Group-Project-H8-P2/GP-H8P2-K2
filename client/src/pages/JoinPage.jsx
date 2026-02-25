import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import { UserContext } from "../context/UserContext";

export default function JoinPage() {
  const [nameInput, setNameInput] = useState("");
  const { setUsername } = useContext(UserContext);
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!nameInput.trim()) return;

    setUsername(nameInput);
    socket.connect();
    socket.emit("join", nameInput);

    navigate("/chat");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleJoin();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#313338] text-white">
      <div className="bg-[#2b2d31] w-105 p-8 rounded-2xl shadow-2xl border border-[#1e1f22]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 tracking-wide">
            Welcome Back!
          </h1>
          <p className="text-gray-400 text-sm">
            Enter a username to join the chat
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-400 mb-2 tracking-wide">
            USERNAME
          </label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="e.g. ChatMaster3000"
            className="w-full bg-[#1e1f22] px-4 py-3 rounded-lg outline-none 
                       focus:ring-2 focus:ring-blue-500 
                       transition text-white placeholder-gray-500"
          />
        </div>

        <button
          onClick={handleJoin}
          className="w-full bg-blue-600 hover:bg-blue-700 
                     transition duration-200 
                     py-3 rounded-lg font-semibold 
                     shadow-lg hover:shadow-blue-500/30
                     cursor-pointer"
        >
          Enter Chat
        </button>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Real-time chat powered by Socket.io + AI 🤖
        </p>
      </div>
    </div>
  );
}