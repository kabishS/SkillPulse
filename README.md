# SkillPulse - A Simple System. A Smarter Match

> **Smart India Hackathon (SIH) Project Statement**: `#SIH26135`  
> **Platform Name**: **SkillPulse**  
> **Tagline**: *"A simple system. A smarter match. No confusing black boxes. SkillPulse makes the matching process simple, understandable, and transparent."*

---

## 📌 Project Overview

**SkillPulse** is an algorithmic, transparent career and talent matchmaking ecosystem developed for Smart India Hackathon (`SIH26135`). Traditional recruitment platforms function like "black boxes," leaving job seekers and employers uncertain about how matches are determined. 

SkillPulse eliminates ambiguity by uniting four key stakeholders under a unified, transparent architecture:
1. **Candidates (Users)**: Job seekers and students showcasing pre-verified skills, academic achievements, and project portfolios.
2. **Companies (Employers)**: Hiring organizations seeking authentic talent through transparent skill matching without hidden algorithms.
3. **Coaching Centers / Institutes**: Training academies that authenticate and certify candidate skills directly.
4. **Administrators**: System auditors overseeing algorithmic fairness and verification integrity.

---

## 🚀 Key Features

### 1. User / Candidate Portal (`index.html` / `user.html`)
- **Comprehensive Candidate Onboarding**:
  - Personal Details: Full Name, Email, Phone, Gender.
  - Academic Background: College, Degree, Graduation Year, Education Level.
  - Employment Status: Toggle between *Unemployed/Student* and *Currently Employed* (with conditional fields for Company Name, Salary, and Employee ID).
  - Technical Portfolio: Comma-separated skill tokens, project details (Title, Description, Link), and PDF resume attachment.
- **8 Dedicated Dashboard Views**:
  1. **Dashboard**: High-level overview displaying profile completion rate, matched opportunities, skill count, and project preview.
  2. **My Profile**: Complete viewable and editable candidate profile card with verified skills badges.
  3. **Resume Analyzer**: PDF resume dropzone with role-based skill gap detection and recommendations.
  4. **Available Opportunities**: Searchable and filterable job/internship listings dynamically synchronized from live company postings.
  5. **Matched Companies**: Filtered opportunities where candidate verified skills meet or exceed 50% match threshold.
  6. **Recommended Courses**: Curated upskilling modules from verified coaching institutes to close identified skill gaps.
  7. **Notifications**: Real-time activity feed (profile views, skill verifications, application status).
  8. **Settings**: Account security, password updates, and profile privacy preferences.

---

### 2. Company / Employer Portal (`company.html`)
- **Employer Authentication**:
  - Official work email, company name, industry sector, organization size, website, HR contact person, phone, and headquarters location.
- **5 Dedicated Recruiter Views**:
  1. **Dashboard**: Metrics for active job requisitions, total applicants, and matched candidates.
  2. **Post Job**: Interactive form to publish new jobs and internships (Title, Type, Location, Salary, Experience, Minimum Qualification, Required Skills, and Description).
  3. **Match User**: Algorithmic talent matching engine listing registered candidates with calculated match percentages, verified skill badges, resume preview, and one-click shortlisting.
  4. **Notifications**: Alerts when candidates apply for posted roles or coaching centers verify candidate skill tokens.
  5. **Settings**: Organization profile management, recruiter contact information, and security controls.

---

## ⚡ Two-Way Dynamic Cross-Portal Synchronization

SkillPulse features a clean, dynamic data architecture powered by browser `localStorage` and cross-tab reactive listeners (`storage` event):

```
+-----------------------------------------------------------+
|                      SkillPulse Ecosystem                 |
+-----------------------------------------------------------+
         |                                           |
         v                                           v
[ User Portal: index.html ]               [ Company Portal: company.html ]
         |                                           |
         |-- 1. Candidate registers / logs in ------>| (Appears in 'Match User')
         |                                           |
         |<-- 2. Company publishes job requisition --| (Appears in 'Opportunities')
         |                                           |
         |-- 3. Candidate clicks 'Apply Now' ------->| (Alerts in 'Notifications')
         |                                           |
+-----------------------------------------------------------+
|              Shared Browser Storage (localStorage)        |
+-----------------------------------------------------------+
```

- **Clean Starting State**: Starts with zero hardcoded dummy records. All metrics and cards accurately reflect real user and company actions.
- **Instant Cross-Tab Updates**: Open `company.html` in Tab 1 and `index.html` in Tab 2 side-by-side. Changes made in one portal reflect immediately in the other without manual page reloads.

---

## 🎨 Design System & Technology Stack

- **Frontend**: Semantic HTML5, Modular CSS3, Vanilla JavaScript (ES6+).
- **Typography**: Google Fonts [Poppins](https://fonts.google.com/specimen/Poppins) (`300`, `400`, `500`, `600`, `700`).
- **Icons**: [FontAwesome 6](https://fontawesome.com/) vector iconography.
- **Color Palette**:
  - Primary Blue: `#2563eb`
  - Dark Blue: `#1d4ed8`
  - Deep Navy: `#0f172a`
  - Accent Sky Blue: `#eff6ff`
  - Pure White: `#ffffff`
  - Neutral Slate: `#f8fafc` / `#e2e8f0`
- **Data Persistence**: Browser `localStorage` (zero external database setup required to run or demo).

---

## 📁 Repository Structure

```
SIH26135/
├── index.html              # Main Landing Page & User Portal
├── user.html               # Dedicated Candidate Portal Entry Point
├── company.html            # Dedicated Company / Employer Portal
│
├── css/
│   ├── user.css            # Styling for User Portal & Landing Page
│   └── company.css         # Styling for Company Portal
│
├── js/
│   ├── user.js             # Candidate auth, 8-tab dashboard & dynamic opportunities
│   └── company.js          # Company auth, job publishing & talent matching engine
│
└── README.md               # Project documentation
```

---

## 💻 Getting Started / How to Run

### Option 1: Direct Browser Launch
1. Double-click or open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
2. To test the Company Portal, click **Company** in the top navigation bar, or open `company.html` directly.

### Option 2: Live Server (Recommended for local dev)
If using Visual Studio Code with the **Live Server** extension:
1. Right-click `index.html` and select **Open with Live Server** (runs at `http://127.0.0.1:5500/index.html`).
2. Open `http://127.0.0.1:5500/company.html` in a second tab to test cross-tab synchronization.

---

## 🧪 Quick Demo Walkthrough

1. **Step 1 - Company Portal (Tab 1)**:
   - Open `company.html` and click **Demo Recruiter Login**.
   - Notice: Active Jobs is `0`, and Match User displays *"No candidates registered yet"*.
2. **Step 2 - User Portal (Tab 2)**:
   - Open `index.html` in a separate tab and click **Demo Quick Login** (or sign up with custom skills e.g., `Python, Machine Learning, SQL`).
   - Notice: Opportunities displays *"No opportunities posted yet"*.
3. **Step 3 - Publish Job Requisition (Tab 1)**:
   - In `company.html`, navigate to **Post Job** and publish a role (e.g. `ML Intern`, ₹25,000/month, required skills: `Python, SQL, Machine Learning`).
   - Switch to **Match User**: The registered candidate profile immediately appears with a high matching score!
4. **Step 4 - View Live Opportunity (Tab 2)**:
   - In `index.html`, open **Opportunities**: The newly published `ML Intern` job is visible live with your calculated match percentage!
   - Click **Apply Now**: A notification is sent to the company portal.

---

## 📄 License & Credits

Developed for the **Smart India Hackathon** problem statement **#SIH26135**.  
&copy; 2026 **SkillPulse**. All rights reserved.

