-- ============================================================
-- Fresh Integration: Drop all iskool tables and reset Liquibase
-- Run this in Supabase SQL Editor or pgAdmin before starting app
-- ============================================================

-- Drop tables if they exist (reverse dependency order)
DROP TABLE IF EXISTS almanac_remarks CASCADE;
DROP TABLE IF EXISTS prayers CASCADE;
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS faculty_leave_applications CASCADE;
DROP TABLE IF EXISTS student_leave_applications CASCADE;
DROP TABLE IF EXISTS calendar_events CASCADE;
DROP TABLE IF EXISTS circulars CASCADE;
DROP TABLE IF EXISTS class_announcements CASCADE;
DROP TABLE IF EXISTS media_assets CASCADE;
DROP TABLE IF EXISTS media_galleries CASCADE;
DROP TABLE IF EXISTS assignment_submissions CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS class_timetables CASCADE;
DROP TABLE IF EXISTS faculty_availability CASCADE;
DROP TABLE IF EXISTS faculty_attendance CASCADE;
DROP TABLE IF EXISTS faculty_class_assignments CASCADE;
DROP TABLE IF EXISTS faculty CASCADE;
DROP TABLE IF EXISTS rank_lists CASCADE;
DROP TABLE IF EXISTS exam_results CASCADE;
DROP TABLE IF EXISTS exam_portions CASCADE;
DROP TABLE IF EXISTS exams CASCADE;
DROP TABLE IF EXISTS grading_schemes CASCADE;
DROP TABLE IF EXISTS report_cards CASCADE;
DROP TABLE IF EXISTS helpdesk_ticket_replies CASCADE;
DROP TABLE IF EXISTS helpdesk_tickets CASCADE;
DROP TABLE IF EXISTS indent_requests CASCADE;
DROP TABLE IF EXISTS inventory_items CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS receipts CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS fee_structures CASCADE;
DROP TABLE IF EXISTS gate_passes CASCADE;
DROP TABLE IF EXISTS proxy_pickups CASCADE;
DROP TABLE IF EXISTS school_assets CASCADE;
DROP TABLE IF EXISTS custom_labels CASCADE;
DROP TABLE IF EXISTS school_customizations CASCADE;
DROP TABLE IF EXISTS student_enrollments CASCADE;
DROP TABLE IF EXISTS student_emergency_contacts CASCADE;
DROP TABLE IF EXISTS student_medical_profiles CASCADE;
DROP TABLE IF EXISTS student_sibling_links CASCADE;
DROP TABLE IF EXISTS student_timeline CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS syllabus_logs CASCADE;
DROP TABLE IF EXISTS timetable_generation_requests CASCADE;
DROP TABLE IF EXISTS timetable_slots CASCADE;
DROP TABLE IF EXISTS subject_period_requirements CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS terms CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS divisions CASCADE;
DROP TABLE IF EXISTS academic_batches CASCADE;
DROP TABLE IF EXISTS school_classes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS schools CASCADE;

-- Clear Liquibase tracking tables (Liquibase will recreate these)
DROP TABLE IF EXISTS databasechangelog CASCADE;
DROP TABLE IF EXISTS databasechangeloglock CASCADE;

-- Done! Now start the Spring Boot app to get a completely fresh schema.
