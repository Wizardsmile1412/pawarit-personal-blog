# ☕ Pawarit Personal Blog

A **full-stack personal blog** web application built with **React**, **Vite**, **Supabase**, and **Express.js**. Users can read articles, comment, like, and share posts. Admins can manage articles, categories, and notifications.

---

## 📚 Table of Contents

- [Demo](#demo)  
- [Features](#features)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Project Structure](#project-structure)  
- [Technologies Used](#technologies-used)  
- [Contact](#contact)

---

## Demo

🌐 Live site: [https://pawarit-coffee-blog.vercel.app](https://pawarit-coffee-blog.vercel.app)

---

## Features

- 🔐 User authentication (register, login, logout)  
- 🔍 Browse, search, and filter blog articles  
- ❤️ Like and 💬 comment on posts  
- 📤 Share articles to social media  
- 📱 Responsive design for mobile and desktop  
- 🛠️ Admin dashboard for managing articles, categories, and notifications  
- 🔔 Real-time notifications for users  

---

## Installation

### ⚙️Prerequisites

- 🟢 Node.js (v18+ recommended)  
- 📦 npm

### 📥 Clone the repository

```sh
git clone https://github.com/yourusername/pawarit-personal-blog.git
cd pawarit-personal-blog
```

### 🧑‍💻 Client Setup

```sh
cd client
npm install
```

### 🖥️ Server Setup

```sh
cd ../server
npm install
```

---

## Usage

### 🧪 Running the Client

```sh
cd client
npm run dev
```

The client will be available at `http://localhost:5173`.

### 🔧 Running the Server

```sh
cd server
npm start
```

The server will run at `http://localhost:4000`.

> **Note:** Configure your `.env` files in both `client` and `server` directories as needed for Supabase and other environment variables.

---

## Project Structure

```
client/
  src/
    components/
    contexts/
    pages/
    styles/
    ...
  package.json
  ...
server/
  routes/
  middlewares/
  app.mjs
  package.json
  ...
```

- **🖼️ client/**: React frontend (Vite)
- **🔌 server/**: Express.js backend API

---

## Technologies Used

- ⚛️ **[React](https://react.dev/)** – JavaScript library for building user interfaces  
- ⚡ **[Vite](https://vitejs.dev/)** – Fast frontend build tool  
- 🧱 **[Express.js](https://expressjs.com/)** – Web framework for Node.js  
- 🐘 **[Supabase](https://supabase.com/)** – Backend-as-a-service (BaaS) for authentication and database  
- 🎨 **[Tailwind CSS](https://tailwindcss.com/)** – Utility-first CSS framework  
- 🧭 **[React Router](https://reactrouter.com/)** – Declarative routing for React apps  
- 🔗 **[Axios](https://axios-http.com/)** – HTTP client for making API requests  
- ✨ **[Lucide React Icons](https://lucide.dev/)** – Beautiful & consistent icons for React

---

## Contact

Created by [Pawarit S.](p.sripayom@gmail.com)

---
