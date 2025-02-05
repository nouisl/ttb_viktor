import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

function App() {
    const [name, setName] = useState(""); // User's name
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on("receiveMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => socket.off("receiveMessage");
    }, []);

    const sendMessage = () => {
        if (message.trim() && name.trim()) {
            socket.emit("sendMessage", { sender: name, message });
            setMessage("");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">🔥 Snitch Chat</h1>

            {/* User Name Input */}
            <input
                className="border p-1 mb-2 w-full"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            {/* Messages Display */}
            <div className="border p-2 h-60 overflow-auto">
                {messages.map((msg, idx) => (
                    <p key={idx} className="border-b p-1">
                        <strong>{msg.sender}:</strong> {msg.text}
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
