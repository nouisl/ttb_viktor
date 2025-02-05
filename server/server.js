require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const nodemailer = require("nodemailer");

// Firebase imports
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDocs } = require("firebase/firestore");

// Firebase Configuration (Using .env variables)
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

// Configure Nodemailer for sending emails
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

// User Email List - hardcoded for now
const userEmails = {
    "Anna": "anna@snitchchat.com",
    "Bob": "bob@snitchchat.com",
    "Charlie": "charlie@snitchchat.com",
    "David": "david@snitchchat.io",
};

// Function to send email notification
const sendEmail = async (recipient, sender, message) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: "🔥 Someone Talked About You!",
        text: `${sender} mentioned you in the chat: "${message}"`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📩 Email sent to ${recipient}`);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

// Function to save message to Firestore
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

// Function to get all messages from Firestore
const getMessages = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "messages"));
        return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error("❌ Error retrieving messages:", error);
        return [];
    }
};

// WebSocket Connection
let users = {};

io.on("connection", async (socket) => {
    console.log("User connected:", socket.id);

    // Send previous messages to the newly connected client
    const previousMessages = await getMessages();
    socket.emit("previousMessages", previousMessages);

    // Store user in users list
    socket.on("joinChat", (username) => {
        users[socket.id] = username;
        console.log(`📌 ${username} joined the chat.`);
        io.emit("userList", Object.values(users)); 
    });

    // Listen for new messages
    socket.on("sendMessage", async ({ sender, receiver, message }) => {
        console.log(`💬 ${sender} -> ${receiver}: ${message}`);

        if (!message || typeof message !== "string") {
            console.error("❌ Error: Message is missing or not a string!");
            return;
        }

        // Save message to Firestore
        await saveMessage({ sender, receiver, message });

        // Detect if a user's name is mentioned
        const mentionedUser = Object.keys(userEmails).find(user =>
            message.toLowerCase().includes(user.toLowerCase())
        );

        // Broadcast message to receiver if online
        const recipientSocketId = Object.keys(users).find(key => users[key] === receiver);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("receiveMessage", { sender, message });
        } else {
            console.log(`🚨 ${receiver} is offline. Message saved.`);
        }

        // If a user is mentioned, send them an email
        if (mentionedUser) {
            const recipientEmail = userEmails[mentionedUser];
            console.log(`📩 Mention detected: Sending email to ${mentionedUser} (${recipientEmail})`);
            await sendEmail(recipientEmail, sender, message);
        }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        console.log(`${users[socket.id]} disconnected`);
        delete users[socket.id];
        io.emit("userList", Object.values(users)); 
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => console.log(`🔥 Server running on port ${PORT}`));

