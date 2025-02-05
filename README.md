# 🔥 Snitch Chat

**Snitch Chat** is a real-time messaging app developed by **Nadia Khan, Vanshita Verma and Noushin Islam** the TTB x Manchester: Bad Ideas Build Day. The app allows users to send and receive messages, track online users, and automatically notify users via email when their name is mentioned in a chat.

## 📌 Features

✅ **Real-time Chat:** Users can send and receive messages instantly.  
✅ **User Tracking:** Displays a list of online users.  
✅ **Email Alerts:** If someone talks about you, you get an automatic email notification.  
✅ **Multiple Chat Rooms:** Private chats between users.  
✅ **Responsive UI:** Works on desktop and mobile.  
✅ **Firestore Integration:** Messages are saved and retrieved from Firebase.  

## 🎯 Technologies Used

- **Frontend:** React.js, Bootstrap & Socket.io Client
- **Backend:** Node.js, Express.js, Socket.io Server & Firebase Firestore
- **Database:** Firebase Firestore
- **Email Notifications:** Nodemailer (Gmail SMTP)
- **Hosting:** Local Deployment (Cloud hosting possible)

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/your-username/snitch-chat.git
cd snitch-chat
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Setup Environment Variables
```sh
PORT=5000
API_KEY=your_firebase_api_key
AUTH_DOMAIN=your_firebase_auth_domain
PROJECT_ID=your_firebase_project_id
STORAGE_BUCKET=your_firebase_storage_bucket
MESSAGING_SENDER_ID=your_messaging_sender_id
APP_ID=your_firebase_app_id

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### 4️⃣ Start the Backend Server
```sh
cd server
node server.js
```

### 5️⃣ Start the Frontend
```sh
cd snitch-app-frontend
npm start
```


---

## 📁 Project Structure

```
📦 TTB_VIKTOR
 ┣ 📂 server
 ┃ ┣ 📄 server.js
 ┃ ┣ 📄 firebase.js
 ┃ ┣ 📄 package-lock.json
 ┃ ┣ 📄 .gitignore
 ┃ ┣ 📄 .env
 ┃ ┗ 📄 README.md
 ┣ 📂 snitch-app-frontend
 ┃ ┣ 📂 public
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 images
 ┃ ┃ ┣ 📄 App.js
 ┃ ┃ ┣ 📄 App.css
 ┃ ┃ ┣ 📄 index.js
 ┃ ┃ ┣ 📄 logo.svg
 ┃ ┃ ┗ 📄 README.md
 ┃ ┣ 📄 package.json
 ┃ ┣ 📄 package-lock.json
 ┃ ┗ 📄 .gitignore
 ┗ 📄 README.md
```

---

## 💡 Contributing

1. **Fork** the repository.
2. **Create a new branch:**
   ```sh
   git checkout -b feature-name
   ```
3. **Commit your changes:**
   ```sh
   git commit -m "Added new feature"
   ```
4. **Push to the branch:**
   ```sh
   git push origin feature-name
   ```
5. **Create a Pull Request.**

---

## 🛠 Future Enhancements

- ✅ **User Authentication (Google Login, Firebase Auth)**
- ✅ **Message Encryption for Privacy**
- ✅ **Group Chat Support**
- ✅ **Push Notifications (Firebase Cloud Messaging)**

---

## 📜 License

This project is open-source under the **MIT License**.

---

## 📢 Credits

Developed at **TTB x Manchester: Bad Ideas Build Day**  

🎉 Created by:
- **Nadia Khan**
- **Vanshita Verma**
- **Noushin Islam**

Check the hackathon page: [TTB x Manchester](https://lu.ma/proy470q)


