# 🚀 EduConnect — Unique Features Plan
### *15 Additive Features — Zero Impact on Core Flow*
**Stack:** MERN · Cloudinary · Socket.io · DaisyUI · Tailwind CSS

> All features below are designed to be **bolt-on additions**.
> They do NOT modify existing auth, feed, post, job, chat, or notification flows.
> Each feature has its own phase, model changes (if any), API routes, and frontend components.

---

## 📦 FEATURE INDEX

| # | Feature | Category | New Model? | New Routes? | Frontend Component |
|---|---|---|---|---|---|
| F01 | Academic Match Algorithm | Intelligence | No | 1 GET | `MatchedJobsRow` |
| F02 | Skill Gap Indicator | Intelligence | No | No | `SkillGapBar` |
| F03 | Who's Hiring Near You Map | Discovery | No | 1 GET | `JobsMapView` |
| F04 | Application Funnel Kanban | Analytics | No | 1 PUT | `ApplicantKanban` |
| F05 | Profile Strength Meter | Analytics | No | No | `StrengthMeter` |
| F06 | Post Reach Counter | Analytics | 1 field | 1 PATCH | `ReachStats` |
| F07 | Verified Badge System | Identity | 1 field | 1 PUT (admin) | `VerifiedBadge` |
| F08 | Academic Timeline | Identity | No | No | `AcademicTimeline` |
| F09 | Skill Endorsements | Identity | 1 sub-array | 2 routes | `EndorsementTag` |
| F10 | Open to Opportunities Toggle | Community | 1 field | 1 PATCH | `OpportunityToggle` |
| F11 | Noticeboard Posts | Community | No (enum++) | No | `NoticeboardBanner` |
| F12 | Anonymous Q&A on Job Posts | Community | 1 sub-doc | 3 routes | `JobQnA` |
| F13 | Story-style Announcements | Mobile/UX | 1 model | 3 routes | `StoryBar` |
| F14 | Quick Apply | Mobile/UX | No | 1 POST | `QuickApplyBtn` |
| F15 | Chat Reactions | Mobile/UX | 1 sub-array | 1 POST | `MessageReaction` |

---

---

# F01 — Academic Match Algorithm

## Overview
When a student completes their profile, the system auto-scores and surfaces the **top 5 most relevant job posts** for them daily — shown as a "Matched for You" row on the Jobs page. Pure backend scoring, no ML library needed.

## How It Works
```
Score = (matching skills count / total required skills) * 60
      + (education level match ? 30 : 0)
      + (location match ? 10 : 0)

Top 5 jobs sorted by score descending → returned as matched jobs
```

## Model Changes
**None.** Uses existing `User.skills`, `User.address`, `JobPost.skillsRequired`, `JobPost.requiredQualifications`, `JobPost.location`.

## New API Route
```
GET /api/jobs/matched
Headers: Authorization: Bearer <token>  (student only)

Response:
{
  matched: [
    {
      job: { ...JobPost },
      score: 78,
      matchedSkills: ["React", "Node.js"],
      missingSkills: ["MongoDB"]
    },
    ...
  ]
}
```

## Backend Logic (Controller)
```js
// controllers/job.controller.js → getMatchedJobs
export const getMatchedJobs = async (req, res) => {
  const student = await User.findById(req.user._id);
  const jobs = await JobPost.find({ isActive: true })
    .populate('postedBy', 'name institutionName profilePic');

  const scored = jobs.map(job => {
    const studentSkills = student.skills.map(s => s.toLowerCase());
    const jobSkills = job.skillsRequired.map(s => s.toLowerCase());
    const matched = studentSkills.filter(s => jobSkills.includes(s));
    const missing = jobSkills.filter(s => !studentSkills.includes(s));
    const skillScore = jobSkills.length
      ? (matched.length / jobSkills.length) * 60 : 0;
    const eduScore = job.requiredQualifications
      .some(q => student.qualifications.includes(q)) ? 30 : 0;
    const locScore = job.location === student.address?.city ? 10 : 0;
    return {
      job, score: skillScore + eduScore + locScore,
      matchedSkills: matched, missingSkills: missing
    };
  });

  const top5 = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  res.json({ matched: top5 });
};
```

## Frontend Component
**File:** `src/components/job/MatchedJobsRow.jsx`
```
- Horizontal scrollable row above job grid on /jobs page
- Each card shows: job title, institution, score badge (e.g. "78% match")
- "Matched for You" heading with ✨ icon (Lucide Sparkles)
- Only renders if user.role === 'student' and matched.length > 0
- Skeleton loader while fetching
```

## UI Placement
```
/jobs page:

┌─────────────────────────────────────────────┐
│ ✨ Matched for You                          │
│ [JobCard 78%] [JobCard 65%] [JobCard 52%] → │  ← horizontal scroll
├─────────────────────────────────────────────┤
│ All Jobs  [ Filters ]                       │
│ [JobCard] [JobCard] [JobCard]               │
└─────────────────────────────────────────────┘
```

## Gate Check
Student with skills ["React", "Node.js"] → GET /api/jobs/matched → returns top 5 scored jobs → renders MatchedJobsRow on /jobs page.

---

---

# F02 — Skill Gap Indicator on Job Cards

## Overview
When a student views any job post detail, a visual bar shows **"You match 4/6 required skills"** with matched skills in green and missing skills in red. Zero new API or model changes.

## Model Changes
**None.** Uses `User.skills` vs `JobPost.skillsRequired`.

## New API Routes
**None.** Comparison logic is pure frontend using already-fetched data.

## Frontend Logic
```js
// Inside JobDetailModal or JobDetailPage
const studentSkills = useAuthStore(s => s.user.skills) // from Zustand
const matchedSkills = job.skillsRequired.filter(s =>
  studentSkills.map(x => x.toLowerCase()).includes(s.toLowerCase())
)
const missingSkills = job.skillsRequired.filter(s =>
  !studentSkills.map(x => x.toLowerCase()).includes(s.toLowerCase())
)
const matchPercent = Math.round(
  (matchedSkills.length / job.skillsRequired.length) * 100
)
```

## Frontend Component
**File:** `src/components/job/SkillGapBar.jsx`
```jsx
<div className="skill-gap-section">
  <p className="text-sm font-semibold">
    You match {matchedSkills.length}/{job.skillsRequired.length} skills
  </p>
  <progress
    className="progress progress-success w-full"
    value={matchedSkills.length}
    max={job.skillsRequired.length}
  />
  <div className="flex flex-wrap gap-2 mt-2">
    {matchedSkills.map(s => (
      <span className="badge badge-success">{s}</span>
    ))}
    {missingSkills.map(s => (
      <span className="badge badge-error badge-outline">{s}</span>
    ))}
  </div>
</div>
```

## UI Placement
```
Job Detail Modal / Page:

┌──────────────────────────────────┐
│ Senior Mathematics Teacher       │
│ Delhi Public School · Paid       │
│ ─────────────────────────────── │
│ You match 4/6 skills             │
│ ████████████░░░░  67%            │
│ [✓ Teaching] [✓ Maths] [✓ Hindi] │
│ [✗ B.Ed Required] [✗ CTET]      │
│                                  │
│ [Apply Now]  [Quick Apply]       │
└──────────────────────────────────┘
```

## Gate Check
Student with skills ["Teaching", "Maths"] views a job requiring ["Teaching", "Maths", "B.Ed", "CTET"] → bar shows 2/4 match → green + red badges render correctly.

---

---

# F03 — Who's Hiring Near You (Map View)

## Overview
A toggle on the Jobs page switches from card grid to an **interactive Leaflet.js map** showing institution pins for jobs in the user's city/state. Each pin opens a popup with job title and apply button.

## Model Changes
Add `coordinates: { lat: Number, lng: Number }` (optional) to `JobPost`. Falls back to city-level geocoding if not set.

```js
// JobPost.js addition
coordinates: {
  lat: { type: Number },
  lng: { type: Number }
}
```

## New API Route
```
GET /api/jobs/map
Query: ?city=Pune&state=Maharashtra

Response:
{
  jobs: [
    {
      _id, title, institutionName, institutionLogo,
      isPaid, roleType,
      coordinates: { lat: 18.52, lng: 73.85 }
    }
  ]
}
```

## Frontend Setup
```bash
npm install leaflet react-leaflet
```

## Frontend Component
**File:** `src/components/job/JobsMapView.jsx`
```
- Renders <MapContainer> centered on user's city coordinates
- Each job = <Marker> with custom institution icon
- <Popup> shows: job title, institution name, "View Job" button
- Toggle button "🗺 Map View" / "⊞ Grid View" on /jobs page
- Map only shows for users who have address set in profile
```

## UI Placement
```
/jobs page:

[ ⊞ Grid View ]  [ 🗺 Map View ]   ← toggle buttons

Map Mode:
┌─────────────────────────────────────────────┐
│   [MAP - Pune region]                       │
│      📍 Delhi Public School (2 jobs)        │
│         📍 Symbiosis College (1 job)        │
│   📍 Fergusson College (3 jobs)             │
└─────────────────────────────────────────────┘
```

## Gate Check
Institution posts job with location "Pune" → student in Pune → clicks "Map View" → map shows pins → click pin → popup shows job details.

---

---

# F04 — Application Funnel Kanban

## Overview
Inside the institution member's Applicants dashboard, a **Kanban-style pipeline board** replaces the flat applicant list. Drag a card from "Applied" to "Shortlisted" to update status in MongoDB.

## Model Changes
**None.** Uses existing `Application.status` enum:
`['applied', 'reviewed', 'shortlisted', 'rejected', 'selected']`

## New API Route
```
PUT /api/applications/:id/status
Body: { status: 'shortlisted' }
Auth: institution member (job poster only)

Response: { application: updatedApplication }
```
> This route likely already exists per the master plan. No change needed.

## Frontend Setup
```bash
npm install @dnd-kit/core @dnd-kit/sortable
```

## Frontend Component
**File:** `src/components/job/ApplicantKanban.jsx`
```
- 5 columns: Applied | Reviewed | Shortlisted | Rejected | Selected
- Each card shows: applicant avatar, name, education, match score
- Drag card to column → fires PUT /api/applications/:id/status
- Optimistic UI update (move card immediately, revert on error)
- Count badge on each column header
- Mobile: horizontal scroll between columns (snap scroll)
```

## UI Placement
```
/jobs/:id/applicants page:

┌─────────┬──────────┬────────────┬──────────┬──────────┐
│Applied  │Reviewed  │Shortlisted │Rejected  │Selected  │
│  (12)   │   (5)    │    (3)     │   (2)    │   (1)    │
├─────────┼──────────┼────────────┼──────────┼──────────┤
│[Card]   │[Card]    │[Card]      │[Card]    │[Card]    │
│[Card]   │[Card]    │[Card]      │          │          │
│[Card]   │          │            │          │          │
└─────────┴──────────┴────────────┴──────────┴──────────┘
```

## Gate Check
Institution member views job applicants → Kanban board renders → drag applicant card from "Applied" to "Shortlisted" → status updates in DB → student's My Applications page shows "Shortlisted".

---

---

# F05 — Profile Strength Meter

## Overview
A **circular progress ring** on the student's own profile page showing "Profile Strength: 72%" — calculated from how many profile fields are filled. Pure frontend, zero backend change.

## Model Changes
**None.**

## New API Routes
**None.**

## Scoring Logic (Frontend)
```js
// utils/profileStrength.js
export const calcStrength = (user) => {
  const checks = [
    { field: 'name',            weight: 10 },
    { field: 'profilePic.url',  weight: 15 },
    { field: 'bio',             weight: 10 },
    { field: 'age',             weight: 5  },
    { field: 'address',         weight: 5  },
    { field: 'resumeUrl',       weight: 20 },
    { field: 'skills.length',   weight: 15, check: v => v >= 3 },
    { field: 'qualifications.length', weight: 10, check: v => v >= 1 },
    { field: 'education',       weight: 10 },
  ];
  let score = 0;
  checks.forEach(({ field, weight, check }) => {
    const val = field.split('.').reduce((o, k) => o?.[k], user);
    if (check ? check(val) : Boolean(val)) score += weight;
  });
  return score; // 0-100
};
```

## Frontend Component
**File:** `src/components/profile/StrengthMeter.jsx`
```
- SVG circular ring (stroke-dashoffset animation on mount)
- Color: red (0-40%) → amber (41-70%) → green (71-100%)
- Below ring: list of incomplete fields as action links
  e.g. "📄 Add Resume (+20%)" → opens edit modal to resume section
- Only visible to the profile owner (not public)
```

## UI Placement
```
My Profile page (owner view only):

┌──────────────────────────┐
│   [Avatar]  Rahul Sharma │
│                          │
│       ⬤ 72%              │  ← circular ring
│   Profile Strength       │
│                          │
│ ✅ Photo  ✅ Bio          │
│ ✅ Skills  ❌ Resume      │  ← checklist
│ ❌ Add Resume (+20%) →   │
└──────────────────────────┘
```

## Gate Check
Student with no resume and no bio → profile strength = 47% → amber ring → "Add Resume (+20%)" link shows → click → edit modal opens at resume field.

---

---

# F06 — Post Reach Counter

## Overview
Institution members see a small stat line on their own job posts: **"👁 234 views · 18 saves · 7 applied."** A `viewCount` field is incremented each time the job detail is fetched.

## Model Changes
Add one field to `JobPost`:
```js
// JobPost.js addition
viewCount: { type: Number, default: 0 }
```

## New API Route
```
PATCH /api/jobs/:id/view
Auth: Any logged-in user (called silently when job detail opens)
Action: JobPost.findByIdAndUpdate(id, { $inc: { viewCount: 1 } })

No response body needed (fire-and-forget from frontend)
```

## Frontend Logic
```js
// In JobDetailModal or JobDetailPage useEffect
useEffect(() => {
  if (job?._id) {
    axios.patch(`/api/jobs/${job._id}/view`).catch(() => {}); // silent
  }
}, [job?._id]);
```

## Frontend Component
**File:** `src/components/job/ReachStats.jsx`
```jsx
// Only shown to job poster
{isOwner && (
  <div className="flex gap-4 text-sm text-base-content/60 mt-2">
    <span><Eye size={14}/> {job.viewCount} views</span>
    <span><Bookmark size={14}/> {job.saves?.length} saves</span>
    <span><Users size={14}/> {job.applicants?.length} applied</span>
  </div>
)}
```

## UI Placement
```
Job Card (owner view):

┌──────────────────────────────────────┐
│ Senior Maths Teacher · DPS Pune      │
│ Paid · ₹25,000/mo · On-site         │
│ ────────────────────────────────── │
│ 👁 234 views · 🔖 18 saves · 👥 7   │  ← only visible to poster
│                       [Edit] [Close] │
└──────────────────────────────────────┘
```

## Gate Check
Institution member creates job → student opens job detail → `viewCount` increments in DB → institution member views their job post → sees accurate view/save/apply counts.

---

---

# F07 — Verified Badge System

## Overview
Three-tier verification shown on profiles and post cards:
- ✅ **Email Verified** (auto on email confirmation)
- 🏫 **Institution Verified** (admin approves after document check)
- ⭐ **Top Contributor** (auto: posts with >100 total likes)

## Model Changes
Extend `User.isVerified` from Boolean to enum:
```js
// User.js change
verifiedStatus: {
  type: String,
  enum: ['none', 'email', 'institution', 'top_contributor'],
  default: 'none'
}
```
> Keep `isVerified: Boolean` as alias = `verifiedStatus !== 'none'` for backward compatibility.

## New API Routes
```
PUT /api/admin/users/:id/verify
Body: { verifiedStatus: 'institution' }
Auth: Admin only

POST /api/users/request-verification
Body: { documentUrl: String } (Cloudinary PDF upload)
Auth: Institution members only
```

## Badge Logic (auto Top Contributor)
```js
// Run after each post like
const totalLikes = await Post.aggregate([
  { $match: { author: userId } },
  { $project: { count: { $size: '$likes' } } },
  { $group: { _id: null, total: { $sum: '$count' } } }
]);
if (totalLikes[0]?.total >= 100) {
  await User.findByIdAndUpdate(userId,
    { verifiedStatus: 'top_contributor' }
  );
}
```

## Frontend Component
**File:** `src/components/common/VerifiedBadge.jsx`
```jsx
const badges = {
  email: { icon: <CheckCircle size={14}/>, color: 'badge-info',    label: 'Email Verified' },
  institution: { icon: <School size={14}/>, color: 'badge-success', label: 'Institution Verified' },
  top_contributor: { icon: <Star size={14}/>, color: 'badge-warning', label: 'Top Contributor' },
};
// Renders inline next to user name everywhere (PostCard, ProfileHeader, ChatList)
```

## UI Placement
```
PostCard:
  [Avatar] Priya Sharma ✅            ← email verified
  [Avatar] DPS Delhi    🏫            ← institution verified
  [Avatar] Rahul G.     ⭐            ← top contributor

Profile Header:
  Priya Sharma  🏫 Institution Verified
  [Follow] [Message]
```

## Gate Check
Admin calls PUT /api/admin/users/:id/verify with `{ verifiedStatus: 'institution' }` → badge appears next to user name on their posts and profile → badge tooltip shows "Institution Verified".

---

---

# F08 — Academic Timeline on Profile

## Overview
A clean vertical timeline below the bio on every public profile showing the user's academic/career journey: **School → College → Current Role.** Pure frontend — reads from existing profile fields.

## Model Changes
**None.** Reads from: `user.education`, `user.institutionName`, `user.role`, `user.qualifications`, `user.createdAt`.

For richer timelines, add optional array to User:
```js
// User.js optional addition
timeline: [{
  year: String,         // e.g. "2018"
  title: String,        // e.g. "B.Tech Computer Science"
  institution: String,  // e.g. "MIT Pune"
  type: { type: String, enum: ['school', 'college', 'work', 'achievement'] }
}]
```

## New API Routes
**None** (uses existing GET /api/users/:id).

If timeline array is added:
```
PUT /api/users/:id/timeline
Body: { timeline: [...] }
Auth: Profile owner only
```

## Frontend Component
**File:** `src/components/profile/AcademicTimeline.jsx`
```
- Vertical line with circular nodes
- Each node: year (left) · title + institution (right)
- Color coded: school=blue · college=purple · work=teal · achievement=amber
- "Add Timeline Entry" button (owner only) → opens mini form modal
- Collapses to 3 items with "Show More" on mobile
```

## UI Placement
```
Profile Page:

  [Avatar]  Rahul Sharma
  MCA Student · Pune
  "Passionate about full-stack dev..."

  📅 Academic Journey
  ───────────────────
  2023 ●── B.E. Computer Engg · COEP
  2019 ●── 12th Science · Kendriya Vidyalaya
  2017 ●── 10th · St. Mary's School
  [+ Add Entry]  (owner only)
```

## Gate Check
Student adds 3 timeline entries via edit profile → public profile page renders vertical timeline with correct year/institution labels → non-owner cannot see "Add Entry" button.

---

---

# F09 — Skill Endorsements

## Overview
Any logged-in user can **endorse** another user's specific skill (one click, like LinkedIn). Endorsement count shows per skill tag on profile. Cannot endorse your own skills.

## Model Changes
```js
// User.js addition — inside skills array, convert from [String] to:
skills: [{
  name: String,
  endorsements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}]
```

> **Migration note:** existing `skills: [String]` → convert to `skills: [{ name: String, endorsements: [] }]` in a one-time migration script.

## New API Routes
```
POST /api/users/:id/skills/:skillName/endorse
Auth: Any logged-in user (not self)
Action: $addToSet endorsement if not already endorsed
Response: { skill: { name, endorsementCount } }

DELETE /api/users/:id/skills/:skillName/endorse
Auth: Same user (remove own endorsement)
Response: { skill: { name, endorsementCount } }
```

## Frontend Component
**File:** `src/components/profile/EndorsementTag.jsx`
```jsx
// Each skill tag on profile
<div className="badge badge-outline gap-1 cursor-pointer"
  onClick={() => handleEndorse(skill.name)}>
  {skill.name}
  <span className="badge badge-primary badge-xs">
    {skill.endorsements.length}
  </span>
  {isEndorsedByMe ? <ThumbsUp size={10} fill="currentColor"/> : <ThumbsUp size={10}/>}
</div>
```

## UI Placement
```
Profile Page — Skills section:

Skills & Endorsements:
[React ⬆ 12] [Node.js ⬆ 8] [MongoDB ⬆ 5] [Python ⬆ 3]
                                         ↑
                              click to endorse/unendorse
```

## Gate Check
User A views User B's profile → clicks endorse on "React" → endorsement count goes from 4 to 5 → User A's avatar appears in endorsement list → User A clicks again → removed → back to 4.

---

---

# F10 — Open to Opportunities Toggle

## Overview
Students can flip a toggle in Settings — **"Open to Opportunities: ON."** Their profile avatar shows a small green dot badge everywhere. Institution members can **filter** students by this flag.

## Model Changes
```js
// User.js addition
openToOpportunities: { type: Boolean, default: false }
```

## New API Route
```
PATCH /api/users/me/opportunity-status
Body: { openToOpportunities: true | false }
Auth: Students only
Response: { openToOpportunities: Boolean }
```

## Frontend Components

**1. Toggle in Settings page:**
```jsx
// src/pages/Settings.jsx
<div className="flex items-center justify-between">
  <div>
    <p className="font-semibold">Open to Opportunities</p>
    <p className="text-sm opacity-60">
      Let institutions know you're available for roles
    </p>
  </div>
  <input type="checkbox" className="toggle toggle-success"
    checked={user.openToOpportunities}
    onChange={handleToggle}
  />
</div>
```

**2. Green dot on Avatar (everywhere):**
```jsx
// src/components/common/Avatar.jsx
<div className="relative">
  <img src={user.profilePic.url} className="avatar"/>
  {user.openToOpportunities && (
    <span className="absolute bottom-0 right-0 w-3 h-3
      bg-success rounded-full border-2 border-base-100"/>
  )}
</div>
```

**3. Filter on People search (for institution members):**
```
GET /api/users/search?q=&openToOpportunities=true
```

## UI Placement
```
Settings Page:
  Open to Opportunities    [●────] ON   ← toggle

Everywhere avatar appears:
  [Avatar]●  ← green dot when ON

User Search (institution member view):
  [Filter: Open to Opportunities ☑]
  Results show only students with flag ON
```

## Gate Check
Student toggles ON in Settings → PATCH updates DB → green dot appears on their avatar in feed, chat, profile → institution member filters search by openToOpportunities=true → student appears in results.

---

---

# F11 — Noticeboard Posts (Institution-Only)

## Overview
Verified institution accounts can publish a special **Noticeboard post** that appears **pinned at the top of the Explore page** for 48 hours with a distinct amber banner. After 48 hours, it drops into the regular feed.

## Model Changes
Extend `Post.type` enum (existing field):
```js
// Post.js — add to enum
type: {
  type: String,
  enum: ['general', 'job', 'announcement', 'achievement', 'noticeboard'],
  default: 'general'
}
```

Add `expiresAt` field:
```js
noticeboardExpiresAt: { type: Date }  // set to createdAt + 48h for noticeboard posts
```

Add MongoDB TTL index (for auto-cleanup — optional, can just filter):
```js
// Only remove from pinned section, not delete the post
// Filter: type='noticeboard' AND noticeboardExpiresAt > now
```

## New API Routes
**None new.** Use existing POST /api/posts with `type: 'noticeboard'`.

Add one query to feed route:
```js
// GET /api/posts/noticeboard  (for Explore page top section)
const notices = await Post.find({
  type: 'noticeboard',
  noticeboardExpiresAt: { $gt: new Date() }
}).populate('author').sort({ createdAt: -1 }).limit(5);
```

## Role Guard
```js
// In post creation controller
if (req.body.type === 'noticeboard' &&
    !['teacher','professor','hod','principal'].includes(req.user.role)) {
  return res.status(403).json({ error: 'Only institution members can post notices' });
}
```

## Frontend Component
**File:** `src/components/post/NoticeboardBanner.jsx`
```
- Amber gradient card with 📌 icon and "Notice" badge
- Shows remaining time: "Pinned · expires in 36h"
- Appears above regular posts in Explore page
- Maximum 3 notices visible at once (rest collapsed)
- Create Post modal: institution members see "Noticeboard" as type option
```

## UI Placement
```
/explore page:

📌 Notices (3 active)
┌─────────────────────────────────────────────┐
│ 📌 NOTICE  DPS Delhi · expires in 36h       │  ← amber banner
│ Admissions open for PGT Mathematics 2025    │
│ Apply before Dec 30. Contact: hr@dps.in     │
└─────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━
  Regular Explore Posts
━━━━━━━━━━━━━━━━━━━━━━━
```

## Gate Check
Institution member (verified) creates post with type "noticeboard" → post appears pinned on Explore page with amber styling and countdown → after 48 hours → disappears from pinned section → still visible in regular feed as a normal post.

---

---

# F12 — Anonymous Q&A on Job Posts

## Overview
Any user can post a **public question** on a job listing (anonymous option). The institution member answers. Everyone can read the Q&A thread, helping candidates get clarity without DMing.

## Model Changes
Add `qna` sub-document array to `JobPost`:
```js
// JobPost.js addition
qna: [{
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  question: String,
  askedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isAnonymous: { type: Boolean, default: false },
  answer: String,
  answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answeredAt: Date,
  createdAt: { type: Date, default: Date.now }
}]
```

## New API Routes
```
POST /api/jobs/:id/qna
Body: { question, isAnonymous }
Auth: Any logged-in user
Response: { qna: updatedQnaArray }

POST /api/jobs/:id/qna/:qnaId/answer
Body: { answer }
Auth: Job poster only
Response: { qna: updatedQnaArray }

DELETE /api/jobs/:id/qna/:qnaId
Auth: Asker or job poster
```

## Frontend Component
**File:** `src/components/job/JobQnA.jsx`
```
- Accordion section at bottom of Job Detail page/modal: "Questions & Answers (5)"
- Each Q: shows question, asker name (or "Anonymous"), date
- Each A: indented reply with institution member avatar + name
- "Ask a Question" input at bottom (with Anonymous toggle checkbox)
- Job poster sees "Answer" button next to unanswered questions
- Unanswered questions show "Awaiting answer..." in muted text
```

## UI Placement
```
Job Detail Page:

  [Job Description]
  [Skills Required]
  [Apply Button]

  ─────────────────────────────
  ❓ Questions & Answers (3)
  ─────────────────────────────
  Q: Is this role full-time or part-time?   [Anonymous · 2d ago]
  A: This is a full-time role.              [DPS Delhi HR · 1d ago]

  Q: Is CTET mandatory?                    [Priya S. · 1d ago]
     ⏳ Awaiting answer...

  [Ask a question...]  [☐ Post Anonymously]  [Send]
```

## Gate Check
Student asks question with isAnonymous=true → shows as "Anonymous" → institution member sees "Answer" button → posts answer → answer appears below question for all viewers → student sees notification "Your question was answered".

---

---

# F13 — Story-style Announcements

## Overview
Institutions can post **24-hour Announcement Stories** — full-screen cards with image + text, shown in a horizontal story bar at the top of the feed (exactly like Instagram stories). Auto-expires via MongoDB TTL index.

## Model Changes
New `Story` model (separate from Post):
```js
// models/Story.js
const storySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { url: String, publicId: String },      // Cloudinary
  text: { type: String, maxlength: 200 },
  viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now, expires: 86400 } // TTL: 24 hours
});
```
> `expires: 86400` = MongoDB auto-deletes document after 24 hours. Zero manual cleanup needed.

## New API Routes
```
POST /api/stories
Body: FormData { text, image }
Auth: Institution members only (role guard)
Response: { story }

GET /api/stories
Auth: Any logged-in user
Response: { stories: grouped by author }
// Only returns stories from followed users + own

POST /api/stories/:id/view
Auth: Any logged-in user
Action: $addToSet viewers (fire-and-forget)
```

## Frontend Component
**File:** `src/components/post/StoryBar.jsx`
```
StoryBar (horizontal scroll row):
- Each bubble: institution logo + name + colored ring if unseen
- Click bubble → StoryViewer modal (full-screen dark overlay)
- StoryViewer: image fills screen, text at bottom, progress bar at top
- Auto-advance after 5 seconds if multiple stories from same author
- "Post Story" bubble (➕) for institution members only
- Story upload: image + text + 5 second preview before post
```

**File:** `src/components/post/StoryViewer.jsx`
```
- Full screen modal (fixed, z-50)
- Top: progress bar (CSS animation, 5s)
- Center: story image (object-cover)
- Bottom overlay: author name + text + timestamp
- Swipe left/right for next/prev story (touch events)
- Close button (X top right)
- View count visible to story author only (e.g. "👁 42 views")
```

## UI Placement
```
/feed page (top of feed):

[+]  [DPS Delhi]  [Symbiosis]  [COEP]  [MIT Pune]
Your  (unseen·    (seen·gray)  (unseen  (unseen
story  blue ring)              ·ring)   ·ring)
```

## Gate Check
Institution member creates story with image + text → appears in story bar within 5 seconds (via socket or refetch) → other users see colored ring → click → full-screen story viewer opens → progress bar auto-advances → after 24 hours → story auto-deleted by MongoDB TTL → disappears from story bar.

---

---

# F14 — Quick Apply (One-Tap)

## Overview
If a student's profile strength is **≥ 80%**, job cards show a **"Quick Apply"** button that submits the application instantly using stored profile data. No modal, no form. Standard Apply button remains for cover letter customization.

## Model Changes
**None.** Uses existing `Application` model. Quick apply creates application with `coverLetter: 'Applied via Quick Apply'` and `resumeUrl` from student profile.

## New API Route
```
POST /api/jobs/:id/quick-apply
Auth: Students only (role guard)
Checks:
  1. Profile strength ≥ 80% (calculate server-side)
  2. Not already applied
  3. Job still active and not past deadline
Action: Creates Application with profile data auto-filled
Response: { application, message: 'Applied successfully!' }
```

## Server-side Strength Check
```js
// controllers/job.controller.js
const checkEligibility = (student) => {
  let score = 0;
  if (student.name) score += 10;
  if (student.profilePic?.url) score += 15;
  if (student.bio) score += 10;
  if (student.age) score += 5;
  if (student.address) score += 5;
  if (student.resumeUrl) score += 20;
  if (student.skills?.length >= 3) score += 15;
  if (student.qualifications?.length >= 1) score += 10;
  if (student.education) score += 10;
  return score >= 80;
};
```

## Frontend Component
**File:** `src/components/job/QuickApplyBtn.jsx`
```jsx
// Shows on JobCard and JobDetailModal
{profileStrength >= 80 && !alreadyApplied && (
  <button className="btn btn-success btn-sm gap-1" onClick={handleQuickApply}>
    <Zap size={14}/> Quick Apply
  </button>
)}
// On success: button changes to ✓ Applied (disabled)
// Loading state: spinner inside button
// Error (already applied): toast "Already applied to this job"
// Error (low profile): toast "Complete your profile to Quick Apply"
```

## UI Placement
```
Job Card:

┌────────────────────────────────────┐
│ [Logo] Senior Maths Teacher        │
│ DPS Pune · Paid · ₹25k/mo         │
│ React, Node.js, MongoDB            │
│                                    │
│ [Apply]          [⚡ Quick Apply]  │
└────────────────────────────────────┘
                        ↑
            only shows if profile ≥ 80%
```

## Gate Check
Student completes profile to 80%+ → views job card → "⚡ Quick Apply" button appears → clicks → application created in DB → button changes to "✓ Applied" → institution member sees application in Kanban board.

---

---

# F15 — Chat Reactions

## Overview
In the chat window, **long-press (mobile) or hover (desktop)** on any message shows a row of 6 emoji reaction options. Reactions appear as small pills below the message bubble. Multiple users can react.

## Model Changes
Add `reactions` sub-array to `Message`:
```js
// Message.js addition
reactions: [{
  emoji: { type: String },   // e.g. "👍"
  reactedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}]
```

## New API Route
```
POST /api/messages/:id/react
Body: { emoji: '👍' }
Auth: Any chat participant
Action:
  - If user already reacted with same emoji → remove (toggle)
  - If user reacted with different emoji → swap
  - If new reaction → add
Response: { reactions: updatedReactions }

// Also emit via Socket.io:
io.to(conversationRoom).emit('message_reaction', {
  messageId, reactions: updatedReactions
});
```

## Allowed Emojis
```js
const ALLOWED_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];
```

## Frontend Component
**File:** `src/components/chat/MessageReaction.jsx`
```
Reaction Picker (shown on hover/long-press):
┌─────────────────────────────┐
│  👍  ❤️  😂  😮  😢  🔥  │  ← floats above message bubble
└─────────────────────────────┘

Reaction Pills (shown below bubble after reacting):
  [👍 3] [❤️ 1]
```

**File:** `src/components/chat/MessageBubble.jsx` (edit existing)
```jsx
// Add to existing MessageBubble component:

// Hover detection (desktop)
const [showPicker, setShowPicker] = useState(false);
// Long press (mobile)
const pressTimer = useRef(null);
const handlePressStart = () => {
  pressTimer.current = setTimeout(() => setShowPicker(true), 500);
};

// Reaction pills below bubble
<div className="flex gap-1 mt-1">
  {groupedReactions.map(({ emoji, users }) => (
    <button
      className={`badge badge-ghost text-xs gap-1 cursor-pointer
        ${myReaction === emoji ? 'badge-primary' : ''}`}
      onClick={() => handleReact(emoji)}
    >
      {emoji} {users.length}
    </button>
  ))}
</div>
```

## Socket.io Addition
```js
// Client: listen for reaction updates
socket.on('message_reaction', ({ messageId, reactions }) => {
  updateMessageReactions(messageId, reactions); // Zustand action
});
```

## UI Placement
```
Chat Window:

  [Avatar] Priya Sharma
  ┌──────────────────────┐
  │ Hey, are you free    │
  │ tomorrow for the     │  ← hover/long-press
  │ interview round?     │
  └──────────────────────┘
        👍 2  ❤️ 1           ← reaction pills

  (hover shows picker above bubble)
  ┌─────────────────┐
  │ 👍 ❤️ 😂 😮 😢 🔥│
  └─────────────────┘
```

## Gate Check
User A long-presses a message → reaction picker appears → clicks ❤️ → pill appears below message for both users via socket → User B clicks 👍 → both reactions visible → User A clicks ❤️ again → removed (toggle).

---

---

## 🗂 Combined Implementation Order

Build these features **after Phase 8 (Responsive UI)** of the master plan, in this order to minimize merge conflicts:

| Order | Feature | Reason |
|---|---|---|
| 1 | F07 Verified Badge | Used in almost every other component |
| 2 | F05 Profile Strength | Needed for F14 Quick Apply |
| 3 | F06 Post Reach Counter | 1 field + 1 route, very low risk |
| 4 | F10 Open to Opportunities | 1 field + 1 route, very low risk |
| 5 | F08 Academic Timeline | Pure frontend if no model change |
| 6 | F02 Skill Gap Indicator | Pure frontend |
| 7 | F09 Skill Endorsements | Model change on skills array |
| 8 | F01 Academic Match | Uses finalized User + JobPost models |
| 9 | F11 Noticeboard Posts | Enum extension only |
| 10 | F04 Application Kanban | Uses existing Application model |
| 11 | F14 Quick Apply | Needs F05 done first |
| 12 | F12 Anonymous Q&A | New sub-doc on JobPost |
| 13 | F15 Chat Reactions | New sub-array on Message |
| 14 | F03 Map View | New library install |
| 15 | F13 Story Announcements | New model + Cloudinary upload |

---

## 🤖 DeepSeek / Cline Agent Prompt for Each Feature

> Use this template for each feature. Replace `[FXX]` with feature number/name.

```
You are working on the EduConnect MERN app.
The core app (auth, feed, jobs, chat, notifications) is already built and working.

Now implement Feature [FXX] — [Feature Name].

RULES:
- Do NOT modify any existing working route or component unless strictly required.
- Add new fields to existing models using $addFields or schema additions only.
- All new components go in src/components/[category]/[ComponentName].jsx
- All new routes go in existing route files (add below existing routes, do not replace).
- Follow DaisyUI + Tailwind CSS styling. Use Lucide React icons only.
- After implementation, output:

✅ FEATURE [FXX] COMPLETE
Files created: [list]
Files modified: [list]
GATE CHECK: [what to manually test]
```

---

*EduConnect Unique Features Plan — v1.0*
*15 Additive Features · Zero Core Flow Impact · MERN Stack*