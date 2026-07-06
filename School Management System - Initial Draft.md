# Multi-Tenant School Management System: Functional Specifications
Reference File: schools management system -26jun 2026.docx

---

## 📱 Section 1: Unified Mobile App (Role-Based)

A single mobile application serves parents, faculty, and supervisory staff. Users sign in once and the app surfaces features based on their assigned role. A parent who is also a staff member can switch roles without installing a second app.

### 🔄 1. Global App Shell & Role Switching

* **Role Selector:** Central switcher to toggle between available roles (Parent, Faculty, Principal/HOD) for users with multiple entitlements.
* **Sibling Profile Switcher (Parent Role):** Fast avatar/name switcher allowing parents to instantly switch views between multiple children in the same school; clears the active screen and refreshes data for the selected student ID, class, and division.
* **Dynamic Assigned-Class Switcher (Faculty Role):** Dropdown selector displaying only the specific Class-Division combinations assigned to that teacher (e.g., *Class 3-A (Math)*, *Class 7-B (Science)*)[cite: 2].
* **Identity Block:** Dynamic top header showing the active context — student name, photo, class, division, roll number, batch, and health metrics for parents; teacher name, assigned classes, and current selection for faculty.
* **User Context Information:** Instant lookups for student name, class, division, and active academic batch. Supports parents managing more than one child across different grades seamlessly within the same school.

### 👨‍👩‍👧 2. Parent / Family Features

#### 2.1 School Life & Communication
* **Circulars & Notice Board:** Read-only stream of official notices published by HODs, principals, or class coordinators (supporting PDF download attachments). Features targeted filtering so parents only see announcements relevant to their child's grade level. (e.g., "Tomorrow is a holiday on the occasion of Gandhi Jayanti").
* **Interactive Calendar:** Monthly calendar view highlighting global upcoming school holidays, operational milestones, exam schedules, and parent-teacher meetings.
* **Media Gallery Section:** Event-based folder structure (e.g., Annual Sports Day) containing photos and videos, automatically filtered by the active child's grade level.

#### 2.2 Daily Academic Trackers
* **Syllabus & Homework Log:** A daily text feed where parents track exactly what was taught in class alongside any basic, informal daily activities or reading directives.
* **Assignments Dashboard:** An interactive ledger tracking structured assignments, featuring digital download attachments, clear due dates, and real-time completion tags (*Pending*, *Submitted*, *Graded*).
* **Time-Table Section:** Grid-based layout displaying the active child's period-by-period daily subject timetable, timings, and assigned teacher names[cite: 2].

#### 2.3 Attendance & Performance Progress
* **Monthly Attendance Grid:** Visual calendar grid using color coding (🟢 Present, 🔴 Absent, 🟡 Excused Leave) alongside aggregate calculations showcasing total days present, absent metrics, and overall percentage counts[cite: 2].
* **Exam Schedules & Portions:** Timeline view of upcoming unit tests or terminal exams, directly tracking specific exam dates, subject listings, and marked study portions[cite: 2].
* **Granular Marks Tracker:** Scorecard displaying individual test results as they are published, broken down by Subject, Test Date, and Marks Obtained / Max Marks[cite: 2].
* **Grade & Rank Display:** View assigned grades and class/section/school ranks alongside individual marks for each exam.
* **Digital Result Sheet Center:** Dedicated secure archive where parents can view and download the formal, school-signed cumulative report card PDFs uploaded by the faculty[cite: 2].
* **Result Publication Alerts:** Push notifications when new marks or report cards are published by the faculty.

#### 2.4 Financial Management (Accounts)
* **Child-Specific Fee Ledger:** Itemized breakdown showing exact fee assignments (Tuition, Bus, Lab) mapped to the selected child, filtering clear states for **Fees Paid** and **Pending Dues**[cite: 2].
* **Consolidated Sibling Billing:** Master billing screen aggregating outstanding dues across all linked children, allowing parents to complete a single transaction for total combined balances to save on gateway payment processing fees[cite: 2].
* **Receipt Repository:** Digital storage locker holding historical records of all digital transactions, allowing parents to download school-branded tax invoice/receipt PDFs instantly[cite: 2].

#### 2.5 Safety & Operations
* **Digital Leave Application:** Interface allowing parents to digitally apply for medical or personal leaves for their child, which instantly updates the teacher’s portal for review and updates the app's attendance calendar upon approval[cite: 2].
* **Live Transport Tracking:** *(Note: Highlighted as NA / Pending Core Mapping)* Embedded real-time GPS map tracking the exact route, current location, and Estimated Time of Arrival (ETA) of the school bus mapped to the student's route[cite: 2].
* **Secured Gate Pass & Pick-Up Authorization:** Generates dynamic, secure QR codes or transaction pins used by parents at dismissal times for security guard verification[cite: 2]. Includes a utility tool to authorize proxy pickup by uploading temporary photos and names of an authorized relative or driver[cite: 2].

#### 2.6 Feedback Loop
* **Parent Helpdesk Ticket System (Query):** Form-based ticketing panel where parents can submit questions, concerns, or administrative requests directly to the school management or the class teacher, automatically tagged with the child's ID metadata for fast, correct routing[cite: 2].

#### 2.7 Student Almanac

A dedicated mobile almanac maintained inside the app for every student. The same almanac is also visible to the Principal and Super Admin.

- **Remarks & Leaves Record:** Chronological log of teacher and class-coordinator remarks, behavioural notes, and all leave applications with status and approval history.
- **Holiday Calendar:** Integrated school holiday calendar with optional regional and religious events.
- **Multi-Language Prayers:** Daily prayer collection available in multiple languages such as Hindi, Gujarati, English, etc., with optional text or audio toggle.

#### 2.8 Student Health, Emergency & School Timeline

Enriched student profile section available to parents and school authorities.

- **Medical Details:** Blood group, known allergies, asthma, chronic medical conditions, current medications, and doctor notes.
- **Emergency Contact:** Primary and secondary emergency contacts with relationship, phone number, and alternate contact options.
- **School Timeline:** A longitudinal view of the student's journey from the day of enrolment, including class progression, academic batches, milestones, and notable school events.

### 👩‍🏫 3. Faculty Features

#### 3.1 Teacher Context & Class Selector
* **Dynamic Assigned-Class Switcher:** A dropdown selector displaying only the specific Class-Division combinations assigned to that teacher (e.g., *Class 3-A (Math)*, *Class 7-B (Science)*)[cite: 2].
* **Student Directory Roster:** A read-only roster of all students in the selected class, showing details like Roll Number, Parent Contacts, and vital emergency medical flags (Allergies/Blood Group)[cite: 2].

#### 3.2 Personal Timetable & Free Lecture Dashboard
* **My Weekly Timetable:** A clean, color-coded weekly grid showing the faculty member's complete schedule across all assigned divisions — lecture slots with subject name, class/division, room number, and time range.
* **Today's Schedule:** A day-focused vertical view showing what's happening today — current period highlighted, next period preview, and end-of-day summary.
* **Free Lecture Indicator:** Slots where the teacher has no assigned lecture are clearly marked as "Free" with a distinct color/icon. The teacher can see how many free periods they have today and this week.
* **Room & Lab Info:** Each slot displays the assigned room or lab so the teacher knows exactly where to go without checking elsewhere.
* **Tap-to-Act:** Tapping a lecture slot gives quick access to mark attendance, log syllabus, or publish homework for that specific class/division/subject combination — reducing navigation friction.

#### 3.3 Internal Indent & Resource Request Module
* **Create Indent Request:** A digital requisition form where teachers can request materials under specific category headings[cite: 2]:
  * *Stationery:* Pens, whiteboard markers, paper reams, chalk[cite: 2].
  * *Lab Equipment:* Science apparatus, chemicals, safety gear[cite: 2].
  * *Academics:* Textbooks, reference materials, teacher guides[cite: 2].
* **Quantity & Urgency Toggles:** Input fields to enter item counts and set priority tiers (*Routine* vs. *Urgent*)[cite: 2].
* **Real-Time Status Tracker:** A tracking log showing the lifecycle of the request inside the app: `Submitted` $\rightarrow$ `Pending Admin Approval` $\rightarrow$ `Approved / Ready for Pickup` $\rightarrow$ `Collected`[cite: 2].
* **Digital Collection Handshake:** Once the Admin approves and prepares the items, the teacher receives an automated notification[cite: 2]. Upon collecting the physical items from the inventory room, the teacher taps "Confirm Collection" to close the ticket log[cite: 2].

#### 3.4 Smart Attendance Module
* **Quick-Tap Roll Call:** A student roster grid where all students are marked "Present" by default[cite: 2]. The teacher simply taps a name once to toggle them to 🔴 **Absent** or 🟡 **Leave**[cite: 2].
* **Instant Parent Sync:** Hitting "Submit Attendance" automatically triggers background push notifications directly to the respective parents of absent students[cite: 2].

#### 3.5 Daily Academic Publishing
* **Syllabus & Homework Logger:** A simple text entry field where the teacher types the daily classroom progress note and logs activities to sync it directly to the Parent App dashboard[cite: 2].
* **Assignment Manager:** Interface to publish formal assignments with due dates, target descriptions, and attachments (snapping a picture of a worksheet or attaching a reference PDF)[cite: 2].

#### 3.6 Exam & Result Management
* **Quick-Mark Entry Sheet:** A tabular spreadsheet interface optimized for entering test scores directly on mobile layouts (*Student Roll No* $\rightarrow$ *Input Marks Field*)[cite: 2].
* **Bulk Result Sheet Uploader:** A fast fallback tool allowing teachers to choose an exam and directly upload a consolidated result PDF (via mobile camera scan or file attachments) instead of typing individual student marks score-by-score[cite: 2].
* **Grading Scheme Engine:** Define and apply grade ranges (e.g., A1, A2, B1) or percentile-based grades per exam, subject, or class division[cite: 2].
* **Rank List Generator:** Auto-generate class-wise, section-wise, and school-wide rank lists based on exam scores[cite: 2].
* **Parent Result Notification:** Automatic push and SMS notification to parents when marks or signed result sheets are published[cite: 2].

#### 3.7 Communication & Announcements
* **Targeted Class Broadcaster:** An input screen allowing teachers to write and publish announcements strictly to their specific assigned Class/Division (e.g., *"Class 3-A requires watercolors tomorrow"*)[cite: 2].
* **Media Gallery Contributor:** Allows teachers to upload photos/videos from daily classroom activities directly into school event albums (subject to Admin approval gate)[cite: 2].

#### 3.8 HR & Personal Leave Management
* **Teacher Attendance Ledger:** A personal dashboard tracking the faculty member's own monthly clock-in/clock-out logs[cite: 2].
* **Leave Application Suite:** Diagnostic tool to apply for casual or medical leave directly to school management, tracking the approval status in real time[cite: 2].

#### 3.9 Parent Query Resolution (Helpdesk Backend)
* **Query Inbox:** A support ticket console showing formal questions, notes, or concerns filed by parents of that teacher's specific classes[cite: 2].
* **Status Toggle:** Allows teachers to reply to parent concerns and change the ticket status directly from 🔴 **Open** to 🟢 **Resolved**[cite: 2].

### 👑 4. Principal / HOD Mobile View (Optional)

Optional read-only access within the same app for supervisory staff:

* **School-Wide Analytics Snapshot:** Quick view of attendance and performance summaries.
* **Approval Queue:** Mobile actions for result-sheet approval, faculty leave, and media gallery moderation.
* **Student Almanac & Profile Supervision:** Read-only access to any student almanac, medical details, emergency contacts, and school timeline.

---

## 💻 Section 2: Central Admin Web ERP Engine

*Per system instructions, the core database engine runs on a web browser to manage heavy administrative workflows, financial monitoring, and multi-tenant scaling parameters safely[cite: 2].*

### 💻 Part 1: Core Control Engine Operations

#### 🏢 1. Tenant & Identity Management
* **White-Label Setup Profile:** Where the school admin registers the school's unique structural identity—uploading corporate logos, configuring custom UI color themes for the mobile app, assigning unique subdomains (`schoolname.platform.com`), and archiving institutional affiliation IDs[cite: 2].
* **Academic Year & Batch Builder:** Configurator tool to establish active and upcoming operational cycles (e.g., creating Batch `2026-27`), defining global term spans, and logging semester timelines[cite: 2].
* **Class, Division & Subject Configurator:** Panel to initialize standards (Class 1 to 12), map sections/divisions (A, B, C), manage comprehensive subject listings, and bind specific course structures to these grids[cite: 2].

#### 👥 2. Onboarding & Lifecycle Registries
* **Student Master Onboarding:** A complete database engine to register students[cite: 2]. Collects auto-generated unique Student IDs, cross-link sibling accounts, primary parent mobile routing coordinates, documents, medical parameters (blood group, allergies, asthma, chronic conditions, medications), and emergency contact details[cite: 2].
* **Bulk Student Import:** Upload CSV/Excel files to import students in bulk, with field validation, duplicate detection, error reporting, and auto-generation of unique Student IDs for successful records[cite: 2].
* **Faculty & Staff Hiring Console:** HR directory to onboard teachers and staff[cite: 2]. Records regulatory certifications, manages salary baselines, configures maximum weekly lecture hours, and assigns teachers to specific Class-Division combinations[cite: 2].

#### 💰 3. Financial Central Command (Fee & Collection Engine)
* **Dynamic Fee Structure Engine:** Allows accounts to construct complex fee brackets (e.g., *Class 10 Science Stream Tuition + Lab Fees*) and broadcast scheduled automated invoices directly to parental portfolios[cite: 2].
* **Real-Time Daily Collection Tracker:** A centralized financial dashboard monitoring all incoming revenue streams[cite: 2]. Filters transactions by payment method (UPI, card, netbanking, cash) and records live transactional logging[cite: 2].
* **Defaulter & Outstanding Management:** Tracks aging reports of unpaid bills[cite: 2]. Features a single-click tool to broadcast automated SMS/Push notifications to all parents with unpaid dues[cite: 2].
* **Receipt Auto-Generator:** Automatically generates digitally stamped, downloadable tax invoices/receipts for every successful transaction instantly[cite: 2].

#### 📦 4. Central Inventory & Indent Management Backend
* **Inventory Ledger:** Stock tracking for stationery (markers, papers, chalk), lab equipment (beakers, safety wear), and textbooks with integrated low-stock threshold alerts[cite: 2].
* **Indent Request Desk:** The approval hub where Admin views inbound requests from the faculty app[cite: 2]. Admins can click Approve, mark items as Ready for Pickup, and log when the teacher physically collects the goods to deduct them from inventory automatically[cite: 2].

#### 🤖 6. AI-Assisted Timetable Generation (Phase 1)
* **Faculty Availability & Preference Capture:** Admins can define per-faculty availability windows (e.g., "Teacher X unavailable Monday after 12pm", "Teacher Y prefers morning slots") and subject-specific constraints (e.g., "Math requires 4 periods/week for Class 10-A").
* **Constraint-Aware Scheduling Engine:** The system collects all constraints — faculty assignments (`FacultyClassAssignment`), maximum weekly lecture caps, subject-period requirements per division, room/lab availability, and faculty availability windows — and packages them into a structured payload.
* **ChatGPT API Integration:** The constraint payload is sent to the OpenAI ChatGPT API with a structured prompt to generate an optimal weekly timetable. The AI model returns a complete slot-by-slot timetable that respects all constraints (no double-booking, balanced workload, lab/room conflicts avoided).
* **Timetable Review & Edit Console:** The AI-generated timetable lands in a review console where the admin can visually inspect the schedule per division and per faculty, manually override any slot, and publish once satisfied. The system validates manual overrides against constraints in real-time.
* **Generation History & Re-generation:** Every generation attempt is logged (request payload, AI model used, response, status, generated-by user). Admins can re-generate with tweaked constraints or revert to a previous version.

#### 🎫 5. Operational Safety
* **Omnichannel Broadcaster:** Emergency broadcast console to send global alerts (e.g., unexpected weather closures) across Push notifications, SMS, and Email channels simultaneously[cite: 2].
* **Gate Pass & Visitor Logs:** Controls security gate metrics, synchronizing with the mobile app to verify authorized proxy pickups or dynamic digital gate passes[cite: 2].

---

### 👑 Part 2: Principal & HOD Command Center (Separate Dashboard View)

*This specialized view provides bird's-eye visibility across the entire school's daily activities, performance metrics, and compliance logs without data entry clutter[cite: 2].*

#### 📈 1. School-Wide Analytics & Attendance Audit
* **Live Attendance Heatmaps:** Real-time visibility into daily morning roll-call data, showing overall attendance percentages for both students and faculty across all classes/divisions[cite: 2].
* **Academic Performance Trackers:** Allows the principal to drill down into any class's test marks or view school-wide grade averages to identify underperforming divisions or subjects[cite: 2].
* **Grading Scheme Oversight:** Review and approve grade ranges, grading policies, and result-weight configurations before publication.
* **Rank List Oversight:** View and approve class-wise, section-wise, and school-wide rank lists before they are released to parents.

#### 📝 2. Supervisory Review & Global Access
* **Global Class Lookup:** Direct administrative viewing access into any class's live timetable, daily teacher homework entries, assigned tasks, and active lesson progress logs[cite: 2].
* **Digital Result Sheet Approval:** Before terminal report cards are published to the parent app, the Principal/HOD audits and gives final sign-off on the consolidated digital result sheets[cite: 2].

#### 🚨 3. Administrative Approval Hub
* **Faculty Leave Manager:** Review panel for inbound teacher leave requests[cite: 2]. Principals can view historical leave balances, identify substitute coverage allocations, and click Approve or Reject[cite: 2].
* **Media Gallery Gatekeeper:** Content moderation queue[cite: 2]. Photos and videos snapped by teachers on the ground land here first; once approved by the HOD/Principal, they are published to the public parent gallery[cite: 2].

#### 💬 4. Escalation & Grievance Review
* **Master Query Matrix:** A tracker showing all parent tickets submitted through the app[cite: 2]. Highlights unresolved or long-standing parent queries, allowing the Principal to see which teacher or administrator is handling the case[cite: 2].

### 📔 5. Student Almanac & Profile Supervision
* **Student Almanac View:** Principal and HODs can open any student's almanac (remarks, leaves record, holiday calendar, and multi-language prayers) directly from the command center.
* **Health & Emergency Review:** Read-only access to student medical details, emergency contacts, and school timeline.
* **Super Admin Override:** Super Admin gets system-wide visibility into every student almanac and health/emergency profile across all tenants from the Central Admin Web ERP Engine.

---

## 🛠️ Section 3: Architecture & Integration Layer

### 🗄️ 1. Database Layer (The Multi-Tenant Tables)
PostgreSQL schemas engineered to include explicit `school_id` tags to maintain total isolation between institutions[cite: 2].

```sql
-- 1. School Tax Profile (Unique config per school)
CREATE TABLE school_tax_profiles (
    id SERIAL PRIMARY KEY,
    school_id INT UNIQUE REFERENCES schools(id),
    pan_number VARCHAR(10) NOT NULL,
    tan_number VARCHAR(10) NOT NULL, -- Required for filing Form 24Q
    pf_registration_no VARCHAR(20),
    authorized_signatory_name VARCHAR(100)
);

-- 2. Faculty Tax Setup (Tracks individual preferences)
CREATE TABLE faculty_tax_profiles (
    id SERIAL PRIMARY KEY,
    school_id INT REFERENCES schools(id),
    user_id INT REFERENCES users(user_id),
    chosen_regime VARCHAR(10) DEFAULT 'NEW', -- 'NEW' or 'OLD'
    basic_salary NUMERIC(12, 2),
    hra NUMERIC(12, 2),
    special_allowance NUMERIC(12, 2)
);

-- 3. Monthly Payslip & TDS Ledger (The actual calculation audit trail)
CREATE TABLE monthly_payroll_ledger (
    id SERIAL PRIMARY KEY,
    school_id INT REFERENCES schools(id),
    user_id INT REFERENCES users(user_id),
    payout_month INT, -- e.g., 7 for July
    payout_year INT,  -- 2026
    gross_earned NUMERIC(12, 2),
    tds_deducted NUMERIC(12, 2),
    pf_deducted NUMERIC(12, 2),
    net_paid NUMERIC(12, 2),
    is_disbursed BOOLEAN DEFAULT FALSE
);

```

---

## 📋 Backlog

### 📝 Future Features
- **Re-Evaluation Request:** Allow parents/students to request answer-sheet re-evaluation or re-marking for a published exam result. Kept in backlog for future implementation.
- **Student QR Code Identity:** Generate a unique QR code for each student that, when scanned by a teacher or authorized school staff, displays the student's full profile (name, class, division, roll number, medical details, emergency contacts, almanac summary). Access to scanned data will be governed by role-based permissions (e.g., a class teacher sees more than a general staff member). Kept in backlog for future implementation.

---

## 🚫 Out of Scope / Parked

### 💰 Faculty Salary Management & Tax Filing (TDS) Module

*Automates salary disbursements while dynamically calculating Tax Deducted at Source (TDS) in compliance with the Income Tax Act, 2025[cite: 2].*

### 🧮 1. Dynamic Payroll & Salary Structure Builder
* **Component Breakdown Matrix:** Configuration engine to define salary structures for different faculty tiers (e.g., *Primary, High School, HOD, Ad-hoc professors*)[cite: 2].
  * **Earnings:** Basic Salary, Dearness Allowance (DA), House Rent Allowance (HRA), Special Allowances[cite: 2].
  * **Deductions:** Provident Fund (PF) employee share, Professional Tax (PT), monthly TDS, and customized school policy deductions (e.g., unexcused loss of pay)[cite: 2].
* **Biometric & Leave Syncing Integration:** Automatically reads monthly approved attendance and leave records from the faculty app to auto-calculate unpaid leaves and adjust the monthly gross salary payload[cite: 2].

### 📝 2. Dynamic Tax Regime Choice & Investment Declaration
* **Regime Selection Gate:** A portal tool allowing faculty to choose between the New Tax Regime (the standard default system) and the Old Tax Regime at the start of the financial cycle[cite: 2].
* **Form 12BB Digital Workflow:** A document submission window inside the faculty profile where teachers upload investment proofs if using the Old Regime (such as Section 80C, 80D, or Home Loan interest)[cite: 2].
* **Verification Dashboard:** A fast-review workspace where the school accounts team reviews, accepts, or rejects uploaded tax saving proofs[cite: 2].

### 📊 3. Automated TDS Engine (FY 2026-27 Compliant)
* **Real-time Projected Tax Computations:** The engine automatically tracks year-to-date earnings, adds standard deductions ($₹75,000$ for the New Regime; $₹50,000$ for the Old Regime), and splits the remaining taxable total into monthly TDS deductions[cite: 2].
* **New Tax Regime Slab Automations:** Built-in auto-calculation using statutory tax brackets[cite: 2]:

| Taxable Annual Income Bracket | Tax Rate | Notes |
| :--- | :--- | :--- |
| Up to ₹4,00,000 | NIL | Basic Exemption Floor[cite: 2] |
| ₹4,00,001 to ₹8,00,000 | 5% |[cite: 2] |
| ₹8,00,001 to ₹12,00,000 | 10% | Zero net tax liability up to ₹12 Lakhs due to Section 87A Rebate[cite: 2] |
| ₹12,00,001 to ₹16,00,000 | 15% |[cite: 2] |
| ₹16,00,001 to ₹20,00,000 | 20% |[cite: 2] |
| ₹20,00,001 to ₹24,00,000 | 25% |[cite: 2] |
| Above ₹24,00,000 | 30% | Max Base Tax Slab[cite: 2] |

### 📂 4. Statutory Compliance & Govt. Challan Generation
* **Quarterly Form 24Q Generator:** Generates the precise e-TDS data text file required by the Income Tax Department for quarterly salary compliance returns[cite: 2].
* **Automated Form 16 Factory:** At the end of the financial year, the system cross-references all 4 quarters of settled payroll data to auto-compile and sign downloadable Form 16 Part A & Part B PDFs directly into the teacher's personal application vault[cite: 2].
* **PF Electronic Challan-cum-Return (ECR):** Compiles and outputs the monthly text registry required for swift upload to the EPFO employer portal[cite: 2].

### 🏦 5. Bulk Corporate Banking Settlements
* **Bank Corporate-ID Upload:** Generates standard bank-format encryption files (such as ICICI, HDFC, or SBI corporate formats)[cite: 2]. The admin simply reviews the master monthly ledger, clicks "Generate Bank File," and uploads it straight to the corporate banking portal to trigger single-click multi-account salary transfers[cite: 2].

### 📱 Faculty App View Additions (What the Teacher Gets)
* **Tax Projections Worksheet:** A simple calculator panel showing how their current monthly TDS is being calculated based on their declared regime choice[cite: 2].
* **Form 16 Vault:** A tab under HR settings to download current or historical Form 16 copies[cite: 2].

---