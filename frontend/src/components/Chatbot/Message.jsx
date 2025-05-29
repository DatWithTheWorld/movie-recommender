// src/components/Chatbot/Message.jsx
import React from "react";

const Message = ({ message }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`message ${message.sender}-message ${
        message.isError ? "error" : ""
      }`}
    >
      <div className="message-content">
        <p>{message.text}</p>

        {/* Display movie recommendations if available */}
        {message.movies && (
          <div className="movie-recommendations">
            <strong>🎬 Danh sách phim gợi ý:</strong>
            <ul>
              {message.movies.map((movie, index) => (
                <li key={index} className="movie-item">
                  {movie}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="message-time">{formatTime(message.timestamp)}</div>
    </div>
  );
};

const LoadingMessage = () => (
  <div className="message bot-message loading">
    <div className="message-content">
      <div className="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p>AI đang suy nghĩ...</p>
    </div>
  </div>
);

export { Message, LoadingMessage };
