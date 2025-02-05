require("dotenv").config();  

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// Import Firestore functions
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

// Use environment variables
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
const io = new Server(server, {
    cors: { origin: "*" }
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("sendMessage", async (message) => {
        try {
            // Save message to Firestore
            await addDoc(collection(db, "messages"), {
                text: message,
                timestamp: Date.now()
            });

            // Emit the message to all clients
            io.emit("receiveMessage", message);
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
