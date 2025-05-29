// src/components/Chatbot/Chatbot.jsx
import React, { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! Tôi là AI chatbot của Movie Recommender. Bạn có thể hỏi tôi về gợi ý phim hoặc bất kỳ điều gì về phim ảnh. Hãy thử hỏi: 'Gợi ý cho tôi một bộ phim hay'",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Simple theme detection (you can customize this)
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  // Simple user state (you can get this from localStorage or props)
  const [user] = useState({ id: 1, name: "User" });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/chatbot/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          user_id: user?.id || 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        text: data.ai_response,
        sender: "bot",
        timestamp: new Date(),
        movies: data.recommended_movies || null,
        type: data.type,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Xin lỗi, tôi gặp lỗi kết nối. Vui lòng thử lại sau.",
        sender: "bot",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        className={`w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center text-xl ${
          isOpen ? "rotate-45" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chatbot"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`absolute bottom-16 right-0 w-96 h-[600px] ${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-all duration-300`}
          style={{
            animation: "slideUp 0.3s ease-out",
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              🤖 AI Movie Assistant
            </h3>
            <button
              className="text-white hover:bg-white/20 rounded-full p-1 w-8 h-8 flex items-center justify-center transition-colors"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            className={`flex-1 p-4 overflow-y-auto space-y-4 ${
              isDark ? "bg-gray-900" : "bg-gray-50"
            }`}
          >
            {messages.map((message) => (
              <Message key={message.id} message={message} isDark={isDark} />
            ))}
            {isLoading && <LoadingMessage isDark={isDark} />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className={`p-4 border-t ${
              isDark
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            } flex gap-2`}
          >
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn của bạn..."
              disabled={isLoading}
              rows={1}
              className={`flex-1 p-3 rounded-2xl border resize-none outline-none transition-colors ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              style={{ maxHeight: "120px" }}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="w-11 h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "➤"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Inline styles for animation */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const Message = ({ message, isDark }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] ${
          message.sender === "user" ? "text-right" : "text-left"
        }`}
      >
        <div
          className={`p-3 rounded-2xl ${
            message.sender === "user"
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
              : message.isError
              ? "bg-red-100 border border-red-200 text-red-800 rounded-bl-md"
              : isDark
              ? "bg-gray-700 border border-gray-600 text-white rounded-bl-md"
              : "bg-white border border-gray-200 text-gray-900 rounded-bl-md"
          } shadow-sm`}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>

          {/* Movie Recommendations */}
          {message.movies && (
            <div
              className={`mt-3 p-3 rounded-lg ${
                isDark ? "bg-blue-900/30" : "bg-blue-50"
              } border-l-4 border-blue-500`}
            >
              <strong className="text-blue-600 text-sm block mb-2">
                🎬 Danh sách phim gợi ý:
              </strong>
              <ul className="space-y-1">
                {message.movies.map((movie, index) => (
                  <li
                    key={index}
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    • {movie}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div
          className={`text-xs mt-1 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

const LoadingMessage = ({ isDark }) => (
  <div className="flex justify-start">
    <div
      className={`max-w-[80%] p-3 rounded-2xl rounded-bl-md ${
        isDark
          ? "bg-gray-700 border border-gray-600"
          : "bg-white border border-gray-200"
      } shadow-sm`}
    >
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
        <span
          className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
        >
          AI đang suy nghĩ...
        </span>
      </div>
    </div>
  </div>
);

export default Chatbot;
