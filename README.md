# Kanvelope 📬✨

> **Kanvelope** is your go‐to playful Kanban board for personal and team productivity! Organize tasks in draggable lists, collaborate in real time with rich card details (descriptions, assignees, due dates, attachments), and upgrade to Premium for even more power. Built with React, Tailwind CSS & Firebase, Kanvelope makes work feel fun and fluid—no more lost sticky notes or forgotten deadlines! 🚀📋🎨

---
### Live Demo

🔗🌐 **Website link:** [https://kanvelope.web.app](https://kanvelope.web.app)




---

## ✨ Features

- ➕ **Dynamic Lists & Cards**  
  - Drag-and-drop between columns 📦➡️📋  
  - Inline edit & delete modals with backdrop blur 🌫️🖊️  
  - Custom per-column borders & adjustable widths 🎨  
  - **Assign To**: tag tasks to team members 👥  
  - **Descriptions**: add rich details per card 📝  
  - **Attachments**: upload images, PDFs, documents 📎  
  - **Due Dates**: set deadlines and reminders 📅
    
- 🔐 **User Authentication**  
  - Email/password sign up & login via Firebase Auth 🔑  

- 💎 **Premium Upgrade**  
  - “Unlock Premium” button in header 💳✨  
  - Easily extendable to Razorpay 💰  

- 📱 **Responsive Design**  
  - Hamburger menu on small screens 🍔  
  - Fluid board layout with centered columns 🔄  

- ☁️ **Cloud-Powered**  
  - Firestore for real-time boards, lists, cards ⚡  
  - Optional Firebase Functions for server-side logic 🚀  

---

## 🛠 Tech Stack

- **Framework**: React (Vite) ⚛️  
- **Styling**: Tailwind CSS 🎨  
- **Drag & Drop**: @hello-pangea/dnd 👐  
- **UI Toolkit**: Headless UI, Lucide Icons 💎  
- **Backend**: Firebase Firestore & Firebase Auth 🔥  

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js ≥ 16 🟢  
- npm or yarn 📦  
- A Firebase project with Firestore & Auth enabled ☁️
---

## 📁 Project Structure

```text
├── public/                 
├── src/
│   ├── assets/             
│   ├── components/         
│   ├── config/             
│   │   └── firebase.js     
│   ├── context/            
│   ├── pages/              
│   ├── App.jsx             
│   └── main.jsx            
├── .env.local                   
├── vite.config.js          
└── README.md               
```          
---

### 🎮 Usage

- Sign up or Login 🔐
- Click “Get Started” to create your first board ➕
- Use the + in the board header to add lists ➗
- Click the ✏️ on a list or card to edit/delete ✂️
- Assign cards to users, add descriptions, upload attachments, and set due dates 📋📎📅
- Drag cards across lists to update their status 🖱️
- Click “Unlock Premium” in the header to integrate payments 💳



### 📥 Installation

1. Clone this repo:  
   ```bash
   git clone https://github.com/geetatgit/kanvelope.git
   cd kanvelope
