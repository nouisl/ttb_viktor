const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDocs } = require("firebase/firestore");

const firebaseConfig = { /* Your Firebase Config */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const saveMessage = async (message) => {
    await addDoc(collection(db, "messages"), { text: message, timestamp: Date.now() });
};

module.exports = { saveMessage };
