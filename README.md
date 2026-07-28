# 🎓 EduConnect — Academic Social Network

**EduConnect** is a full-stack MERN application that connects students, teachers, and institutions. It features an Instagram-style feed, real-time chat, job board with applications, nested comments, notifications, and more.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Vite + Tailwind CSS + DaisyUI 5 |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Real-time** | Socket.io (chat + notifications) |
| **Auth** | JWT (access + refresh tokens) + httpOnly cookies |
| **File Storage** | Cloudinary (images, PDFs) |
| **Email** | Nodemailer (verification, password reset) |
| **PWA** | vite-plugin-pwa (service worker, manifest) |

---

## ✨ Features

### 🏠 Feed (Instagram-style)
- Infinite scroll post feed
- Like/unlike, save/unsave, share (copy link)
- Nested comments with replies (Instagram-style threading)
- Like/unlike comments
- Post types: General, Job Post, Announcement, Achievement
- Image upload (multi-image) with Cloudinary
- Tags support
- Delete own posts

### 💼 Job Board
- Post jobs (teachers/institution members only)
- Apply to jobs (students only)
- Application status pipeline: Applied → Reviewed → Shortlisted → Rejected/Selected
- Applicants dashboard for job posters
- My Applications dashboard for students
- Filters: Paid/Unpaid, Location, Role Type
- Duplicate application prevention

### 💬 Real-Time Chat
- 1:1 direct messaging via Socket.io
- Online/offline status indicators (green dot)
- Typing indicators (animated dots)
- Read receipts (✓ Sent / ✓✓ Read)
- Message types: Text, Image, File
- Conversation list with last message preview
- Unread message badges

### 🔔 Notifications
- Real-time push via Socket.io
- Types: Post like, Comment, Reply, New follower, Job applied, Application status, New message
- Mark all as read
- Delete individual notifications
- Unread indicator with animated pulse dot
- Type-specific colored icons

### 👤 User Profiles
- Public profile view with cover gradient
- Profile picture upload (Cloudinary)
- Institution logo upload (for teachers)
- Resume PDF upload
- Follow/unfollow system
- Followers/Following counts
- Edit profile with all fields:
  - Name, Bio, Age, DOB, Profession
  - Institution, Education Level, Subject, Experience
  - Skills, Qualifications, Interests (comma-separated)
  - City, State, Address
  - LinkedIn URL

### 🔍 Explore / Search
- Search users by name, role, skill, institution
- Search results with skills badges
- Click to view profile

### 📱 PWA Support
- Installable on mobile/desktop
- Service worker with Workbox
- Offline fallback
- manifest.json with icons

### 🌐 Landing Page
- Hero section with gradient text
- How it Works (3 steps)
- Features cards
- Stats bar
- CTA section
- Footer

---

## 📁 Project Structure

```
educonnect/
├── client/                     # React + Vite frontend
│   ├── public/
│   │   ├── manifest.json
│   │   └── icons/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Sidebar, BottomNav, RightSidebar
│   │   │   └── post/           # CreatePostModal
│   │   ├── pages/              # 15 pages (Landing, Login, Feed, Chat, etc.)
│   │   ├── store/              # Zustand auth store
│   │   ├── context/            # Socket.io context
│   │   ├── utils/              # Axios instance with interceptors
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # DaisyUI custom theme
│   ├── index.html
│   └── vite.config.js
├── server/                     # Node.js + Express backend
│   ├── config/                 # db.js, cloudinary.js, socket.js
│   ├── models/                 # 8 Mongoose models
│   ├── controllers/            # 7 controllers
│   ├── routes/                 # 7 route files
│   ├── middlewares/            # auth, role, upload
│   ├── utils/                  # email (Nodemailer)
│   └── server.js
├── start.sh                    # One-command startup script
├── .gitignore
└── README.md
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- Gmail account (for Nodemailer)

### 1. Clone & Install
```bash
git clone https://github.com/Ajay120503/EduConnect.git
cd EduConnect
cd client && npm install
cd ../server && npm install
cd ..
```

### 2. Configure Environment
```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your credentials:
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/EduConnect
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Start
```bash
./start.sh
```

Or manually:
```bash
# Terminal 1 - Backend
cd server && node server.js

# Terminal 2 - Frontend
cd client && npm run dev
```

### 4. Open
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/verify-email/:token` | Verify email |
| POST | `/api/auth/forgot-password` | Send OTP |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/refresh-token` | Refresh JWT |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id` | Get profile |
| PUT | `/api/users/:id` | Update profile (multipart) |
| POST | `/api/users/:id/follow` | Follow/unfollow |
| GET | `/api/users/search?q=` | Search users |
| GET | `/api/users/:id/posts` | User's posts |
| GET | `/api/users/:id/jobs` | User's jobs |
| GET | `/api/users/:id/followers` | Get followers |
| GET | `/api/users/:id/following` | Get following |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Feed (paginated) |
| POST | `/api/posts` | Create post |
| GET | `/api/posts/:id` | Get single post |
| DELETE | `/api/posts/:id` | Delete post |
| POST | `/api/posts/:id/like` | Toggle like |
| POST | `/api/posts/:id/save` | Toggle save |
| GET | `/api/posts/saved` | Saved posts |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts/:postId/comments` | Get comments |
| POST | `/api/posts/:postId/comments` | Add comment |
| POST | `/api/comments/:id/reply` | Reply to comment |
| POST | `/api/comments/:id/like` | Like comment |
| DELETE | `/api/comments/:id` | Delete comment |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List jobs (filters) |
| POST | `/api/jobs` | Create job |
| GET | `/api/jobs/:id` | Get job |
| PUT | `/api/jobs/:id` | Update job |
| DELETE | `/api/jobs/:id` | Delete job |
| POST | `/api/jobs/:id/apply` | Apply to job |
| GET | `/api/jobs/:id/applicants` | View applicants |
| PUT | `/api/applications/:id/status` | Update status |
| GET | `/api/jobs/applications/my` | My applications |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chat/conversations` | Get conversations |
| POST | `/api/chat/conversations` | Create conversation |
| GET | `/api/chat/conversations/:id/messages` | Get messages |
| POST | `/api/chat/messages` | Send message |
| PUT | `/api/chat/messages/:id/read` | Mark as read |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get notifications |
| PUT | `/api/notifications/read-all` | Mark all read |
| DELETE | `/api/notifications/:id` | Delete notification |

---

## 🧪 Testing

Run the full test suite (70 API tests):
```bash
./test_all_features.sh
```

---

## 📊 Test Results

| Category | Tests | Passed |
|----------|-------|--------|
| Auth (register, login, validation) | 12 | 12 |
| User (profile, follow, search) | 10 | 10 |
| Posts (CRUD, like, save, feed) | 9 | 9 |
| Comments (add, reply, like) | 6 | 6 |
| Jobs (CRUD, apply, applicants, filters) | 13 | 13 |
| Chat (conversations, messages, read) | 8 | 8 |
| Notifications (get, mark read) | 3 | 3 |
| Edge Cases (validation, auth guards) | 6 | 6 |
| Cleanup (delete post, comment) | 3 | 3 |
| **Total** | **70** | **70** |

---

## 📄 License

MIT © 2026 EduConnect