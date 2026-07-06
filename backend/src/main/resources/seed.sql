    -- ============================================================
    -- iskool Seed Data: Dummy School + Users + Student + Academic
    -- Password for ALL users: abc@123
    -- BCrypt hash: $2b$10$eWv8P.wyeezqBisYs2ypEOUITamlCTwkWhy9vc1QG.Na3XAEtz/Iy
    -- ============================================================
    -- Run: psql -U iskool -d iskool -f seed.sql
    --   or paste into pgAdmin / DBeaver
    -- ============================================================

    -- Clean up existing seed data (reverse dependency order)
    DELETE FROM student_enrollments WHERE student_id IN (SELECT id FROM students WHERE school_id IN (SELECT id FROM schools WHERE subdomain = 'greenwood'));
    DELETE FROM students WHERE school_id IN (SELECT id FROM schools WHERE subdomain = 'greenwood');
    DELETE FROM users WHERE email LIKE '%@greenwood.edu';
    DELETE FROM academic_batches WHERE school_id IN (SELECT id FROM schools WHERE subdomain = 'greenwood');
    DELETE FROM divisions WHERE school_id IN (SELECT id FROM schools WHERE subdomain = 'greenwood');
    DELETE FROM school_classes WHERE school_id IN (SELECT id FROM schools WHERE subdomain = 'greenwood');
    DELETE FROM schools WHERE subdomain = 'greenwood';

    -- ============================================================
    -- Insert School + Academic + Users + Student
    -- ============================================================
    DO $$
    DECLARE
        school_id_val BIGINT;
        parent_user_id_val BIGINT;
        batch_id_val BIGINT;
        class_id_val BIGINT;
        division_id_val BIGINT;
        student_id_val BIGINT;
        bcrypt_hash   TEXT := '$2b$10$eWv8P.wyeezqBisYs2ypEOUITamlCTwkWhy9vc1QG.Na3XAEtz/Iy';
    BEGIN
        -- 1. Insert School
        INSERT INTO schools (name, logo_url, subdomain, primary_color, secondary_color, affiliation_id, address, contact_email, contact_phone, created_at, updated_at)
        VALUES (
            'Greenwood International School',
            NULL,
            'greenwood',
            '#4f46e5',
            '#7c3aed',
            'CBSE-AFF-12345',
            '123 Education Lane, Green Valley, City - 560001',
            'info@greenwood.edu',
            '+91-9876543210',
            NOW(),
            NOW()
        )
        RETURNING id INTO school_id_val;

        -- 2. Insert Academic Structure
        INSERT INTO school_classes (school_id, name, level, created_at, updated_at)
        VALUES (school_id_val, 'Grade 5', 5, NOW(), NOW())
        RETURNING id INTO class_id_val;

        INSERT INTO academic_batches (school_id, name, start_date, end_date, is_active, created_at, updated_at)
        VALUES (school_id_val, '2024-2025', '2024-04-01', '2025-03-31', true, NOW(), NOW())
        RETURNING id INTO batch_id_val;

        INSERT INTO divisions (school_id, class_id, name, created_at, updated_at)
        VALUES (school_id_val, class_id_val, 'A', NOW(), NOW())
        RETURNING id INTO division_id_val;

        -- 3. Insert Users (one per role)
        INSERT INTO users (school_id, email, password_hash, full_name, role, mobile_number, is_active, created_at, updated_at)
        VALUES (school_id_val, 'superadmin@greenwood.edu', bcrypt_hash, 'Super Admin', 'SUPER_ADMIN', '+91-9000000001', true, NOW(), NOW());

        INSERT INTO users (school_id, email, password_hash, full_name, role, mobile_number, is_active, created_at, updated_at)
        VALUES (school_id_val, 'schooladmin@greenwood.edu', bcrypt_hash, 'School Admin', 'SCHOOL_ADMIN', '+91-9000000011', true, NOW(), NOW());

        INSERT INTO users (school_id, email, password_hash, full_name, role, mobile_number, is_active, created_at, updated_at)
        VALUES (school_id_val, 'trustee@greenwood.edu', bcrypt_hash, 'Mr. Ramesh Gupta', 'SCHOOL_TRUSTEE', '+91-9000000012', true, NOW(), NOW());

        INSERT INTO users (school_id, email, password_hash, full_name, role, mobile_number, is_active, created_at, updated_at)
        VALUES (school_id_val, 'principal@greenwood.edu', bcrypt_hash, 'Dr. Anita Sharma', 'PRINCIPAL', '+91-9000000002', true, NOW(), NOW());

        INSERT INTO users (school_id, email, password_hash, full_name, role, mobile_number, is_active, created_at, updated_at)
        VALUES (school_id_val, 'supervisor@greenwood.edu', bcrypt_hash, 'Priya Nair', 'SUPERVISOR', '+91-9000000005', true, NOW(), NOW());

        INSERT INTO users (school_id, email, password_hash, full_name, role, mobile_number, is_active, created_at, updated_at)
        VALUES (school_id_val, 'clerk@greenwood.edu', bcrypt_hash, 'Meena Iyer', 'CLERK', '+91-9000000006', true, NOW(), NOW());

        INSERT INTO users (school_id, email, password_hash, full_name, role, mobile_number, is_active, created_at, updated_at)
        VALUES (school_id_val, 'helpdesk@greenwood.edu', bcrypt_hash, 'Vikram Singh', 'HELPDESK', '+91-9000000007', true, NOW(), NOW());

        INSERT INTO users (school_id, email, password_hash, full_name, role, mobile_number, is_active, created_at, updated_at)
        VALUES (school_id_val, 'faculty@greenwood.edu', bcrypt_hash, 'Rajesh Kumar', 'FACULTY', '+91-9000000003', true, NOW(), NOW());

        INSERT INTO users (school_id, email, password_hash, full_name, role, mobile_number, is_active, created_at, updated_at)
        VALUES (school_id_val, 'gatekeeper@greenwood.edu', bcrypt_hash, 'Suresh Patel', 'GATE_KEEPER', '+91-9000000008', true, NOW(), NOW());

        INSERT INTO users (school_id, email, password_hash, full_name, role, mobile_number, is_active, created_at, updated_at)
        VALUES (school_id_val, 'parent@greenwood.edu', bcrypt_hash, 'Suresh Verma', 'PARENT', '+91-9000000004', true, NOW(), NOW())
        RETURNING id INTO parent_user_id_val;

        -- 4. Insert Student linked to Parent
        INSERT INTO students (school_id, first_name, last_name, date_of_birth, gender, avatar_url, admission_date, parent_user_id, is_active, created_at, updated_at)
        VALUES (school_id_val, 'Rohan', 'Verma', '2013-05-15', 'Male', NULL, '2024-04-01', parent_user_id_val, true, NOW(), NOW())
        RETURNING id INTO student_id_val;

        -- 5. Enroll Student
        INSERT INTO student_enrollments (school_id, student_id, division_id, batch_id, roll_number, created_at, updated_at)
        VALUES (school_id_val, student_id_val, division_id_val, batch_id_val, 'G5A-001', NOW(), NOW());

        RAISE NOTICE '✅ Seed complete! School ID: %', school_id_val;
        RAISE NOTICE 'Login credentials (password: abc@123):';
        RAISE NOTICE '  superadmin@greenwood.edu   (SUPER_ADMIN)';
        RAISE NOTICE '  schooladmin@greenwood.edu  (SCHOOL_ADMIN)';
        RAISE NOTICE '  trustee@greenwood.edu      (SCHOOL_TRUSTEE)';
        RAISE NOTICE '  principal@greenwood.edu    (PRINCIPAL)';
        RAISE NOTICE '  supervisor@greenwood.edu   (SUPERVISOR)';
        RAISE NOTICE '  clerk@greenwood.edu        (CLERK)';
        RAISE NOTICE '  helpdesk@greenwood.edu     (HELPDESK)';
        RAISE NOTICE '  faculty@greenwood.edu      (FACULTY)';
        RAISE NOTICE '  gatekeeper@greenwood.edu   (GATE_KEEPER)';
        RAISE NOTICE '  parent@greenwood.edu       (PARENT)';
        RAISE NOTICE 'Student: Rohan Verma (Grade 5 - A), linked to parent@greenwood.edu';
    END $$;
