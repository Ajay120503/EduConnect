# 🎓 EduConnect — Master Plan
### *The Academic Social Network for Students, Teachers & Institutions*
**Stack:** MERN · Cloudinary · Socket.io · DaisyUI · Tailwind CSS · Email Auth (Nodemailer + JWT)

---

## 1. App Identity

| Field | Value |
|---|---|
| **App Name** | **EduConnect** |
| **Tagline** | *Where Academic Careers Begin* |
| **Primary Colors** | `#4F46E5` Indigo (primary) · `#06B6D4` Cyan (accent) · `#F59E0B` Amber (job/posts) |
| **Background** | `#F0F4FF` light · `#0F172A` dark |
| **Font** | Inter (UI) · Poppins (headings) |
| **Icon Set** | Lucide React |
| **UI Library** | DaisyUI + Tailwind CSS |
| **Mobile Feel** | Instagram-style bottom nav on mobile, sidebar nav on desktop |

---

## 2. Color Palette (DaisyUI Custom Theme)

```js
// tailwind.config.js
daisyui: {
  themes: [{
    educonnect: {
      "primary": "#4F46E5",      // Indigo — brand, buttons, active states
      "secondary": "#06B6D4",    // Cyan — accent, badges, highlights
      "accent": "#F59E0B",       // Amber — job posts, alerts, premium
      "neutral": "#1E293B",      // Slate dark — cards, sidebars
      "base-100": "#F0F4FF",     // Light background
      "base-200": "#E2E8F0",     // Card backgrounds
      "base-300": "#CBD5E1",     // Borders
      "info": "#3B82F6",
      "success": "#10B981",
      "warning": "#F59E0B",
      "error": "#EF4444",
    }
  }]
}
```

---

## 3. User Roles & Registration

### 3.1 Role Types

| Role | Category | Register As |
|---|---|---|
| Student | Student | Student |
| School Teacher | School | Teacher |
| School Principal | School | Principal |
| College Professor | College | Professor |
| College HOD | College | Head of Department |
| College Principal | College | Principal |

### 3.2 Student Profile Fields

```
- Full Name (required)
- Profile Picture (Cloudinary upload)
- Age / Date of Birth
- Email (auth field)
- Current Education Level (10th / 12th / Undergraduate / Postgraduate / PhD)
- Institution Name
- Skills (tags: e.g., Python, Public Speaking, Research)
- Qualifications / Certifications
- Address / City / State
- LinkedIn URL (optional)
- Resume PDF (Cloudinary upload)
- Profession / Part-time Work (optional)
- Bio (200 chars)
- Interests
```

### 3.3 Teacher / Institution Member Profile Fields

```
- Full Name (required)
- Profile Picture (Cloudinary upload)
- Role (Teacher / HOD / Principal / Professor)
- Institution Name (School or College)
- Institution Logo / Photo (Cloudinary upload)
- Subject / Department
- Experience (years)
- Qualifications
- Address / City / State
- Email (auth field)
- Bio (200 chars)
- Verification Status (pending / verified) — admin verified
```

---

## 4. Feature Set

### 4.1 🏠 Feed (Instagram-style)
- Infinite scroll post feed
- Like, Share, Save posts
- Nested Comments (comment → reply → reply to reply — Instagram style)
- Like comments
- Each post shows: author avatar, name, role badge, image (optional), text, tags, timestamp
- Post types: General · Job Post · Announcement · Achievement

### 4.2 💼 Job Posting (by Teachers/Principals/HODs)
Post a job/role with:
```
- Title
- Description
- Institution Name + Logo
- Role Type (Teacher / Intern / Volunteer / Assistant / Research)
- Paid / Unpaid toggle
- Stipend / Salary (if paid)
- Location (On-site / Remote / Hybrid)
- Required Qualifications
- Skills Required (tags)
- Application Deadline
- Contact Email
- Post Image (Cloudinary)
- Max Applicants
```

### 4.3 📋 Job Application (by Students)
- One-click Apply with profile auto-fill
- Upload Cover Letter (PDF, Cloudinary)
- Application Status: Applied → Reviewed → Shortlisted → Rejected / Selected
- Applications dashboard for students
- Applicants dashboard for institution members (with filters)

### 4.4 💬 Real-Time Chat (Socket.io)
- 1:1 Direct Messages
- Online/offline status indicator
- Read receipts (double-tick like WhatsApp)
- Message types: Text · Image · File
- Chat search
- Notification badge on unread messages

### 4.5 🔔 Notifications
- In-app notification bell
- Types: New job posted · Application status change · Post like · Comment · New follower · New message
- Mark all as read

### 4.6 🔍 Explore / Search
- Search users by name, role, institution, skill
- Search job posts by role, location, paid/unpaid
- Filter jobs by: Category · Location · Paid/Unpaid · Date Posted

### 4.7 👤 Profile Page
- Public profile view
- Followers / Following count
- All posts by user
- For institution members: all job posts listed
- Edit profile
- Share profile (link copy)

### 4.8 📱 PWA / Android Starter App
- Manifest + service worker → installable on Android as TWA or PWA
- "Add to Home Screen" banner prompt
- App icon set (all sizes: 192x192, 512x512)
- Offline fallback page

### 4.9 🌐 Landing Page
- Hero: animated text + CTA buttons (Sign up as Student / Sign up as Teacher)
- Features section (3-column cards)
- How it Works (3 steps)
- Testimonials (dummy)
- Footer with links

---

## 5. Tech Architecture

### 5.1 Frontend (React + Vite)

```
src/
├── assets/             # Icons, images, logo
├── components/
│   ├── common/         # Navbar, Sidebar, BottomNav, Avatar, Badge
│   ├── post/           # PostCard, CommentBox, CommentThread, LikeButton
│   ├── job/            # JobCard, JobForm, ApplyModal, ApplicantCard
│   ├── chat/           # ChatList, ChatWindow, MessageBubble
│   ├── profile/        # ProfileHeader, ProfilePosts, EditProfileModal
│   └── notifications/  # NotifBell, NotifDropdown
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Register.jsx    # Branched by role
│   ├── Feed.jsx
│   ├── Explore.jsx
│   ├── Jobs.jsx
│   ├── Profile.jsx
│   ├── Chat.jsx
│   ├── Notifications.jsx
│   └── Settings.jsx
├── store/              # Zustand or Redux Toolkit slices
├── hooks/              # useSocket, useAuth, useInfiniteScroll
├── utils/              # axios instance, cloudinary upload helper
├── context/            # AuthContext, SocketContext
└── App.jsx
```

### 5.2 Backend (Node.js + Express)

```
server/
├── config/
│   ├── db.js           # MongoDB connection (Mongoose)
│   ├── cloudinary.js   # Cloudinary SDK config
│   └── socket.js       # Socket.io init
├── models/
│   ├── User.js         # Polymorphic (student / institution member)
│   ├── Post.js
│   ├── Comment.js      # Supports parentComment (nested)
│   ├── JobPost.js
│   ├── Application.js
│   ├── Message.js
│   ├── Conversation.js
│   └── Notification.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── post.routes.js
│   ├── comment.routes.js
│   ├── job.routes.js
│   ├── application.routes.js
│   ├── chat.routes.js
│   └── notification.routes.js
├── controllers/        # Business logic per route
├── middlewares/
│   ├── auth.middleware.js   # JWT verify
│   ├── role.middleware.js   # Role guard
│   └── upload.middleware.js # Multer + Cloudinary
├── utils/
│   ├── email.js        # Nodemailer templates
│   └── helpers.js
└── server.js
```

### 5.3 Database Schema (Key Models)

```js
// User.js
{
  name, email, password (hashed),
  role: enum['student','teacher','professor','hod','principal'],
  category: enum['student','school','college'],
  profilePic: { url, publicId },
  institutionName, institutionPic: { url, publicId },
  bio, age, skills: [String], qualifications: [String],
  address, resumeUrl,
  followers: [userId], following: [userId],
  isVerified: Boolean,
  createdAt
}

// Post.js
{
  author: userId, type: enum['general','job','announcement','achievement'],
  text, images: [{ url, publicId }],
  tags: [String],
  likes: [userId], saves: [userId],
  comments: [commentId],
  createdAt
}

// Comment.js (nested)
{
  post: postId, author: userId,
  text, likes: [userId],
  parentComment: commentId | null,  // null = top-level
  replies: [commentId],
  createdAt
}

// JobPost.js
{
  postedBy: userId, institutionName, institutionLogo,
  title, description, roleType, isPaid, stipend,
  location, requiredQualifications, skillsRequired: [String],
  deadline, contactEmail, image: { url, publicId },
  maxApplicants, applicants: [userId],
  isActive: Boolean, createdAt
}

// Message.js
{
  conversation: conversationId,
  sender: userId, content, type: enum['text','image','file'],
  fileUrl, read: Boolean, createdAt
}
```

---

## 6. API Routes Summary

### Auth
```
POST /api/auth/register        → Register (email + role)
POST /api/auth/login           → Login → JWT token
POST /api/auth/logout
POST /api/auth/forgot-password → Email OTP
POST /api/auth/reset-password
GET  /api/auth/verify-email/:token
```

### Users
```
GET    /api/users/:id           → Public profile
PUT    /api/users/:id           → Update profile (auth)
POST   /api/users/:id/follow    → Follow/unfollow toggle
GET    /api/users/search?q=     → Search users
GET    /api/users/:id/posts     → User's posts
GET    /api/users/:id/jobs      → User's job posts
```

### Posts
```
GET    /api/posts               → Feed (paginated)
POST   /api/posts               → Create post
DELETE /api/posts/:id
POST   /api/posts/:id/like      → Toggle like
POST   /api/posts/:id/save      → Toggle save
GET    /api/posts/saved         → Saved posts
```

### Comments
```
GET    /api/posts/:postId/comments        → Get top-level comments
POST   /api/posts/:postId/comments        → Add comment
POST   /api/comments/:commentId/reply     → Reply to comment
POST   /api/comments/:commentId/like      → Like comment
DELETE /api/comments/:commentId
```

### Jobs
```
GET    /api/jobs                → All active jobs (filters: paid, location, role)
POST   /api/jobs                → Create job post (institution members only)
GET    /api/jobs/:id
PUT    /api/jobs/:id
DELETE /api/jobs/:id
POST   /api/jobs/:id/apply      → Apply (students only)
GET    /api/jobs/:id/applicants → View applicants (poster only)
PUT    /api/applications/:id/status → Update application status
```

### Chat
```
GET    /api/conversations                 → All conversations for user
GET    /api/conversations/:id/messages    → Messages (paginated)
POST   /api/conversations                 → Start new conversation
POST   /api/messages                      → Send message
```

### Notifications
```
GET    /api/notifications        → User notifications
PUT    /api/notifications/read-all
DELETE /api/notifications/:id
```

---

## 7. Socket.io Events

```js
// Client emits
"join_room"         → join personal room (userId)
"send_message"      → { conversationId, content, type }
"typing"            → { conversationId, userId }
"stop_typing"
"mark_read"         → { messageId }

// Server emits
"receive_message"   → new message to recipient
"is_typing"         → typing indicator
"notification"      → real-time notification push
"online_status"     → { userId, isOnline }
"message_read"      → read receipt update
```

---

## 8. Cloudinary Upload Strategy

```js
// Middleware: multer (memory storage) → cloudinary upload stream
const uploadToCloudinary = async (file, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto', quality: 'auto', fetch_format: 'auto' },
      (err, result) => err ? reject(err) : resolve(result)
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

// Folders used:
// educonnect/profile-pics
// educonnect/institution-pics
// educonnect/post-images
// educonnect/job-images
// educonnect/resumes
// educonnect/chat-files
```

---

## 9. Email Auth Flow (Nodemailer)

```
1. User registers with email + password
2. Server sends verification email with JWT token link
3. User clicks link → email verified → can log in
4. Login → JWT access token (7d) + refresh token (30d) in httpOnly cookie
5. Forgot password → OTP or reset link via email (expires 15min)
```

---

## 10. Responsive Layout Strategy

### Desktop (≥768px)
```
┌─────────────────────────────────────────────────┐
│  [Logo]  [Search bar]           [Notif] [Avatar] │  ← Top Navbar
├──────────┬──────────────────────┬────────────────┤
│          │                      │                │
│ LEFT     │   FEED / MAIN        │  RIGHT         │
│ SIDEBAR  │   CONTENT            │  SIDEBAR       │
│          │                      │  (Suggested    │
│ Nav      │   (Posts, Jobs etc.) │   Users, Jobs) │
│ Links    │                      │                │
│          │                      │                │
└──────────┴──────────────────────┴────────────────┘
```

### Mobile (< 768px) — Android App Feel
```
┌──────────────────────┐
│  EduConnect    🔔 📩  │  ← Minimal top bar
├──────────────────────┤
│                      │
│   FEED / PAGE        │
│   CONTENT            │
│   (Full width)       │
│                      │
│                      │
│                      │
├──────────────────────┤
│  🏠  🔍  ➕  👔  👤  │  ← Bottom Tab Bar (Instagram style)
└──────────────────────┘
```

Bottom nav tabs:
- 🏠 Home (Feed)
- 🔍 Explore
- ➕ Create Post
- 👔 Jobs
- 👤 Profile

---

## 11. PWA / Android Starter App

### manifest.json
```json
{
  "name": "EduConnect",
  "short_name": "EduConnect",
  "description": "Academic Social Network",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0F172A",
  "theme_color": "#4F46E5",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Service Worker (Workbox)
- Cache static assets (shell, fonts, icons)
- Network-first for API calls
- Offline fallback page

### Android (TWA — Trusted Web Activity)
- After PWA is live, use Bubblewrap CLI to generate APK
- App passes Lighthouse PWA criteria (installable, offline, fast)
- Users get "Add to Home Screen" prompt on Android Chrome

---

## 12. Landing Page Sections

```
1. HERO
   - Headline: "Where Academic Careers Begin"
   - Subtitle: "Connect students with teachers, find teaching roles, and build your academic network."
   - CTA: [Join as Student] [Join as Teacher/Institution]
   - Hero visual: animated mockup of the app feed

2. HOW IT WORKS (3 steps)
   - Create your profile → Browse & Connect → Apply or Post Jobs

3. FEATURES (6 cards)
   - Instagram-style Feed
   - Job Board for Academic Roles
   - Direct Messaging
   - Smart Notifications
   - Multi-Role Support
   - Mobile-First PWA

4. STATS BAR
   - 10,000+ Students | 5,000+ Teachers | 2,000+ Job Posts

5. TESTIMONIALS
   - 3 dummy cards with avatars

6. CTA BANNER
   - "Ready to connect with your academic world?"
   - [Get Started Free]

7. FOOTER
   - Logo, links, socials, © 2025 EduConnect
```

---

## 13. Phase-wise Build Plan for AI Agent (Cline/DeepSeek)

### ✅ PHASE 0 — Project Setup (Gate: Repo running locally)
```
- Initialize Vite React app + Node/Express server (monorepo)
- Install: tailwindcss, daisyui, lucide-react, axios, socket.io-client, zustand, react-router-dom
- Backend: mongoose, jsonwebtoken, bcryptjs, nodemailer, multer, cloudinary, socket.io, cors, dotenv
- Configure MongoDB Atlas connection
- Configure Cloudinary credentials
- Set up DaisyUI custom theme (educonnect palette)
- Create base file structure (frontend + backend folders as per Section 5)
- Create .env files (template)
- GATE CHECK: npm run dev — both frontend and backend start without errors
```

### ✅ PHASE 1 — Auth System (Gate: Login/Register working)
```
- User model (Mongoose) with role enum
- Register API: hash password, create user, send verification email
- Email verification with JWT link (Nodemailer)
- Login API: verify email, compare password, return JWT + httpOnly cookie
- Forgot password: OTP email flow
- Reset password API
- Auth middleware (JWT verify)
- Frontend: Register page (role selection → student form OR institution form)
- Frontend: Login page
- Frontend: Email verification page
- Frontend: Forgot/Reset password pages
- AuthContext + Zustand auth store
- Protected routes setup
- GATE CHECK: Full register → verify email → login → redirect to feed flow works
```

### ✅ PHASE 2 — User Profiles (Gate: Profile page renders with edit)
```
- User profile GET/PUT APIs
- Profile image upload (Cloudinary)
- Resume upload (Cloudinary, PDF only)
- Institution pic upload (Cloudinary)
- Frontend: Profile page (header, bio, posts tab, jobs tab)
- Frontend: Edit Profile modal (all fields, image upload preview)
- Follow / Unfollow API + button
- Followers/Following list modal
- GATE CHECK: Create profile, upload pic, edit and save → view own and other profiles
```

### ✅ PHASE 3 — Posts & Feed (Gate: Create post, see feed, like/comment)
```
- Post model + CRUD APIs
- Image upload for posts (multi-image, Cloudinary)
- Feed API (paginated, follows-based + explore)
- Like/unlike post API
- Save/unsave post API
- Comment model (with parentComment for nesting)
- Add comment API, reply to comment API
- Like comment API
- Delete comment API
- Frontend: PostCard component (image, text, like/comment/share buttons)
- Frontend: CommentThread component (nested, Instagram style)
- Frontend: Create Post modal (image upload, text, tags)
- Frontend: Feed page (infinite scroll)
- Frontend: Saved posts page
- GATE CHECK: Create post with image → see in feed → like → comment → reply to comment → like reply
```

### ✅ PHASE 4 — Job Board (Gate: Post job, apply, view applicants)
```
- JobPost model + CRUD APIs
- Job listing page (filters: paid/unpaid, location, role type)
- Create job post API (institution members only — role middleware)
- Apply to job API (students only)
- Application model + status update API
- Applicants dashboard (for job poster)
- Student applications dashboard
- Frontend: JobCard component
- Frontend: JobForm (all fields, image upload, paid toggle)
- Frontend: ApplyModal (auto-fill from profile, cover letter upload)
- Frontend: Jobs page with filters
- Frontend: My Applications page (student)
- Frontend: Applicants page (institution member)
- GATE CHECK: Institution member posts job → student applies → poster views applicants → updates status → student sees status change
```

### ✅ PHASE 5 — Real-Time Chat (Gate: Send and receive messages in real-time)
```
- Conversation model + Message model
- Socket.io server setup (join rooms, send message, typing)
- Chat APIs (get conversations, get messages paginated, send message)
- Image/file upload in chat (Cloudinary)
- Online status tracking (socket map)
- Read receipts (mark as read)
- Frontend: ChatList sidebar component
- Frontend: ChatWindow component (message bubbles, input, emoji)
- Frontend: MessageBubble (text / image / file)
- Frontend: Typing indicator animation
- Frontend: Online status dot
- Frontend: Unread badge on chat icon
- SocketContext (manage socket instance globally)
- GATE CHECK: Two users can chat in real time, typing indicator shows, read receipt updates
```

### ✅ PHASE 6 — Notifications (Gate: Bell shows real-time notifications)
```
- Notification model
- Notification creation triggers (on like, comment, follow, job apply, status change)
- Notification API (get, read-all, delete)
- Socket.io notification push
- Frontend: NotifBell with badge count
- Frontend: Notification dropdown list
- Frontend: Mark all read button
- GATE CHECK: User A likes post of User B → User B's bell updates in real time with notification
```

### ✅ PHASE 7 — Explore & Search (Gate: Search returns correct results)
```
- User search API (by name, role, institution, skill — MongoDB text index)
- Job search API (filters, text search)
- Post explore (trending/recent, non-followed)
- Frontend: Search bar with debounce (300ms)
- Frontend: Explore page (users tab + jobs tab + posts tab)
- Frontend: Search results rendering
- GATE CHECK: Search "Mathematics teacher Mumbai" returns correct users and jobs
```

### ✅ PHASE 8 — Responsive UI Polish + PWA (Gate: Passes Lighthouse PWA audit)
```
- Bottom tab bar (mobile only, CSS media query)
- Desktop sidebar (left nav + right suggestions)
- Responsive PostCard, JobCard, ProfileHeader
- DaisyUI dark mode toggle
- Loading skeletons for feed, profile, chat
- Empty state illustrations (SVG)
- Toast notifications (react-hot-toast)
- manifest.json + service worker (Workbox via vite-plugin-pwa)
- Icons all sizes (192, 512 PNG)
- "Add to Home Screen" prompt
- GATE CHECK: Mobile Chrome → "Add to Home Screen" → opens as standalone app
```

### ✅ PHASE 9 — Landing Page (Gate: Landing page live and responsive)
```
- Landing.jsx page (all 7 sections per Section 12)
- Smooth scroll navigation
- Hero animation (CSS or framer-motion)
- Responsive: full hero on desktop, stacked on mobile
- CTA buttons link to /register
- SEO meta tags (title, description, og:image)
- GATE CHECK: Landing page renders fully on mobile and desktop, CTAs work
```

### ✅ PHASE 10 — Security, Cleanup & Deployment (Gate: Live production URL)
```
- Input validation (express-validator on all routes)
- Rate limiting (express-rate-limit on auth routes)
- Helmet.js headers
- CORS lockdown to frontend domain
- Environment variable audit
- Error boundary (React)
- 404 page
- Console.log cleanup
- MongoDB indexes (email unique, text search indexes)
- Deploy backend to Render / Railway
- Deploy frontend to Vercel
- Connect custom domain (optional)
- GATE CHECK: Production URL works end-to-end, no console errors, Lighthouse score > 85
```

---

## 14. Key npm Packages

### Frontend
```
react-router-dom     → routing
axios                → HTTP client
zustand              → state management
socket.io-client     → real-time
react-hot-toast      → toasts
lucide-react         → icons
react-infinite-scroll-component → infinite feed
react-dropzone       → image upload UI
framer-motion        → landing page animations
vite-plugin-pwa      → PWA / service worker
```

### Backend
```
express              → server
mongoose             → MongoDB ORM
bcryptjs             → password hashing
jsonwebtoken         → JWT auth
nodemailer           → email
multer               → file uploads
cloudinary           → image/file CDN
streamifier          → buffer to stream for cloudinary
socket.io            → WebSockets
express-rate-limit   → rate limiting
helmet               → security headers
express-validator    → input validation
cors                 → CORS
dotenv               → env vars
```

---

## 15. Folder Structure (Full Monorepo)

```
educonnect/
├── client/                    ← React (Vite)
│   ├── public/
│   │   ├── manifest.json
│   │   └── icons/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                    ← Node + Express
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middlewares/
│   ├── utils/
│   └── server.js
├── .env.example
├── .gitignore
└── README.md
```

---

## 16. DeepSeek / Cline Agent Prompt

> Copy this prompt into DeepSeek or Cline to start the build. Feed each PHASE prompt one at a time after the GATE CHECK passes.

---

### 🤖 MASTER AGENT PROMPT

```
You are a senior full-stack developer. Build the EduConnect app — an academic social network.

TECH STACK:
- Frontend: React 18 (Vite), Tailwind CSS, DaisyUI (custom theme: educonnect), Lucide React icons, Zustand, React Router DOM, Axios, Socket.io-client
- Backend: Node.js, Express, MongoDB (Mongoose), JWT auth, Nodemailer, Multer + Cloudinary (streamifier), Socket.io
- Image/File storage: Cloudinary
- Auth: Email-based (register → verify email → login → JWT in httpOnly cookie)

DESIGN RULES:
- Colors: primary=#4F46E5 (indigo), secondary=#06B6D4 (cyan), accent=#F59E0B (amber)
- Mobile: Instagram-style bottom tab bar (Home, Explore, Create, Jobs, Profile)
- Desktop: Left sidebar nav + right suggestions sidebar
- Font: Inter (body), Poppins (headings)
- Icons: Lucide React only
- All UI must use DaisyUI components + Tailwind utilities
- Dark mode support via DaisyUI theme toggle

ROLES:
- student: can view feed, apply to jobs, chat, post
- teacher / professor / hod / principal: can post jobs, view applicants, post, chat

Follow the phased plan below. Do not proceed to the next phase until explicitly told.

START WITH PHASE 0: Project Setup.
Create the monorepo folder structure, install all dependencies, configure Tailwind + DaisyUI custom theme, connect MongoDB, connect Cloudinary, set up .env, and verify both frontend and backend start without errors.

After completing each phase, output:
✅ PHASE [N] COMPLETE
List of files created/modified
GATE CHECK: [describe what to test manually]
```

---

*Document generated for EduConnect — v1.0 Plan*
*MERN · Cloudinary · Socket.io · DaisyUI · Tailwind · Email Auth · PWA*


# 🎓 EduConnect — Master Plan
### *The Academic Social Network for Students, Teachers & Institutions*
**Stack:** MERN · Cloudinary · Socket.io · DaisyUI · Tailwind CSS · Email Auth (Nodemailer + JWT)

---

## 1. App Identity

| Field | Value |
|---|---|
| **App Name** | **EduConnect** |
| **Tagline** | *Where Academic Careers Begin* |
| **Primary Colors** | `#4F46E5` Indigo (primary) · `#06B6D4` Cyan (accent) · `#F59E0B` Amber (job/posts) |
| **Background** | `#F0F4FF` light · `#0F172A` dark |
| **Font** | Inter (UI) · Poppins (headings) |
| **Icon Set** | Lucide React |
| **UI Library** | DaisyUI + Tailwind CSS |
| **Mobile Feel** | Instagram-style bottom nav on mobile, sidebar nav on desktop |

---

## 2. Color Palette (DaisyUI Custom Theme)

```js
// tailwind.config.js
daisyui: {
  themes: [{
    educonnect: {
      "primary": "#4F46E5",      // Indigo — brand, buttons, active states
      "secondary": "#06B6D4",    // Cyan — accent, badges, highlights
      "accent": "#F59E0B",       // Amber — job posts, alerts, premium
      "neutral": "#1E293B",      // Slate dark — cards, sidebars
      "base-100": "#F0F4FF",     // Light background
      "base-200": "#E2E8F0",     // Card backgrounds
      "base-300": "#CBD5E1",     // Borders
      "info": "#3B82F6",
      "success": "#10B981",
      "warning": "#F59E0B",
      "error": "#EF4444",
    }
  }]
}
```

---

## 3. User Roles & Registration

### 3.1 Role Types

| Role | Category | Register As |
|---|---|---|
| Student | Student | Student |
| School Teacher | School | Teacher |
| School Principal | School | Principal |
| College Professor | College | Professor |
| College HOD | College | Head of Department |
| College Principal | College | Principal |

### 3.2 Student Profile Fields

```
- Full Name (required)
- Profile Picture (Cloudinary upload)
- Age / Date of Birth
- Email (auth field)
- Current Education Level (10th / 12th / Undergraduate / Postgraduate / PhD)
- Institution Name
- Skills (tags: e.g., Python, Public Speaking, Research)
- Qualifications / Certifications
- Address / City / State
- LinkedIn URL (optional)
- Resume PDF (Cloudinary upload)
- Profession / Part-time Work (optional)
- Bio (200 chars)
- Interests
```

### 3.3 Teacher / Institution Member Profile Fields

```
- Full Name (required)
- Profile Picture (Cloudinary upload)
- Role (Teacher / HOD / Principal / Professor)
- Institution Name (School or College)
- Institution Logo / Photo (Cloudinary upload)
- Subject / Department
- Experience (years)
- Qualifications
- Address / City / State
- Email (auth field)
- Bio (200 chars)
- Verification Status (pending / verified) — admin verified
```

---

## 4. Feature Set

### 4.1 🏠 Feed (Instagram-style)
- Infinite scroll post feed
- Like, Share, Save posts
- Nested Comments (comment → reply → reply to reply — Instagram style)
- Like comments
- Each post shows: author avatar, name, role badge, image (optional), text, tags, timestamp
- Post types: General · Job Post · Announcement · Achievement

### 4.2 💼 Job Posting (by Teachers/Principals/HODs)
Post a job/role with:
```
- Title
- Description
- Institution Name + Logo
- Role Type (Teacher / Intern / Volunteer / Assistant / Research)
- Paid / Unpaid toggle
- Stipend / Salary (if paid)
- Location (On-site / Remote / Hybrid)
- Required Qualifications
- Skills Required (tags)
- Application Deadline
- Contact Email
- Post Image (Cloudinary)
- Max Applicants
```

### 4.3 📋 Job Application (by Students)
- One-click Apply with profile auto-fill
- Upload Cover Letter (PDF, Cloudinary)
- Application Status: Applied → Reviewed → Shortlisted → Rejected / Selected
- Applications dashboard for students
- Applicants dashboard for institution members (with filters)

### 4.4 💬 Real-Time Chat (Socket.io)
- 1:1 Direct Messages
- Online/offline status indicator
- Read receipts (double-tick like WhatsApp)
- Message types: Text · Image · File
- Chat search
- Notification badge on unread messages

### 4.5 🔔 Notifications
- In-app notification bell
- Types: New job posted · Application status change · Post like · Comment · New follower · New message
- Mark all as read

### 4.6 🔍 Explore / Search
- Search users by name, role, institution, skill
- Search job posts by role, location, paid/unpaid
- Filter jobs by: Category · Location · Paid/Unpaid · Date Posted

### 4.7 👤 Profile Page
- Public profile view
- Followers / Following count
- All posts by user
- For institution members: all job posts listed
- Edit profile
- Share profile (link copy)

### 4.8 📱 PWA / Android Starter App
- Manifest + service worker → installable on Android as TWA or PWA
- "Add to Home Screen" banner prompt
- App icon set (all sizes: 192x192, 512x512)
- Offline fallback page

### 4.9 🌐 Landing Page
- Hero: animated text + CTA buttons (Sign up as Student / Sign up as Teacher)
- Features section (3-column cards)
- How it Works (3 steps)
- Testimonials (dummy)
- Footer with links

---

## 5. Tech Architecture

### 5.1 Frontend (React + Vite)

```
src/
├── assets/             # Icons, images, logo
├── components/
│   ├── common/         # Navbar, Sidebar, BottomNav, Avatar, Badge
│   ├── post/           # PostCard, CommentBox, CommentThread, LikeButton
│   ├── job/            # JobCard, JobForm, ApplyModal, ApplicantCard
│   ├── chat/           # ChatList, ChatWindow, MessageBubble
│   ├── profile/        # ProfileHeader, ProfilePosts, EditProfileModal
│   └── notifications/  # NotifBell, NotifDropdown
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Register.jsx    # Branched by role
│   ├── Feed.jsx
│   ├── Explore.jsx
│   ├── Jobs.jsx
│   ├── Profile.jsx
│   ├── Chat.jsx
│   ├── Notifications.jsx
│   └── Settings.jsx
├── store/              # Zustand or Redux Toolkit slices
├── hooks/              # useSocket, useAuth, useInfiniteScroll
├── utils/              # axios instance, cloudinary upload helper
├── context/            # AuthContext, SocketContext
└── App.jsx
```

### 5.2 Backend (Node.js + Express)

```
server/
├── config/
│   ├── db.js           # MongoDB connection (Mongoose)
│   ├── cloudinary.js   # Cloudinary SDK config
│   └── socket.js       # Socket.io init
├── models/
│   ├── User.js         # Polymorphic (student / institution member)
│   ├── Post.js
│   ├── Comment.js      # Supports parentComment (nested)
│   ├── JobPost.js
│   ├── Application.js
│   ├── Message.js
│   ├── Conversation.js
│   └── Notification.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── post.routes.js
│   ├── comment.routes.js
│   ├── job.routes.js
│   ├── application.routes.js
│   ├── chat.routes.js
│   └── notification.routes.js
├── controllers/        # Business logic per route
├── middlewares/
│   ├── auth.middleware.js   # JWT verify
│   ├── role.middleware.js   # Role guard
│   └── upload.middleware.js # Multer + Cloudinary
├── utils/
│   ├── email.js        # Nodemailer templates
│   └── helpers.js
└── server.js
```

### 5.3 Database Schema (Key Models)

```js
// User.js
{
  name, email, password (hashed),
  role: enum['student','teacher','professor','hod','principal'],
  category: enum['student','school','college'],
  profilePic: { url, publicId },
  institutionName, institutionPic: { url, publicId },
  bio, age, skills: [String], qualifications: [String],
  address, resumeUrl,
  followers: [userId], following: [userId],
  isVerified: Boolean,
  createdAt
}

// Post.js
{
  author: userId, type: enum['general','job','announcement','achievement'],
  text, images: [{ url, publicId }],
  tags: [String],
  likes: [userId], saves: [userId],
  comments: [commentId],
  createdAt
}

// Comment.js (nested)
{
  post: postId, author: userId,
  text, likes: [userId],
  parentComment: commentId | null,  // null = top-level
  replies: [commentId],
  createdAt
}

// JobPost.js
{
  postedBy: userId, institutionName, institutionLogo,
  title, description, roleType, isPaid, stipend,
  location, requiredQualifications, skillsRequired: [String],
  deadline, contactEmail, image: { url, publicId },
  maxApplicants, applicants: [userId],
  isActive: Boolean, createdAt
}

// Message.js
{
  conversation: conversationId,
  sender: userId, content, type: enum['text','image','file'],
  fileUrl, read: Boolean, createdAt
}
```

---

## 6. API Routes Summary

### Auth
```
POST /api/auth/register        → Register (email + role)
POST /api/auth/login           → Login → JWT token
POST /api/auth/logout
POST /api/auth/forgot-password → Email OTP
POST /api/auth/reset-password
GET  /api/auth/verify-email/:token
```

### Users
```
GET    /api/users/:id           → Public profile
PUT    /api/users/:id           → Update profile (auth)
POST   /api/users/:id/follow    → Follow/unfollow toggle
GET    /api/users/search?q=     → Search users
GET    /api/users/:id/posts     → User's posts
GET    /api/users/:id/jobs      → User's job posts
```

### Posts
```
GET    /api/posts               → Feed (paginated)
POST   /api/posts               → Create post
DELETE /api/posts/:id
POST   /api/posts/:id/like      → Toggle like
POST   /api/posts/:id/save      → Toggle save
GET    /api/posts/saved         → Saved posts
```

### Comments
```
GET    /api/posts/:postId/comments        → Get top-level comments
POST   /api/posts/:postId/comments        → Add comment
POST   /api/comments/:commentId/reply     → Reply to comment
POST   /api/comments/:commentId/like      → Like comment
DELETE /api/comments/:commentId
```

### Jobs
```
GET    /api/jobs                → All active jobs (filters: paid, location, role)
POST   /api/jobs                → Create job post (institution members only)
GET    /api/jobs/:id
PUT    /api/jobs/:id
DELETE /api/jobs/:id
POST   /api/jobs/:id/apply      → Apply (students only)
GET    /api/jobs/:id/applicants → View applicants (poster only)
PUT    /api/applications/:id/status → Update application status
```

### Chat
```
GET    /api/conversations                 → All conversations for user
GET    /api/conversations/:id/messages    → Messages (paginated)
POST   /api/conversations                 → Start new conversation
POST   /api/messages                      → Send message
```

### Notifications
```
GET    /api/notifications        → User notifications
PUT    /api/notifications/read-all
DELETE /api/notifications/:id
```

---

## 7. Socket.io Events

```js
// Client emits
"join_room"         → join personal room (userId)
"send_message"      → { conversationId, content, type }
"typing"            → { conversationId, userId }
"stop_typing"
"mark_read"         → { messageId }

// Server emits
"receive_message"   → new message to recipient
"is_typing"         → typing indicator
"notification"      → real-time notification push
"online_status"     → { userId, isOnline }
"message_read"      → read receipt update
```

---

## 8. Cloudinary Upload Strategy

```js
// Middleware: multer (memory storage) → cloudinary upload stream
const uploadToCloudinary = async (file, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto', quality: 'auto', fetch_format: 'auto' },
      (err, result) => err ? reject(err) : resolve(result)
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

// Folders used:
// educonnect/profile-pics
// educonnect/institution-pics
// educonnect/post-images
// educonnect/job-images
// educonnect/resumes
// educonnect/chat-files
```

---

## 9. Email Auth Flow (Nodemailer)

```
1. User registers with email + password
2. Server sends verification email with JWT token link
3. User clicks link → email verified → can log in
4. Login → JWT access token (7d) + refresh token (30d) in httpOnly cookie
5. Forgot password → OTP or reset link via email (expires 15min)
```

---

## 10. Responsive Layout Strategy

### Desktop (≥768px)
```
┌─────────────────────────────────────────────────┐
│  [Logo]  [Search bar]           [Notif] [Avatar] │  ← Top Navbar
├──────────┬──────────────────────┬────────────────┤
│          │                      │                │
│ LEFT     │   FEED / MAIN        │  RIGHT         │
│ SIDEBAR  │   CONTENT            │  SIDEBAR       │
│          │                      │  (Suggested    │
│ Nav      │   (Posts, Jobs etc.) │   Users, Jobs) │
│ Links    │                      │                │
│          │                      │                │
└──────────┴──────────────────────┴────────────────┘
```

### Mobile (< 768px) — Android App Feel
```
┌──────────────────────┐
│  EduConnect    🔔 📩  │  ← Minimal top bar
├──────────────────────┤
│                      │
│   FEED / PAGE        │
│   CONTENT            │
│   (Full width)       │
│                      │
│                      │
│                      │
├──────────────────────┤
│  🏠  🔍  ➕  👔  👤  │  ← Bottom Tab Bar (Instagram style)
└──────────────────────┘
```

Bottom nav tabs:
- 🏠 Home (Feed)
- 🔍 Explore
- ➕ Create Post
- 👔 Jobs
- 👤 Profile

---

## 11. PWA / Android Starter App

### manifest.json
```json
{
  "name": "EduConnect",
  "short_name": "EduConnect",
  "description": "Academic Social Network",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0F172A",
  "theme_color": "#4F46E5",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Service Worker (Workbox)
- Cache static assets (shell, fonts, icons)
- Network-first for API calls
- Offline fallback page

### Android (TWA — Trusted Web Activity)
- After PWA is live, use Bubblewrap CLI to generate APK
- App passes Lighthouse PWA criteria (installable, offline, fast)
- Users get "Add to Home Screen" prompt on Android Chrome

---

## 12. Landing Page Sections

```
1. HERO
   - Headline: "Where Academic Careers Begin"
   - Subtitle: "Connect students with teachers, find teaching roles, and build your academic network."
   - CTA: [Join as Student] [Join as Teacher/Institution]
   - Hero visual: animated mockup of the app feed

2. HOW IT WORKS (3 steps)
   - Create your profile → Browse & Connect → Apply or Post Jobs

3. FEATURES (6 cards)
   - Instagram-style Feed
   - Job Board for Academic Roles
   - Direct Messaging
   - Smart Notifications
   - Multi-Role Support
   - Mobile-First PWA

4. STATS BAR
   - 10,000+ Students | 5,000+ Teachers | 2,000+ Job Posts

5. TESTIMONIALS
   - 3 dummy cards with avatars

6. CTA BANNER
   - "Ready to connect with your academic world?"
   - [Get Started Free]

7. FOOTER
   - Logo, links, socials, © 2025 EduConnect
```

---

## 13. Phase-wise Build Plan for AI Agent (Cline/DeepSeek)

### ✅ PHASE 0 — Project Setup (Gate: Repo running locally)
```
- Initialize Vite React app + Node/Express server (monorepo)
- Install: tailwindcss, daisyui, lucide-react, axios, socket.io-client, zustand, react-router-dom
- Backend: mongoose, jsonwebtoken, bcryptjs, nodemailer, multer, cloudinary, socket.io, cors, dotenv
- Configure MongoDB Atlas connection
- Configure Cloudinary credentials
- Set up DaisyUI custom theme (educonnect palette)
- Create base file structure (frontend + backend folders as per Section 5)
- Create .env files (template)
- GATE CHECK: npm run dev — both frontend and backend start without errors
```

### ✅ PHASE 1 — Auth System (Gate: Login/Register working)
```
- User model (Mongoose) with role enum
- Register API: hash password, create user, send verification email
- Email verification with JWT link (Nodemailer)
- Login API: verify email, compare password, return JWT + httpOnly cookie
- Forgot password: OTP email flow
- Reset password API
- Auth middleware (JWT verify)
- Frontend: Register page (role selection → student form OR institution form)
- Frontend: Login page
- Frontend: Email verification page
- Frontend: Forgot/Reset password pages
- AuthContext + Zustand auth store
- Protected routes setup
- GATE CHECK: Full register → verify email → login → redirect to feed flow works
```

### ✅ PHASE 2 — User Profiles (Gate: Profile page renders with edit)
```
- User profile GET/PUT APIs
- Profile image upload (Cloudinary)
- Resume upload (Cloudinary, PDF only)
- Institution pic upload (Cloudinary)
- Frontend: Profile page (header, bio, posts tab, jobs tab)
- Frontend: Edit Profile modal (all fields, image upload preview)
- Follow / Unfollow API + button
- Followers/Following list modal
- GATE CHECK: Create profile, upload pic, edit and save → view own and other profiles
```

### ✅ PHASE 3 — Posts & Feed (Gate: Create post, see feed, like/comment)
```
- Post model + CRUD APIs
- Image upload for posts (multi-image, Cloudinary)
- Feed API (paginated, follows-based + explore)
- Like/unlike post API
- Save/unsave post API
- Comment model (with parentComment for nesting)
- Add comment API, reply to comment API
- Like comment API
- Delete comment API
- Frontend: PostCard component (image, text, like/comment/share buttons)
- Frontend: CommentThread component (nested, Instagram style)
- Frontend: Create Post modal (image upload, text, tags)
- Frontend: Feed page (infinite scroll)
- Frontend: Saved posts page
- GATE CHECK: Create post with image → see in feed → like → comment → reply to comment → like reply
```

### ✅ PHASE 4 — Job Board (Gate: Post job, apply, view applicants)
```
- JobPost model + CRUD APIs
- Job listing page (filters: paid/unpaid, location, role type)
- Create job post API (institution members only — role middleware)
- Apply to job API (students only)
- Application model + status update API
- Applicants dashboard (for job poster)
- Student applications dashboard
- Frontend: JobCard component
- Frontend: JobForm (all fields, image upload, paid toggle)
- Frontend: ApplyModal (auto-fill from profile, cover letter upload)
- Frontend: Jobs page with filters
- Frontend: My Applications page (student)
- Frontend: Applicants page (institution member)
- GATE CHECK: Institution member posts job → student applies → poster views applicants → updates status → student sees status change
```

### ✅ PHASE 5 — Real-Time Chat (Gate: Send and receive messages in real-time)
```
- Conversation model + Message model
- Socket.io server setup (join rooms, send message, typing)
- Chat APIs (get conversations, get messages paginated, send message)
- Image/file upload in chat (Cloudinary)
- Online status tracking (socket map)
- Read receipts (mark as read)
- Frontend: ChatList sidebar component
- Frontend: ChatWindow component (message bubbles, input, emoji)
- Frontend: MessageBubble (text / image / file)
- Frontend: Typing indicator animation
- Frontend: Online status dot
- Frontend: Unread badge on chat icon
- SocketContext (manage socket instance globally)
- GATE CHECK: Two users can chat in real time, typing indicator shows, read receipt updates
```

### ✅ PHASE 6 — Notifications (Gate: Bell shows real-time notifications)
```
- Notification model
- Notification creation triggers (on like, comment, follow, job apply, status change)
- Notification API (get, read-all, delete)
- Socket.io notification push
- Frontend: NotifBell with badge count
- Frontend: Notification dropdown list
- Frontend: Mark all read button
- GATE CHECK: User A likes post of User B → User B's bell updates in real time with notification
```

### ✅ PHASE 7 — Explore & Search (Gate: Search returns correct results)
```
- User search API (by name, role, institution, skill — MongoDB text index)
- Job search API (filters, text search)
- Post explore (trending/recent, non-followed)
- Frontend: Search bar with debounce (300ms)
- Frontend: Explore page (users tab + jobs tab + posts tab)
- Frontend: Search results rendering
- GATE CHECK: Search "Mathematics teacher Mumbai" returns correct users and jobs
```

### ✅ PHASE 8 — Responsive UI Polish + PWA (Gate: Passes Lighthouse PWA audit)
```
- Bottom tab bar (mobile only, CSS media query)
- Desktop sidebar (left nav + right suggestions)
- Responsive PostCard, JobCard, ProfileHeader
- DaisyUI dark mode toggle
- Loading skeletons for feed, profile, chat
- Empty state illustrations (SVG)
- Toast notifications (react-hot-toast)
- manifest.json + service worker (Workbox via vite-plugin-pwa)
- Icons all sizes (192, 512 PNG)
- "Add to Home Screen" prompt
- GATE CHECK: Mobile Chrome → "Add to Home Screen" → opens as standalone app
```

### ✅ PHASE 9 — Landing Page (Gate: Landing page live and responsive)
```
- Landing.jsx page (all 7 sections per Section 12)
- Smooth scroll navigation
- Hero animation (CSS or framer-motion)
- Responsive: full hero on desktop, stacked on mobile
- CTA buttons link to /register
- SEO meta tags (title, description, og:image)
- GATE CHECK: Landing page renders fully on mobile and desktop, CTAs work
```

### ✅ PHASE 10 — Security, Cleanup & Deployment (Gate: Live production URL)
```
- Input validation (express-validator on all routes)
- Rate limiting (express-rate-limit on auth routes)
- Helmet.js headers
- CORS lockdown to frontend domain
- Environment variable audit
- Error boundary (React)
- 404 page
- Console.log cleanup
- MongoDB indexes (email unique, text search indexes)
- Deploy backend to Render / Railway
- Deploy frontend to Vercel
- Connect custom domain (optional)
- GATE CHECK: Production URL works end-to-end, no console errors, Lighthouse score > 85
```

---

## 14. Key npm Packages

### Frontend
```
react-router-dom     → routing
axios                → HTTP client
zustand              → state management
socket.io-client     → real-time
react-hot-toast      → toasts
lucide-react         → icons
react-infinite-scroll-component → infinite feed
react-dropzone       → image upload UI
framer-motion        → landing page animations
vite-plugin-pwa      → PWA / service worker
```

### Backend
```
express              → server
mongoose             → MongoDB ORM
bcryptjs             → password hashing
jsonwebtoken         → JWT auth
nodemailer           → email
multer               → file uploads
cloudinary           → image/file CDN
streamifier          → buffer to stream for cloudinary
socket.io            → WebSockets
express-rate-limit   → rate limiting
helmet               → security headers
express-validator    → input validation
cors                 → CORS
dotenv               → env vars
```

---

## 15. Folder Structure (Full Monorepo)

```
educonnect/
├── client/                    ← React (Vite)
│   ├── public/
│   │   ├── manifest.json
│   │   └── icons/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                    ← Node + Express
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middlewares/
│   ├── utils/
│   └── server.js
├── .env.example
├── .gitignore
└── README.md
```

---

## 16. DeepSeek / Cline Agent Prompt

> Copy this prompt into DeepSeek or Cline to start the build. Feed each PHASE prompt one at a time after the GATE CHECK passes.

---

### 🤖 MASTER AGENT PROMPT

```
You are a senior full-stack developer. Build the EduConnect app — an academic social network.

TECH STACK:
- Frontend: React 18 (Vite), Tailwind CSS, DaisyUI (custom theme: educonnect), Lucide React icons, Zustand, React Router DOM, Axios, Socket.io-client
- Backend: Node.js, Express, MongoDB (Mongoose), JWT auth, Nodemailer, Multer + Cloudinary (streamifier), Socket.io
- Image/File storage: Cloudinary
- Auth: Email-based (register → verify email → login → JWT in httpOnly cookie)

DESIGN RULES:
- Colors: primary=#4F46E5 (indigo), secondary=#06B6D4 (cyan), accent=#F59E0B (amber)
- Mobile: Instagram-style bottom tab bar (Home, Explore, Create, Jobs, Profile)
- Desktop: Left sidebar nav + right suggestions sidebar
- Font: Inter (body), Poppins (headings)
- Icons: Lucide React only
- All UI must use DaisyUI components + Tailwind utilities
- Dark mode support via DaisyUI theme toggle

ROLES:
- student: can view feed, apply to jobs, chat, post
- teacher / professor / hod / principal: can post jobs, view applicants, post, chat

Follow the phased plan below. Do not proceed to the next phase until explicitly told.

START WITH PHASE 0: Project Setup.
Create the monorepo folder structure, install all dependencies, configure Tailwind + DaisyUI custom theme, connect MongoDB, connect Cloudinary, set up .env, and verify both frontend and backend start without errors.

After completing each phase, output:
✅ PHASE [N] COMPLETE
List of files created/modified
GATE CHECK: [describe what to test manually]
```

---

*Document generated for EduConnect — v1.0 Plan*
*MERN · Cloudinary · Socket.io · DaisyUI · Tailwind · Email Auth · PWA*