require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const nodemailer = require("nodemailer");

// Firebase Imports
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDocs } = require("firebase/firestore");

// 🔥 Firebase Configuration
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Store connected users
let users = {};

// 📩 Function to Save Message to Firestore
const saveMessage = async ({ sender, receiver, message }) => {
    try {
        await addDoc(collection(db, "messages"), {
            sender,
            receiver,
            text: message,
            timestamp: new Date().toISOString()
        });
        console.log(`✅ Message saved: ${sender} -> ${receiver}: ${message}`);
    } catch (error) {
        console.error("❌ Error saving message:", error);
    }
};

// 🔥 WebSocket Connection
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Store user in `users` list
    socket.on("joinChat", (username) => {
        users[socket.id] = username;
        console.log(`📌 ${username} joined the chat.`);
        io.emit("userList", Object.values(users)); // Broadcast online users
    });

    // Listen for private messages
    socket.on("sendMessage", async ({ sender, receiver, message }) => {
        console.log(`💬 ${sender} -> ${receiver}: ${message}`);

        await saveMessage({ sender, receiver, message });

        // Find recipient's socket ID
        const recipientSocketId = Object.keys(users).find(
            (key) => users[key] === receiver
        );

        if (recipientSocketId) {
            io.to(recipientSocketId).emit("receiveMessage", { sender, message });
        } else {
            console.log(`🚨 ${receiver} is offline. Message saved.`);
        }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        console.log(`${users[socket.id]} disconnected`);
        delete users[socket.id];
        io.emit("userList", Object.values(users)); // Update online users list
    });
});

// Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
