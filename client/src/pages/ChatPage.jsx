import { useEffect, useState, useRef, useContext } from "react";
import socket from "../socket/socket";
import api from "../services/api";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const { username } = useContext(UserContext);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.on("chat history", (history) => {
      setMessages(history);
      setTimeout(scrollToBottom, 100);
    });

    socket.on("chat message", (message) => {
      setMessages((prev) => [...prev, message]);
      setAiLoading(false);
      setTimeout(scrollToBottom, 100);
    });

    socket.on("typing", (user) => {
      if (user !== username) {
        setTypingUser(user);
        setTimeout(() => setTypingUser(null), 2000);
      }
    });

    return () => {
      socket.off("chat history");
      socket.off("chat message");
      socket.off("typing");
    };
  }, [username]);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post("/upload", formData);
    return data.imageUrl;
  };

  const sendMessage = async () => {
    if (!text && !selectedFile) return;

    try {
      setLoading(true);
      let imageUrl = "";

      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      setAiLoading(true);

      socket.emit("chat message", {
        text,
        imageUrl,
      });

      setText("");
      setSelectedFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (!username) {
      navigate("/");
    }
  }, [username, navigate]);

  return (
    <div className="flex h-screen bg-[#313338] text-white">
      <div className="w-60 bg-[#2b2d31] p-4 border-r border-[#1e1f22]">
        <h2 className="text-xl font-bold mb-6">💬 ChatRoom</h2>
        <p className="text-sm text-gray-400">Logged in as:</p>
        <p className="font-semibold text-blue-400">{username}</p>
      </div>

      <div className="flex flex-col flex-1">
        <div className="h-14 flex items-center px-6 border-b border-[#1e1f22] bg-[#2b2d31]">
          <h1 className="text-lg font-semibold">General Chat</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => {
            const isMe = msg.User?.username === username;

            return (
              <div
                key={msg.id}
                className={`flex ${
                  isMe ? "justify-end" : "justify-start"
                } animate-fadeIn`}
              >
                <div
                  className={`max-w-md px-4 py-3 rounded-2xl shadow-md ${
                    isMe
                      ? "bg-blue-600 rounded-br-none"
                      : "bg-[#404249] rounded-bl-none"
                  }`}
                >
                  <p className="text-xs text-gray-300 mb-1">
                    {msg.User?.username}
                  </p>

                  {msg.content && (
                    <p className="wrap-break-word whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  )}

                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt="uploaded"
                      className="mt-2 rounded-lg max-h-60"
                    />
                  )}
                </div>
              </div>
            );
          })}

          {aiLoading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="bg-[#404249] px-4 py-3 rounded-2xl rounded-bl-none shadow-md">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            </div>
          )}

          {typingUser && (
            <div className="text-sm text-gray-400 italic animate-pulse">
              {typingUser} is typing...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-[#1e1f22] bg-[#2b2d31] flex flex-col gap-2">
          {preview && (
            <div className="relative w-32">
              <img src={preview} alt="preview" className="rounded-lg" />
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreview(null);
                }}
                className="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              type="file"
              id="fileUpload"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                setSelectedFile(file);
                if (file) {
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />

            <label
              htmlFor="fileUpload"
              className="cursor-pointer bg-[#404249] hover:bg-[#4e5058] px-4 py-2 rounded-full text-sm transition"
            >
              🔗 Upload IMG
            </label>

            <textarea
              rows={1}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                socket.emit("typing", username);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a message... | @BotAI for AI response 🤖"
              className="flex-1 bg-[#404249] px-4 py-2 rounded-2xl outline-none resize-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full font-semibold transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Sending..." : "Send ➤"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
