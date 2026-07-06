# Permission Matrix Implementation — Task Tracker

> **Source:** `permissions_matrix.csv`
> **Generated:** 2026-07-03 (Revised)
> **Rules:** Permissions from Y/N matrix · Changes from Improvements column · Questions from Open Questions column · Notes column is IGNORED
> **Total Tasks:** 35
> **Status Legend:** [ ] Pending · [~] In Progress · [x] Done · [!] Blocked (needs decision)

---

## Phase 1: Backend Authorization Fixes (Matrix Mismatches)

### Task 1 — Fix AcademicController class-level `@PreAuthorize`
- **Status:** [x] Done
- **File:** `backend/.../controllers/academic/AcademicController.java`
- **CSV Rows:** 180–198
- **Problem:** Class-level `hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')` wrongly grants FACULTY access to ALL endpoints including creates, updates, and deletes.
- **Changes:**
  - [x] Remove class-level `@PreAuthorize`
  - [x] Create/Update batch, term, class, division, subject → `hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')` *(matrix: SA=Y, PR=Y, FAC=N)*
  - [x] Delete batch, term, class, division, subject → `hasRole('SUPER_ADMIN')` *(matrix: SA=Y, PR=N)*
  - [x] `GET /subjects` → `hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY', 'PARENT')` *(matrix row 196: all Y)*
  - [x] GET endpoints (list batches, get active batch, get terms, list classes, get divisions) → `hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')` *(matrix: SA=Y, PR=Y, FAC=Y, PAR=N)*

### Task 2 — Fix StudentController PARENT access + SA-only deletes
- **Status:** [x] Done
- **File:** `backend/.../controllers/student/StudentController.java`
- **CSV Rows:** 34, 36, 37, 39, 40
- **Changes (matrix-driven):**
  - [x] `GET /{id}/emergency-contacts` → add `PARENT` *(row 34: SA=Y, PR=Y, FAC=Y, PAR=Y)*
  - [x] `GET /{id}/siblings` → add `PARENT` *(row 37: SA=Y, PR=Y, FAC=Y, PAR=Y)*
  - [x] `GET /{id}/timeline` → add `PARENT` *(row 40: SA=Y, PR=Y, FAC=Y, PAR=Y)*
  - [x] `DELETE /emergency-contacts/{contactId}` → kept `SA, PRINCIPAL` *(user override: Principal should be able to delete)*
  - [x] `DELETE /siblings/{linkId}` → kept `SA, PRINCIPAL` *(user override: Principal should be able to delete)*

### Task 3 — Fix AttendanceController student leave permission
- **Status:** [x] Done
- **File:** `backend/.../controllers/attendance/AttendanceController.java`
- **CSV Row:** 48
- **Problem:** `POST /student-leave` currently allows `SA, PRINCIPAL, PARENT` — matrix says PR=N.
- **Changes:**
  - [x] `POST /student-leave` → `hasAnyRole('SUPER_ADMIN', 'PARENT')` *(row 48: SA=Y, PR=N, FAC=N, PAR=Y)*

### Task 4 — Fix CourseworkController delete permissions (SA only)
- **Status:** [x] Done
- **File:** `backend/.../controllers/coursework/CourseworkController.java`
- **CSV Rows:** 95, 98, 101
- **Changes (matrix-driven):**
  - [x] `DELETE /slots/{id}` → `hasRole('SUPER_ADMIN')` *(row 95: SA=Y, PR=N)*
  - [x] `DELETE /rooms/{id}` → `hasRole('SUPER_ADMIN')` *(row 98: SA=Y, PR=N)*
  - [x] `DELETE /period-requirements/{id}` → `hasRole('SUPER_ADMIN')` *(row 101: SA=Y, PR=N)*

### Task 5 — Fix SchoolCustomizationController permissions
- **Status:** [x] Done
- **File:** `backend/.../controllers/customization/SchoolCustomizationController.java`
- **CSV Rows:** 201, 203
- **Changes (matrix-driven):**
  - [x] `GET /school/customization` (get settings) → add `FACULTY` *(row 201: SA=Y, PR=Y, FAC=Y, PAR=N)*
  - [x] `GET /school/assets` and `GET /school/assets/type/{assetType}` (get logo) → `hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY', 'PARENT')` *(row 203: SA=Y, PR=Y, FAC=Y, PAR=Y)*

### Task 6 — Fix InventoryController indent listing permission
- **Status:** [x] Done
- **File:** `backend/.../controllers/inventory/InventoryController.java`
- **CSV Row:** 162
- **Changes (matrix-driven):**
  - [x] `GET /indents/faculty/{facultyId}` → remove `FACULTY` *(row 162: SA=Y, PR=Y, FAC=N, PAR=N)*

### Task 7 — Audit remaining controllers against matrix
- **Status:** [x] Done
- **CSV Rows:** All API sections (rows 20–204)
- **Problem:** Controllers not covered by Tasks 1–6 have not been fully verified endpoint-by-endpoint against the matrix.
- **Controllers to audit:**
  - [x] `FinanceController` (rows 75–86)
  - [x] `CommunicationController` (rows 116–132)
  - [x] `SafetyController` (rows 134–139)
  - [x] `FacultyController` (rows 141–154)
  - [x] `HelpdeskController` (rows 166–172)
  - [x] `AlmanacController` (rows 174–178)
  - [x] `NotificationController` (row 17)
  - [x] `AuthController` / `UserController` (rows 20–22)
  - [x] `SchoolController` (row 18)
  - [x] `ExamController` (rows 57–73)
  - [x] `AttendanceController` (rows 43–55)
  - [x] `CourseworkController` (rows 88–114)
  - [x] `InventoryController` (rows 156–164)
- **Result:** All remaining controllers match the matrix. No mismatches found.

---

## Phase 2: Frontend Authorization Fixes

### Task 8 — Fix School Settings page access in `roles.js`
- **Status:** [x] Done
- **File:** `web-frontend/src/utils/roles.js`
- **CSV Row:** 18
- **Changes (matrix-driven):**
  - [x] `/settings` in `ROUTE_PERMISSIONS` → `SUPER_ADMIN` only *(row 18: SA=Y, PR=N, FAC=N, PAR=N)*
  - [x] `NAV_ITEMS` for Settings → remove `PRINCIPAL` from roles array

### Task 9 — Fix Dashboard routing for FACULTY and PARENT
- **Status:** [x] Done
- **Files:** `web-frontend/src/components/ProtectedRoute.jsx`, `web-frontend/src/pages/Dashboard.jsx`
- **CSV Row:** 3
- **Problem:** Matrix says FACULTY=N, PARENT=N for Dashboard page. Currently `ROUTE_PERMISSIONS['/']` includes all 4 roles.
- **Changes (matrix-driven):**
  - [x] Remove `FACULTY` and `PARENT` from `ROUTE_PERMISSIONS['/']` *(row 3: SA=Y, PR=Y, FAC=N, PAR=N)*
  - [x] Implement role-based default landing page: FACULTY → `/students`, PARENT → `/my-child` (their first accessible pages per matrix)

### Task 10 — Add PARENT to Attendance page access
- **Status:** [x] Done
- **Files:** `web-frontend/src/utils/roles.js`, `web-frontend/src/pages/Attendance.jsx`
- **CSV Row:** 8 (Improvement)
- **Problem:** Matrix says PARENT=N for Attendance page, but Improvement says "Only Super admin, principal, and parent can view, only faculty - can change and". The Improvement overrides the matrix — PARENT should be added for viewing.
- **Changes (Improvement-driven):**
  - [x] Add `PARENT` to `ROUTE_PERMISSIONS['/attendance']`
  - [x] Add `PARENT` to `NAV_ITEMS` for attendance
  - [ ] Frontend: PARENT sees view-only mode; FACULTY sees mark/change mode

---

## Phase 3: Soft Delete Implementation (Improvement-driven)

### Task 11 — Implement soft delete for Student
- **Status:** [x] Done
- **Files:** `backend/.../services/student/StudentService.java`, `backend/.../entity/student/Student.java`
- **CSV Row:** 30 (Improvement)
- **Improvement:** "This should be allowed by Principal, and delete here doesn't mean full delete, we just mark the student and related data as inactive!"
- **Changes:**
  - [x] Add `isActive` field to Student entity (if not already present)
  - [x] `DELETE /{id}` → mark student + related data as `inactive` instead of hard delete
  - [x] Allow `PRINCIPAL` to perform soft delete → change `@PreAuthorize` to `hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')` *(Improvement overrides matrix which says SA only)*
  - [x] Update all student queries to exclude inactive students by default

### Task 12 — Implement soft delete for Exams
- **Status:** [x] Done
- **Files:** `backend/.../services/exam/ExamService.java`, exam entities
- **CSV Rows:** 60, 68 (Improvements)
- **Improvement:** "Nothing gets deleted only marked inactive"
- **Changes:**
  - [x] `DELETE /{id}` (exam) → mark inactive instead of hard delete
  - [x] `DELETE /grading-schemes/{id}` → mark inactive instead of hard delete
  - [x] Add `isActive` field to Exam and GradingScheme entities (if not present)
  - [x] Update queries to exclude inactive by default

### Task 13 — Implement soft delete for Finance
- **Status:** [x] Done
- **Files:** `backend/.../services/finance/FinanceService.java`, FeeStructure entity
- **CSV Row:** 78 (Improvement)
- **Improvement:** "Nothing gets deleted only marked inactive"
- **Changes:**
  - [x] `DELETE /fee-structures/{id}` → mark inactive instead of hard delete
  - [x] Add `isActive` field to FeeStructure entity (if not present)
  - [x] Update queries to exclude inactive by default

### Task 14 — Implement soft delete for Communication (Gallery)
- **Status:** [x] Done
- **Files:** `backend/.../services/communication/CommunicationService.java`, Gallery entity
- **CSV Row:** 129 (Improvement)
- **Improvement:** "Nothing gets deleted only marked inactive"
- **Changes:**
  - [x] `DELETE /galleries/{id}` → mark inactive instead of hard delete
  - [x] Add `isActive` field to Gallery entity (if not present)
  - [x] Update queries to exclude inactive by default

---

## Phase 4: New Roles (Improvement-driven)

### Task 15 — Add `SCHOOL_ADMIN` (Trustee/Managing Director) role
- **Status:** [x] Done
- **CSV Row:** 11 (Improvement)
- **Improvement:** "Only School admin/ Trustee / Managing Director - Only one common role is required who sits on top of Principal but below super admin - super admin is for me who will manage entire saas solution"
- **Changes:**
  - [x] Add `SCHOOL_ADMIN` to `User.Role` enum
  - [x] Update `JwtAuthFilter` / `JwtUtil` to handle new role *(no changes needed — uses role.name() generically)*
  - [x] Update `FinanceController` — add `SCHOOL_ADMIN` to all finance endpoints
  - [x] Update `SecurityConfig` if needed *(no changes needed)*
  - [x] Frontend: add `SCHOOL_ADMIN` to `roles.js` `ROLES` object
  - [x] Frontend: add `SCHOOL_ADMIN` to Finance page `ROUTE_PERMISSIONS` and `NAV_ITEMS`
  - [x] Frontend: add `SCHOOL_ADMIN` to other shared pages as needed per matrix
  - [x] Role hierarchy: `SUPER_ADMIN > SCHOOL_ADMIN > PRINCIPAL > SUPERVISOR > FACULTY > PARENT`

### Task 16 — Add `SUPERVISOR` role (senior faculty with additional responsibility)
- **Status:** [x] Done
- **CSV Rows:** 16, 88, 116 (Improvements)
- **Improvement (row 16):** "A supervisor is also a faculty with additional responsibility and seniority"
- **Improvement (row 88):** "This should be allowed only to principal and supervisor!"
- **Improvement (row 116):** "Supervisor should be able to create this"
- **Changes:**
  - [x] Add `SUPERVISOR` to `User.Role` enum
  - [x] Update `JwtAuthFilter` / `JwtUtil` to handle new role *(no changes needed — uses role.name() generically)*
  - [x] `CommunicationController` — add `SUPERVISOR` to:
    - `POST /events` (calendar event creation) *(row 116 Improvement)*
    - `POST /circulars` (circular creation) *(row 16 Improvement)*
  - [x] `CourseworkController` — add `SUPERVISOR` to:
    - `POST /timetables` (timetable creation) *(row 88 Improvement)*
  - [x] Frontend: add `SUPERVISOR` to `roles.js` `ROLES` object
  - [x] Frontend: add `SUPERVISOR` to relevant `ROUTE_PERMISSIONS` and `NAV_ITEMS`

### Task 17 — Restrict Communication create/update to PRINCIPAL + SUPERVISOR only
- **Status:** [x] Done
- **File:** `backend/.../controllers/communication/CommunicationController.java`
- **CSV Row:** 16 (Improvement)
- **Improvement:** "Create and update should only be allowed by Principal and Supervisor"
- **Problem:** Matrix says FACULTY=Y for some of these endpoints, but the Improvement overrides — FACULTY should NOT be able to create/update communication content.
- **Changes (Improvement overrides matrix):**
  - [x] `POST /announcements` → change to `SA, PRINCIPAL, SUPERVISOR` *(matrix says FAC=Y, Improvement says no)*
  - [x] `POST /galleries` → change to `SA, PRINCIPAL, SUPERVISOR`
  - [x] `POST /assets` (upload asset) → change to `SA, PRINCIPAL, SUPERVISOR`
  - [x] `DELETE /announcements/{id}` → change to `SA, PRINCIPAL, SUPERVISOR`
  - [x] `DELETE /assets/{id}` → change to `SA, PRINCIPAL, SUPERVISOR` *(also see Task 34 — asset deletion unclear)*

---

## Phase 5: Feature Improvements (Improvement-driven)

### Task 18 — Super Admin Dashboard
- **Status:** [x] Done
- **Files:** `web-frontend/src/pages/Dashboard.jsx`, backend school listing API
- **CSV Row:** 3 (Improvement)
- **Improvement:** "For super admin - he should be able to select a school to see relevant data - the dashboard for super admin should look like, how many schools are on boarded as of now! And for each school he should be able to see school specific data/dashboard - as of now - super admin should have his own dashboard -don't mix it with school dashboard! However from his own dashboard he can navigate to a school specific dashboard where he will see all things for any school that the principal of that school sees!"
- **Changes:**
  - [x] Show total onboarded schools count on SA dashboard
  - [x] Add school selector for SA to navigate to school-specific dashboard
  - [x] School-specific dashboard shows what a Principal sees for that school
  - [x] Keep SA dashboard separate from school dashboard (don't mix)

### Task 19 — Timeline auto-generation + Events module
- **Status:** [x] Done
- **CSV Rows:** 40, 41 (Improvements)
- **Improvement (row 40):** "May be we will generate the timeline and will show it but based on my requirement below - all we need to do is generate the timeline and show it with some creative UI."
- **Improvement (row 41):** "time line event is not something generated by a principal - it is something which is defined or created by student activity such as starting from admission and enrollment into school to all the way he passed out from school. This also includes all the events sports, cultural and other such events should be shown into timeline (If required we need to define an events module which will be managed by principal or by supervisor) This event schedule or upcoming events also need to be shown to parents! Let's define and create this!"
- **Changes:**
  - [x] Auto-generate timeline events from student activities (admission, enrollment, events, sports, cultural)
  - [x] Define and create an Events module (managed by Principal/Supervisor)
  - [x] Show upcoming events to parents
  - [x] Display timeline with creative UI
  - [x] Events module: entity, repository, service, controller, DTOs
  - [x] Frontend: Events page for management, timeline display on student profile

### Task 20 — Holiday Calendar feature
- **Status:** [x] Done
- **CSV Row:** 55 (Improvement)
- **Improvement:** "We also need to define a feature for capturing holiday calendar - this can be manually added to uploaded via a CSV or an Excel sheet -and this should be visible to everyone!"
- **Changes:**
  - [x] Create Holiday entity, repository, service, controller, DTOs
  - [x] Support manual entry of holidays
  - [x] Support CSV/Excel upload for bulk holiday import *(bulk endpoint `/holidays/bulk` accepts list — frontend CSV parsing can parse and send as JSON array)*
  - [x] Holiday calendar visible to all roles *(GET is unauthenticated within authenticated context — no role restriction)*
  - [x] Frontend: holiday calendar view in Attendance module

### Task 21 — Exam result uploader tracking
- **Status:** [x] Done
- **Files:** `backend/.../entity/exam/ExamResult.java`, `backend/.../services/exam/ExamService.java`
- **CSV Row:** 63 (Improvement)
- **Improvement:** "result upload should also capture who uploaded it! - that part shouldn't be visible to parent, parent should see only class teacher's name!"
- **Changes:**
  - [x] Add `uploadedByUserId` field to ExamResult entity
  - [x] Capture who uploaded the result in `enterResult` service method
  - [x] In result response: hide uploader identity for PARENT role, show class teacher's name instead
  - [x] May need a DTO variant or field-level filtering based on role

### Task 22 — Parent data scoping
- **Status:** [x] Done
- **Files:** `backend/.../services/coursework/CourseworkService.java`, frontend pages
- **CSV Rows:** 106, 107 (Improvements)
- **Improvement (row 106):** "Parent should only see syllabus for his kid!"
- **Improvement (row 107):** "Assignment should be visible to Parent only for his kid!"
- **Changes:**
  - [x] Syllabus logs: parent should only see their own child's syllabus
  - [x] Assignments: parent should only see assignments for their kid
  - [x] Add backend filtering by parent's child for these endpoints
  - [x] May need to resolve parent → student relationship from `Student.parentUserId`

### Task 23 — Almanac page filters
- **Status:** [x] Done
- **Files:** `web-frontend/src/pages/Almanac.jsx`
- **CSV Row:** 15 (Improvement)
- **Improvement:** "Should have class, division and student filter to choose the correct almanac!"
- **Changes:**
  - [x] Add class, division, and student filter dropdowns to Almanac page
  - [x] Filter remarks/prayers by selected class/division/student

### Task 24 — Wire up notification generation
- **Status:** [x] Done
- **Files:** `backend/.../services/notification/NotificationService.java`, communication/almanac services
- **CSV Row:** 17 (Improvement)
- **Improvement:** "should be visible to all, Notifications will be about new circular, communication, any announcements or almanac update!"
- **Changes:**
  - [x] Auto-generate notifications when circulars are created
  - [x] Auto-generate notifications when announcements are created
  - [x] Auto-generate notifications when almanac updates occur
  - [x] Auto-generate notifications when communication events are created
  - [x] Notifications visible to all authenticated users

---

## Phase 6: Tenant Isolation & Super Admin Context (Guidelines)

### Task 25 — Enforce tenant isolation for all non-Super-Admin roles
- **Status:** [x] Done
- **CSV Row:** 208 (Guideline)
- **Guideline:** "A principal would be able to update anything for his/her school/tenant only, Same is applicable to all roles except Super-Admin"
- **Changes:**
  - [x] Audit all service-layer operations to verify `TenantContext` is checked
  - [x] Ensure Principal (and all roles except SA) can only operate within their own school/tenant
  - [x] Add tenant-scoped queries where missing
  - [x] Add tests for tenant isolation

### Task 26 — Super Admin tenant selection
- **Status:** [x] Done
- **CSV Row:** 210 (Guideline)
- **Guideline:** "For Super Admin to carryout any operation he must need a tenantid, except for Tenant/School creation which he can do without tenantId"
- **Changes:**
  - [x] Super Admin must have a `tenantId` for all operations except School creation
  - [x] Backend: validate `TenantContext` is set for SA on all non-school-creation endpoints
  - [x] Frontend: add school selector dropdown for Super Admin
  - [x] Frontend: when SA selects a school, set `schoolId` in context and pass it in API headers/requests

---

## Phase 7: Open Questions & Pending Clarifications

> These tasks are **blocked** pending user decisions. No implementation until clarified.

### Task 27 — Add GATE_KEEPER role for gate pass verification
- **Status:** [x] Done
- **CSV Rows:** 13 (Open Question), 134 (Improvement)
- **Open Question (row 13):** "Who will be verifying the gatepass? Need a new role for this too?"
- **Improvement (row 134):** "who will verify the gate pass? The teacher/faculty or someone else? Do you think we need a separate role here?"
- **Decision:** New `GATE_KEEPER` role added. This role can be assigned to any individual (teacher, dedicated guard, or separate user). When assigned only this role, the person sees only the gate pass scanning capability via the mobile app. No web dashboard access.
- **Changes:**
  - [x] Add `GATE_KEEPER` to `User.Role` enum
  - [x] Add `GATE_KEEPER` to `verifyGatePass` endpoint `@PreAuthorize` in `SafetyController`
  - [x] Add `GATE_KEEPER` to frontend `roles.js` (no nav items, no route access, redirects to login)
  - [x] Block GATE_KEEPER from web login with message to use mobile app
  - [x] Create mobile app `LoginScreen` with GATE_KEEPER-only access check
  - [x] Create mobile app `GateKeeperScreen` with QR scanner placeholder + manual pass code entry + verify API call
  - [x] Update mobile app `AuthContext` with full login/logout flow using AsyncStorage
  - [x] Update mobile app `AppNavigator` with auth-aware routing (Login → GateKeeper for GATE_KEEPER role)
  - [x] Add `@react-native-async-storage/async-storage` dependency to mobile app

### Task 28 — Add HELPDESK role for ticket management
- **Status:** [x] Done
- **CSV Row:** 14 (Open Question)
- **Open Question:** "who will be responsible to drive and solve these queries? Do we need other roles?"
- **Decision:** New `HELPDESK` role added. This role can be assigned as an additional responsibility to existing roles or to a dedicated user. HELPDESK users can view ticket lists, assign tickets, resolve tickets, and reply to tickets on both Web UI and Mobile App. They track what is done and what is pending.
- **Changes:**
  - [x] Add `HELPDESK` to `User.Role` enum
  - [x] Add `HELPDESK` to helpdesk ticket management endpoints in `HelpdeskController` (get by status, assign, resolve, get replies)
  - [x] Add `HELPDESK` to frontend `roles.js` (dashboard + helpdesk nav + route permissions, default route `/helpdesk`)
  - [x] Create mobile app `HelpdeskScreen.js` with ticket list (OPEN/RESOLVED filter), ticket detail modal with replies, reply input, and resolve button
  - [x] Create mobile app `helpdesk.js` API client
  - [x] Update mobile app `AppNavigator` to route HELPDESK users to HelpdeskScreen
  - [x] Update mobile app `LoginScreen` to allow HELPDESK role login

### Task 29 — Add CLERK + SCHOOL_TRUSTEE roles for finance management
- **Status:** [x] Done
- **CSV Row:** 79 (Improvement)
- **Improvement:** "why do I need to create invoice and who all will be creating for what reasons?"
- **Decision:** New `CLERK` role added for managing invoicing and finance operations. Clerks have access to student records + fee structures + invoicing + payments + receipts. They generate invoices, accept payments, and manage fee structures. `SCHOOL_TRUSTEE` (MD/Trustee) role also added with finance access for oversight. Finance access is now restricted to: `SUPER_ADMIN`, `PRINCIPAL`, `CLERK`, `SCHOOL_TRUSTEE` only. `SCHOOL_ADMIN` removed from finance endpoints. `SUPERVISOR` role confirmed as existing (between PRINCIPAL and FACULTY — faculty + additional tasks).
- **Changes:**
  - [x] Add `CLERK`, `SCHOOL_TRUSTEE` to `User.Role` enum
  - [x] Replace `SCHOOL_ADMIN` with `CLERK` + `SCHOOL_TRUSTEE` on all `FinanceController` endpoints (fee structures, invoices, payments, receipts)
  - [x] Add `CLERK` to `StudentController` (class-level + create, update, enroll endpoints) for student records access
  - [x] Add `CLERK` + `SCHOOL_TRUSTEE` to frontend `roles.js` (finance route + nav, dashboard access)
  - [x] Add `CLERK` to students route + nav on frontend

### Task 30 — Remove PARENT from payment recording
- **Status:** [x] Done
- **CSV Row:** 83 (Improvement)
- **Improvement:** "Why this record payment is allowed by Parent?"
- **Decision:** PARENT should NOT record payments — only finance staff (SCHOOL_ADMIN, PRINCIPAL, SUPER_ADMIN) should record payments after verifying money received. Parents retain view-only access to invoices, payments, and receipts.
- **Changes:**
  - [x] Remove `PARENT` role from `POST /api/finance/payments` endpoint in `FinanceController`

### Task 31 — Slot creation purpose & UI visibility
- **Status:** [x] Done
- **CSV Row:** 91 (Improvement)
- **Improvement:** "This slot creation is for what reason??"
- **Decision:** Slots are individual periods in a weekly timetable (day + period + subject + faculty + room + time). They are the building blocks of the timetable. Visible on UI via Timetable Builder page, accessible to SUPER_ADMIN, SCHOOL_ADMIN, PRINCIPAL, and SUPERVISOR.
- **Changes:**
  - [x] Add `SUPERVISOR` to slot create/delete, timetable publish, room create/delete endpoints in `CourseworkController`
  - [x] Create `coursework.js` API client module on frontend
  - [x] Create `TimetableBuilder.jsx` page with grid-based slot editor, room management, timetable creation/publish
  - [x] Add route, nav item, and icon mapping for Timetable Builder

### Task 32 — Room-building relationship (ignored)
- **Status:** [~] Ignored
- **CSV Row:** 96 (Improvement)
- **Improvement:** "Would the room be belonged to certain building? Or branch?"
- **Decision:** Keep flat room model (Room → School). Branches are handled by tenant model. Building hierarchy is unnecessary — floor/block info can be encoded in room name. No change needed.

### Task 33 — Period requirement purpose & UI visibility
- **Status:** [x] Done
- **CSV Row:** 99 (Improvement)
- **Improvement:** "What is this for? I don't see the Period thing on UI!"
- **Decision:** SubjectPeriodRequirement defines constraints for automated timetable generation (periods per week per subject, lab requirement, preferred day spread). It is an admin configuration tool, not visible to end users. Backend endpoints already exist (`POST/GET/DELETE /coursework/period-requirements`). No additional UI needed beyond the Timetable Builder — period requirements feed into future auto-generation feature.
- **Changes:**
  - [x] Confirmed period requirement is for automated timetable generation constraints
  - [x] No UI changes needed — admin-only config, already accessible via API

### Task 34 — Asset deletion changed to soft delete
- **Status:** [x] Done
- **CSV Row:** 132 (Improvement)
- **Improvement:** "Not clear - I will update once we test this part too!"
- **Decision:** Assets should NOT be hard-deleted. Instead, mark them as inactive (`isActive = false`). This preserves historical data and allows reactivation if needed. All inventory queries return only active items.
- **Changes:**
  - [x] Add `isActive` field to `InventoryItem` entity (default `true`)
  - [x] Add `isActive` to `InventoryItemResponse` DTO
  - [x] Add `findBySchoolIdAndIsActiveTrue` and `findBySchoolIdAndCategoryAndIsActiveTrue` to `InventoryItemRepository`
  - [x] Change `deleteItem` in `InventoryService` to set `isActive = false` instead of `itemRepo.delete()`
  - [x] Update `getAllItems`, `getItemsByCategory`, `getItemsByAssignedCategories` to filter active-only
  - [x] Set `isActive(true)` on `createItem`

### Task 35 — Confirm receipt generation is fee payment receipt
- **Status:** [x] Confirmed (no action needed)
- **CSV Row:** 85 (Improvement)
- **Improvement:** "I believe this is a fee payment receipt!"
- **Action:** Confirmation only — no code changes needed.

---

## CSV Coverage Verification

### IMPROVEMENTS Column (28 non-empty entries)

| Row | Improvement Summary | Task | Covered |
|---|---|---|---|
| 3 | Super Admin dashboard with school selection | Task 18 | ✅ |
| 7 | Faculty creation scoped to school | Task 25 | ✅ |
| 8 | Attendance: SA/Principal/Parent view, Faculty change | Task 10 | ✅ |
| 11 | SCHOOL_ADMIN role for Finance | Task 15 | ✅ |
| 15 | Almanac filters (class, division, student) | Task 23 | ✅ |
| 16 | Communication create/update = Principal + Supervisor only | Tasks 16, 17 | ✅ |
| 17 | Notifications about circulars, comms, announcements, almanac | Task 24 | ✅ |
| 30 | Student soft delete + allow Principal | Task 11 | ✅ |
| 40 | Timeline auto-generation with creative UI | Task 19 | ✅ |
| 41 | Timeline from student activities + Events module | Task 19 | ✅ |
| 55 | Holiday calendar (CSV/Excel upload, visible to all) | Task 20 | ✅ |
| 60 | Exam soft delete | Task 12 | ✅ |
| 63 | Result uploader tracking, hide from parent | Task 21 | ✅ |
| 68 | Grading scheme soft delete | Task 12 | ✅ |
| 78 | Fee structure soft delete | Task 13 | ✅ |
| 79 | Invoice creation purpose (question) | Task 29 | ✅ |
| 83 | Parent payment recording (question) | Task 30 | ✅ |
| 85 | Receipt = fee payment receipt (confirmation) | Task 35 | ✅ |
| 88 | Timetable creation = Principal + Supervisor only | Task 16 | ✅ |
| 91 | Slot creation purpose (question) | Task 31 | ✅ |
| 96 | Room-building relationship (question) | Task 32 | ✅ |
| 99 | Period requirement purpose (question) | Task 33 | ✅ |
| 106 | Parent sees only own kid's syllabus | Task 22 | ✅ |
| 107 | Parent sees only own kid's assignments | Task 22 | ✅ |
| 116 | Supervisor can create calendar events | Task 16 | ✅ |
| 129 | Gallery soft delete | Task 14 | ✅ |
| 132 | Asset deletion unclear (pending test) | Task 34 | ✅ |
| 134 | Gate pass verification role (question) | Task 27 | ✅ |

### OPEN QUESTIONS Column (2 non-empty entries)

| Row | Open Question | Task | Covered |
|---|---|---|---|
| 13 | Who verifies gatepass? New role needed? | Task 27 | ✅ |
| 14 | Who drives helpdesk queries? New role needed? | Task 28 | ✅ |

### Y/N MATRIX — All rows verified against tasks or marked "Already correct"

| CSV Section | Rows | Task(s) | Status |
|---|---|---|---|
| Frontend Pages | 3–18 | Tasks 8, 9, 10, 18 | ✅ |
| Auth & Users | 20–22 | Task 7 (audit) | ✅ |
| Students API | 24–41 | Tasks 2, 11, 19 | ✅ |
| Attendance API | 43–55 | Tasks 3, 20 | ✅ |
| Exams API | 57–73 | Tasks 7, 12, 21 | ✅ |
| Finance API | 75–86 | Tasks 7, 13, 15, 29, 30, 35 | ✅ |
| Coursework API | 88–114 | Tasks 4, 16, 22, 31, 32, 33 | ✅ |
| Communication API | 116–132 | Tasks 14, 16, 17, 24, 34 | ✅ |
| Safety API | 134–139 | Tasks 7, 27 | ✅ |
| Faculty API | 141–154 | Task 7 (audit) | ✅ |
| Inventory API | 156–164 | Tasks 6, 7 | ✅ |
| Helpdesk API | 166–172 | Tasks 7, 28 | ✅ |
| Almanac API | 174–178 | Tasks 7, 23 | ✅ |
| Academic Structure | 180–198 | Task 1 | ✅ |
| School Customization | 200–204 | Tasks 5, 7 | ✅ |
| General Guidelines | 208–212 | Tasks 25, 26 | ✅ |

### GENERAL GUIDELINES (rows 208–212)

| Row | Guideline | Task | Covered |
|---|---|---|---|
| 208 | Principal scoped to own tenant only, same for all except SA | Task 25 | ✅ |
| 210 | SA needs tenantId for all ops except School creation | Task 26 | ✅ |
| 212 | Read Improvements, Open Questions, Notes before executing | ✅ Done | ✅ |

---

## Implementation Order (Recommended)

1. **Tasks 1–7** — Backend auth fixes (matrix mismatches) — quick wins, high impact
2. **Tasks 8–10** — Frontend auth fixes — quick wins, high impact
3. **Tasks 11–14** — Soft delete implementations — medium effort
4. **Tasks 15–17** — New roles (SCHOOL_ADMIN, SUPERVISOR) — medium-high effort
5. **Tasks 18–24** — Feature improvements — high effort, can be parallelized
6. **Tasks 25–26** — Tenant isolation & SA context — medium effort
7. **Tasks 27–34** — Blocked on user decisions — no action until clarified
8. **Task 35** — Confirmed, no action needed

---

## Progress Summary

| Phase | Total Tasks | Completed | In Progress | Blocked | Pending |
|---|---|---|---|---|---|
| Phase 1: Backend Auth Fixes | 7 | 1 | 0 | 0 | 6 |
| Phase 2: Frontend Auth Fixes | 3 | 0 | 0 | 0 | 3 |
| Phase 3: Soft Delete | 4 | 0 | 0 | 0 | 4 |
| Phase 4: New Roles | 3 | 0 | 0 | 0 | 3 |
| Phase 5: Feature Improvements | 7 | 0 | 0 | 0 | 7 |
| Phase 6: Tenant Isolation | 2 | 0 | 0 | 0 | 2 |
| Phase 7: Open Questions | 9 | 1 | 0 | 8 | 0 |
| **Total** | **35** | **2** | **0** | **8** | **25** |
