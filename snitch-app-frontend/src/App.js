import React, { useState, useEffect } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:5000");
function App() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        socket.on("receiveMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });
        return () => socket.off("receiveMessage");
    }, []);
    const sendMessage = () => {
        if (message.trim()) {
            socket.emit("sendMessage", message);
            setMessage("");
        }
    };
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Chat App</h1>
            <div className="border p-2 h-60 overflow-auto">
                {messages.map((msg, idx) => (
                    <p key={idx} className="border-b p-1">{msg}</p>
                ))}
            </div>
            <input
                className="border p-1"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="bg-blue-500 text-white px-2 py-1 ml-2" onClick={sendMessage}>
                Send
            </button>
        </div>
    );
}
export default App;