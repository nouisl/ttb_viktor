// Imports
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; 
import Logo from "./image/SnitchAppLogo.png";

// Initialize Socket.io connection to the local server - adjust as needed
const socket = io("http://192.168.200.69:5000", { transports: ["websocket"] });

function App() {
    // State variables
    const [username, setUsername] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [receiver, setReceiver] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState({});
    const [users, setUsers] = useState([]);

    // Listen for incoming messages and update user list
    useEffect(() => {
        socket.on("receiveMessage", (msg) => {
            setMessages((prev) => ({
                ...prev,
                [msg.sender]: [...(prev[msg.sender] || []), msg], // Append message to chat history
            }));
        });

        socket.on("userList", (onlineUsers) => {
            setUsers(onlineUsers); // Update the list of online users
        });

        return () => {
            socket.off("receiveMessage"); // Cleanup message listener
            socket.off("userList"); // Cleanup user list listener
        };
    }, []);

    // Function to handle user joining the chat
    const joinChat = () => {
        if (!username.trim()) {
            alert("Please enter a username to join the chat.");
            return;
        }
        socket.emit("joinChat", username); // Emit event to server
        setIsLoggedIn(true); // Update state to indicate user has joined
    };

    // Function to send a message
    const sendMessage = () => {
        if (!username) {
            alert("Please enter a username before sending messages.");
            return;
        }
        if (message.trim() && receiver.trim()) {
            const msgData = { sender: username, receiver, message };
            socket.emit("sendMessage", msgData);

            // Update local chat history
            setMessages((prev) => ({
                ...prev,
                [receiver]: [...(prev[receiver] || []), { sender: "Me", message }],
            }));

            setMessage(""); // Clear input field after sending
        }
    };

    return (
      <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
        {/* Main Chat Container */}
        <div className="chat-container">
            {/* Chat Title with Logo */}
            <h1 className="chat-title">
                <img src={Logo} alt="Snitch Chat Logo" className="chat-logo" />
                <span className="fw-bold">Snitch Chat</span>
            </h1>
            {/* Login Section - Displays when user is not logged in */}
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
                // Main Chat Interface (displayed when user is logged in)
                  <div className="chat-wrapper">
                    {/* Sidebar - Online Users List */}
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
                      {/* Chat Section */}
                      <div className="chat-section">
                          {receiver ? (
                              <>
                                {/* Chat Header */}
                                  <h2>💬 Chatting with: {receiver}</h2>
                                  {/* Chat Messages Box */}
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
                                  {/* Input Field and Send Button */}
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

// Export app
export default App;
