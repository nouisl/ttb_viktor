require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const nodemailer = require("nodemailer");

// Firebase Imports
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDocs } = require("firebase/firestore");

// 🔥 Firebase Configuration (Using .env variables)
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

// 📩 Configure Nodemailer for sending emails
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// 🔥 User Email List (Modify as needed)
const users = {
    "Alice": "nadiakhan1203@gmail.com",
    "Bob": "Nadiakh1203@gmail.com",
    "Charlie": "islamnoushin2001@gmail.com"
};

// 📩 Function to Send Email
const sendEmail = async (recipient, sender, message) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: "🔥 Someone Talked About You!",
        text: `${sender} said: "${message}"`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📩 Email sent to ${recipient}`);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

// 🔥 Function to Save Message to Firestore
const saveMessage = async ({ sender, message }) => {
    try {
        console.log("Saving message:", message);
        await addDoc(collection(db, "messages"), {
            sender: String(sender).trim(),
            text: String(message).trim(),
            timestamp: new Date().toISOString()
        });

        console.log("✅ Message saved successfully.");
    } catch (error) {
        console.error("❌ Error saving message:", error);
    }
};

// 🔥 Function to Get All Messages from Firestore
const getMessages = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "messages"));
        return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error("❌ Error retrieving messages:", error);
        return [];
    }
};

// 🔥 WebSocket Connection
io.on("connection", async (socket) => {
    console.log("User connected:", socket.id);

    // Send previous messages to the newly connected client
    const previousMessages = await getMessages();
    socket.emit("previousMessages", previousMessages);

    // Listen for new messages
    socket.on("sendMessage", async ({ sender, message }) => {
        console.log(`💬 Received message from ${sender}: ${message}`);

        if (!message || typeof message !== "string") {
            console.error("❌ Error: Message is missing or not a string!");
            return;
        }

        // Debugging: Log the exact data being sent to Firestore
        console.log("📌 Data being saved to Firestore:", {
            sender: String(sender).trim(),
            text: String(message).trim(),
            timestamp: new Date().toISOString()
        });

        // Save message to Firestore
        await saveMessage({ sender, message });

        // Detect if a user's name is mentioned
        const mentionedUser = Object.keys(users).find(user =>
            message.toLowerCase().includes(user.toLowerCase())
        );

        // Broadcast message to all clients
        io.emit("receiveMessage", { sender, text: message });

        // If a user is mentioned, send them an email
        if (mentionedUser) {
            const recipientEmail = users[mentionedUser];
            console.log(`📩 Mention detected: Sending email to ${mentionedUser} (${recipientEmail})`);
            await sendEmail(recipientEmail, sender, message);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
