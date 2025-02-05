import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; // Import custom styles

const socket = io("http://192.168.200.69:5000", { transports: ["websocket"] });

function App() {
    const [username, setUsername] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [receiver, setReceiver] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState({});
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.on("receiveMessage", (msg) => {
            setMessages((prev) => ({
                ...prev,
                [msg.sender]: [...(prev[msg.sender] || []), msg],
            }));
        });

        socket.on("userList", (onlineUsers) => {
            setUsers(onlineUsers);
        });

        return () => {
            socket.off("receiveMessage");
            socket.off("userList");
        };
    }, []);

    const joinChat = () => {
        if (!username.trim()) {
            alert("Please enter a username to join the chat.");
            return;
        }
        socket.emit("joinChat", username);
        setIsLoggedIn(true);
    };

    const sendMessage = () => {
        if (!username) {
            alert("Please enter a username before sending messages.");
            return;
        }
        if (message.trim() && receiver.trim()) {
            const msgData = { sender: username, receiver, message };
            socket.emit("sendMessage", msgData);

            setMessages((prev) => ({
                ...prev,
                [receiver]: [...(prev[receiver] || []), { sender: "Me", message }],
            }));

            setMessage("");
        }
    };

    return (
      <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
          <div className="chat-container">
              <h1 className="chat-title">🔥 Snitch Chat</h1>
  
              {!isLoggedIn ? (
                  <div className="login-section">
                      <div className="input-group">
                          <input
                              className="form-control"
                              placeholder="Enter your name"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                          />
                          <button className="btn btn-success" onClick={joinChat}>
                              Join Chat
                          </button>
                      </div>
                  </div>
              ) : (
                  <div className="chat-wrapper">
                      <div className="users-list">
                          <h2>Online Users</h2>
                          <ul className="list-group">
                              {users.length > 0 && (
                                  <li className="list-group-item active">👤 {username} (You)</li>
                              )}
                              {users
                                  .filter((user) => user !== username)
                                  .map((user, idx) => (
                                      <li
                                          key={idx}
                                          className={`list-group-item ${
                                              receiver === user ? "active-user" : ""
                                          }`}
                                          onClick={() => setReceiver(user)}
                                      >
                                          {user}
                                      </li>
                                  ))}
                          </ul>
                      </div>
  
                      <div className="chat-section">
                          {receiver ? (
                              <>
                                  <h2>💬 Chatting with: {receiver}</h2>
                                  <div className="messages-box">
                                      {(messages[receiver] || []).map((msg, idx) => (
                                          <p
                                              key={idx}
                                              className={`message ${
                                                  msg.sender === "Me" ? "sent" : "received"
                                              }`}
                                          >
                                              <strong>{msg.sender}:</strong> {msg.message}
                                          </p>
                                      ))}
                                  </div>
  
                                  <div className="input-group">
                                      <input
                                          className="form-control"
                                          placeholder="Type a message..."
                                          value={message}
                                          onChange={(e) => setMessage(e.target.value)}
                                          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                      />
                                      <button className="btn btn-primary" onClick={sendMessage}>
                                          Send
                                      </button>
                                  </div>
                              </>
                          ) : (
                              <h3>Select a user to start chatting</h3>
                          )}
                      </div>
                  </div>
              )}
          </div>
      </div>
  );

}

export default App;
