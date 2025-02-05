import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://192.168.200.69:5000", { transports: ["websocket"] });

function App() {
    const [username, setUsername] = useState("");
    const [receiver, setReceiver] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Receive messages
        socket.on("receiveMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        // Update online users list
        socket.on("userList", (onlineUsers) => {
            setUsers(onlineUsers);
        });

        return () => {
            socket.off("receiveMessage");
            socket.off("userList");
        };
    }, []);

    const joinChat = () => {
        if (username.trim()) {
            socket.emit("joinChat", username);
        }
    };

    const sendMessage = () => {
        if (message.trim() && username.trim() && receiver.trim()) {
            socket.emit("sendMessage", { sender: username, receiver, message });
            setMessage("");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">🔥 Snitch Chat</h1>

            {/* Username Input */}
            <input
                className="border p-1 mb-2 w-full"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button className="bg-green-500 text-white px-2 py-1 mb-4" onClick={joinChat}>
                Join Chat
            </button>

            {/* Online Users List */}
            <h2 className="text-lg font-bold">🟢 Online Users</h2>
            <ul>
                {users.map((user, idx) => (
                    <li key={idx} onClick={() => setReceiver(user)} className="cursor-pointer p-1 hover:bg-gray-200">
                        {user}
                    </li>
                ))}
            </ul>

            {/* Selected User */}
            <h2 className="text-lg font-bold mt-4">📩 Chatting with: {receiver || "Select a user"}</h2>

            {/* Messages Display */}
            <div className="border p-2 h-60 overflow-auto">
                {messages
                    .filter(msg => msg.sender === receiver || msg.sender === username)
                    .map((msg, idx) => (
                        <p key={idx} className="border-b p-1">
                            <strong>{msg.sender}:</strong> {msg.message}
                        </p>
                    ))}
            </div>

            {/* Message Input */}
            <input
                className="border p-1 w-full"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="bg-blue-500 text-white px-2 py-1 mt-2 w-full" onClick={sendMessage}>
                Send
            </button>
        </div>
    );
}

export default App;
