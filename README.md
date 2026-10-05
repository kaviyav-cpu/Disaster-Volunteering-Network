# Disaster Volunteering Network (DVN) - Full Stack Architecture

A disaster response coordination platform connecting **Volunteers**, **NGOs**, and **System Administrators**, backed by **Node.js, Express, and MongoDB Compass**.

---

## 📁 Project Architecture & Clean Separation

```
Disaster-Volunteering-Network-main (2)/
│
├── backend/                             # Node.js & Express REST API Server
│   ├── config/
│   │   └── db.js                        # Mongoose connection to MongoDB Compass
│   ├── models/                          # MongoDB Collections
│   │   ├── User.js                      # Volunteers, NGOs, and Admin accounts
│   │   ├── Task.js                      # Relief missions & deployments
│   │   ├── VolunteerRequest.js          # Deployment applications
│   │   ├── Proof.js                     # Field hours & photo proofs
│   │   ├── SystemLog.js                 # Verified audit trail & event logs
│   │   ├── Broadcast.js                 # Emergency siren dispatches
│   │   ├── Reminder.js                  # Personal equipment checklists
│   │   └── Highlight.js                 # Community field highlights
│   ├── routes/                          # REST API Endpoints (/api/...)
│   │   ├── authRoutes.js                # Register, Login, Users
│   │   ├── taskRoutes.js                # Task CRUD, Apply, Check-In
│   │   ├── volunteerRoutes.js           # Profile, Skills, Proof, Reminders
│   │   ├── ngoRoutes.js                 # Dashboard summary, Requests, Proofs
│   │   ├── adminRoutes.js               # Live metrics, Audit logs, User verification
│   │   ├── broadcastRoutes.js           # Emergency siren alerts
│   │   └── highlightRoutes.js           # Live field updates CRUD
│   ├── seeds/
│   │   └── seed.js                      # Populates MongoDB Compass with rich initial data
│   ├── .env                             # Port, MongoDB URI, Secret
│   ├── package.json
│   └── server.js                        # Express server entrypoint (Port 5000)
│
├── frontend/                            # Client-Side Application
│   ├── index.html                       # Public Home: Live audio broadcast & Highlights CRUD
│   ├── login.html                       # Login with 1-Click Quick Demo Accounts
│   ├── register.html                    # Role-based registration (Volunteer & NGO)
│   ├── css/
│   │   └── style.css                    # Unified modern styles
│   ├── js/
│   │   ├── api.js                       # Centralized API bridge to Node.js backend
│   │   └── auth.js                      # User session & role routing
│   │
│   ├── volunteer/                       # 🤝 VOLUNTEER PORTAL
│   │   ├── index.html                   # Dashboard: live clock, siren audio SOS, video awareness, check-in
│   │   ├── skill-matching.html          # EMT, Rescue, Food filter with sound & match rating
│   │   ├── task-details.html            # Mission brief, audio playback speed controller, application
│   │   ├── upload-proof.html            # Range slider (1-12 hrs), live photo preview reader
│   │   └── profile.html                 # Editable profile, add skill certifications, badge generator
│   │
│   ├── ngo/                             # 🏢 NGO PORTAL (Preserved from dvn-ngo)
│   │   ├── index.html                   # NGO App Shell with sidebar navigation
│   │   ├── partials/                    # All 8 preserved NGO views:
│   │   │   ├── dashboard.html           # Real-time task & volunteer metrics
│   │   │   ├── create-task.html         # Form to publish new disaster tasks
│   │   │   ├── manage-tasks.html        # Task oversight, status toggling, deletion
│   │   │   ├── volunteer-requests.html  # Review and approve volunteer applications
│   │   │   ├── verify-proof.html        # Inspect volunteer hours & verify proofs
│   │   │   ├── volunteer-list.html      # Mobilized volunteer directory
│   │   │   ├── reports.html             # Operational reports & breakdown
│   │   │   └── profile.html             # NGO registration & organization profile
│   │   └── js/                          # AngularJS modules, routes, services & controllers
│   │
│   ├── admin/                           # 🛡️ SYSTEM ADMIN CONSOLE
│   │   └── index.html                   # Live MongoDB counters, emergency siren dispatch,
│   │                                    # user verification table, searchable audit logs
│   │
│   └── assets/                          # Static assets (images, audio, video)
│
└── Disaster-Volunteering-Network-main/   # Original backup archive preserved intact
```

---

## 🍃 MongoDB Compass Connection

1. Open **MongoDB Compass**.
2. Connect to the default URI:
   ```
   mongodb://127.0.0.1:27017
   ```
3. You will see the database: **`disaster_volunteering_network`** with all collections:
   - `users`
   - `tasks`
   - `volunteerrequests`
   - `proofs`
   - `systemlogs`
   - `broadcasts`
   - `reminders`
   - `highlights`

---

## 🚀 Running the Application

### 1. Start the Backend Server:
```bash
cd backend
npm install
node server.js
```
*(Server runs on `http://localhost:5000`)*

### 2. Open the Frontend:
- Open your browser to: **`http://localhost:5000`**
- Or open `frontend/index.html` directly.

### 3. Demo Credentials (Also available via 1-Click buttons on `login.html`):
- **Volunteer**: `kaviya@example.com` / `user`
- **NGO (Red Cross)**: `contact@redcross.org` / `ngo`
- **NGO (GlobalMedic)**: `contact@globalmedic.org` / `ngo`
- **Admin**: `admin@dvn.org` / `admin`

### 4. Re-seeding MongoDB anytime:
```bash
cd backend
npm run seed
```

## ✅ Corrected End-to-End Data Flow

The NGO portal is now connected to the same MongoDB data used by the Volunteer and Admin portals. The main flow is:

1. **Volunteer registers/logs in** → volunteer profile is stored in `users`.
2. **NGO registers** → NGO starts as `Pending Verification`.
3. **Admin approves NGO** → NGO becomes `Active` and can log in.
4. **NGO creates/publishes a task** → task is stored with the NGO's `createdBy` user id.
5. **Volunteer opens Skill Task Matching** → published tasks are loaded from MongoDB.
6. **Volunteer applies** → `volunteerrequests` stores the real volunteer id + task id.
7. **NGO opens Volunteer Requests** → the request appears automatically; Approve/Reject updates MongoDB.
8. **Approved request** increments the task's assigned count and makes the volunteer eligible for check-in.
9. **Volunteer checks in** → check-in is recorded on the task against the volunteer id.
10. **Volunteer uploads proof** → only an approved task can receive a proof submission; the volunteer's history immediately changes that task to **Completed** while the proof itself remains Pending until the NGO verifies it.
11. **NGO verifies/rejects proof** → proof status changes in MongoDB; approved hours/points update the volunteer profile.
12. **NGO Dashboard, Reports and Volunteer List** read the same MongoDB records, so changes are reflected across pages after refresh/navigation.
13. **Admin** sees live user/task/proof statistics and audit logs.
14. **Login page** is the only public entry point to the Volunteer, NGO and Admin portals; the public Home page no longer exposes direct dashboard links.

### Important
- Do not open the HTML files with `file://` for the final demo. Start the Node server and use **http://localhost:5000**.
- If the database is empty, run `cd backend` then `npm run seed` once.
- The project intentionally does not include `node_modules` in the corrected ZIP. `start.bat` installs dependencies automatically.

## Volunteer Status Flow (Updated)

The Volunteer portal now follows this exact status flow:

**Find Task → Apply → Applied → NGO Approves → Check In → Upload Proof → Completed**

- Clicking **Apply Now** changes the button to **✓ Applied** immediately and saves the application in MongoDB.
- The Volunteer Dashboard shows only that volunteer's own task applications.
- Until the NGO approves the application, the dashboard shows **Applied / Waiting for NGO approval**.
- After NGO approval, **Check In** becomes available.
- After check-in, the dashboard shows **Checked In**.
- After the volunteer uploads proof, the task is shown as **✓ Completed** in the Volunteer Dashboard and Profile history immediately.
- The proof can still remain **Pending** until the NGO verifies it; this does not remove the Completed history status.
- The Profile page contains the complete task history with Applied/Completed status and proof status.

## Portal Login Flow (Updated)

The public Home page does not expose direct Volunteer, NGO or Admin dashboard links. Use **Login** and choose:

- 🤝 Volunteer Login
- 🏢 NGO Login
- 🛡️ Admin Login

After successful authentication, the backend role determines which portal is opened.

### Running on Windows PowerShell

From the extracted project folder:

```powershell
.\start.bat
```

Then use:

```text
http://localhost:5000
```

Do not open the HTML files directly with `file://` for the database-connected flow.
