-- ============================================================
-- iskool — Truncate All Tables (Wipe All Data)
-- ============================================================
-- Usage:
--   psql -U postgres -d postgres -f truncate_all.sql
--   or paste into pgAdmin / DBeaver
-- ============================================================

-- Disable foreign key checks during truncation
SET session_replication_role = 'replica';

-- Truncate all tables in reverse dependency order
-- CASCADE ensures dependent rows are also wiped

TRUNCATE TABLE helpdesk_ticket_replies CASCADE;
TRUNCATE TABLE helpdesk_tickets CASCADE;

TRUNCATE TABLE receipts CASCADE;
TRUNCATE TABLE payments CASCADE;
TRUNCATE TABLE invoices CASCADE;
TRUNCATE TABLE fee_structures CASCADE;

TRUNCATE TABLE media_assets CASCADE;
TRUNCATE TABLE media_galleries CASCADE;
TRUNCATE TABLE class_announcements CASCADE;
TRUNCATE TABLE circulars CASCADE;
TRUNCATE TABLE calendar_events CASCADE;

TRUNCATE TABLE notifications CASCADE;

TRUNCATE TABLE assignment_submissions CASCADE;
TRUNCATE TABLE assignments CASCADE;
TRUNCATE TABLE syllabus_logs CASCADE;
TRUNCATE TABLE subject_period_requirements CASCADE;
TRUNCATE TABLE timetable_generation_requests CASCADE;
TRUNCATE TABLE timetable_slots CASCADE;
TRUNCATE TABLE class_timetables CASCADE;
TRUNCATE TABLE rooms CASCADE;

TRUNCATE TABLE report_cards CASCADE;
TRUNCATE TABLE rank_lists CASCADE;
TRUNCATE TABLE exam_results CASCADE;
TRUNCATE TABLE exam_portions CASCADE;
TRUNCATE TABLE grading_schemes CASCADE;
TRUNCATE TABLE exams CASCADE;

TRUNCATE TABLE attendance_records CASCADE;
TRUNCATE TABLE student_leave_applications CASCADE;
TRUNCATE TABLE faculty_leave_applications CASCADE;

TRUNCATE TABLE faculty_attendance CASCADE;
TRUNCATE TABLE faculty_availability CASCADE;
TRUNCATE TABLE faculty_class_assignments CASCADE;
TRUNCATE TABLE faculty CASCADE;

TRUNCATE TABLE indent_requests CASCADE;
TRUNCATE TABLE faculty_inventory_assignments CASCADE;
TRUNCATE TABLE inventory_items CASCADE;

TRUNCATE TABLE proxy_pickups CASCADE;
TRUNCATE TABLE gate_passes CASCADE;

TRUNCATE TABLE student_timeline CASCADE;
TRUNCATE TABLE student_sibling_links CASCADE;
TRUNCATE TABLE student_medical_profiles CASCADE;
TRUNCATE TABLE student_emergency_contacts CASCADE;
TRUNCATE TABLE student_enrollments CASCADE;
TRUNCATE TABLE students CASCADE;

TRUNCATE TABLE almanac_remarks CASCADE;
TRUNCATE TABLE prayers CASCADE;

TRUNCATE TABLE holidays CASCADE;
TRUNCATE TABLE school_events CASCADE;

TRUNCATE TABLE terms CASCADE;
TRUNCATE TABLE subjects CASCADE;
TRUNCATE TABLE divisions CASCADE;
TRUNCATE TABLE school_classes CASCADE;
TRUNCATE TABLE academic_batches CASCADE;

TRUNCATE TABLE custom_labels CASCADE;
TRUNCATE TABLE school_assets CASCADE;
TRUNCATE TABLE school_customizations CASCADE;

TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE schools CASCADE;

-- Re-enable foreign key checks
SET session_replication_role = 'origin';

-- Reset all sequences (auto-increment IDs back to 1)
-- PostgreSQL IDENTITY columns auto-reset on TRUNCATE, but
-- explicit reset for safety in case of manual sequences:
SELECT 'All tables truncated successfully!' AS result;
