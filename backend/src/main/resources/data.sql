INSERT INTO users (name, email, password, role, created_at)
SELECT 'Default Admin', 'admin@test.com', '$2a$10$35JKG0f8uVYx9fM2WvQVKONjRllyfQ676f4MHDL/95B2S/bRMyCVK', 'ADMIN', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'admin@test.com'
);

UPDATE users
SET name = 'Default Admin',
    password = '$2a$10$35JKG0f8uVYx9fM2WvQVKONjRllyfQ676f4MHDL/95B2S/bRMyCVK',
    role = 'ADMIN'
WHERE email = 'admin@test.com';

INSERT INTO users (name, email, password, role, created_at)
SELECT 'Default Candidate', 'candidate@test.com', '$2a$10$35JKG0f8uVYx9fM2WvQVKONjRllyfQ676f4MHDL/95B2S/bRMyCVK', 'CANDIDATE', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'candidate@test.com'
);

UPDATE users
SET name = 'Default Candidate',
    password = '$2a$10$35JKG0f8uVYx9fM2WvQVKONjRllyfQ676f4MHDL/95B2S/bRMyCVK',
    role = 'CANDIDATE'
WHERE email = 'candidate@test.com';

INSERT INTO users (name, email, password, role, created_at)
SELECT 'Default Recruiter', 'recruiter@test.com', '$2a$10$35JKG0f8uVYx9fM2WvQVKONjRllyfQ676f4MHDL/95B2S/bRMyCVK', 'RECRUITER', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'recruiter@test.com'
);

UPDATE users
SET name = 'Default Recruiter',
    password = '$2a$10$35JKG0f8uVYx9fM2WvQVKONjRllyfQ676f4MHDL/95B2S/bRMyCVK',
    role = 'RECRUITER'
WHERE email = 'recruiter@test.com';

INSERT INTO jobs (title, description, location, salary, company, recruiter_id, created_at)
SELECT
    'Frontend Developer',
    'Build responsive React interfaces, collaborate with designers, and ship polished product experiences.',
    'Bangalore',
    900000,
    'TechNova',
    (SELECT id FROM users WHERE email = 'recruiter@test.com'),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM jobs WHERE title = 'Frontend Developer' AND company = 'TechNova'
);

INSERT INTO jobs (title, description, location, salary, company, recruiter_id, created_at)
SELECT
    'Backend Java Engineer',
    'Develop secure Spring Boot APIs, optimize SQL queries, and maintain scalable backend services.',
    'Hyderabad',
    1200000,
    'DataBridge',
    (SELECT id FROM users WHERE email = 'recruiter@test.com'),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM jobs WHERE title = 'Backend Java Engineer' AND company = 'DataBridge'
);

INSERT INTO jobs (title, description, location, salary, company, recruiter_id, created_at)
SELECT
    'Full Stack Developer',
    'Work across React and Java services to build end-to-end hiring workflows and admin tools.',
    'Pune',
    1100000,
    'HireFlow',
    (SELECT id FROM users WHERE email = 'recruiter@test.com'),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM jobs WHERE title = 'Full Stack Developer' AND company = 'HireFlow'
);

INSERT INTO jobs (title, description, location, salary, company, recruiter_id, created_at)
SELECT
    'UI/UX Designer',
    'Design candidate-friendly flows, recruiter dashboards, and clear user journeys for the portal.',
    'Remote',
    800000,
    'PixelCraft',
    (SELECT id FROM users WHERE email = 'recruiter@test.com'),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM jobs WHERE title = 'UI/UX Designer' AND company = 'PixelCraft'
);

INSERT INTO jobs (title, description, location, salary, company, recruiter_id, created_at)
SELECT
    'DevOps Engineer',
    'Own CI/CD pipelines, deployment automation, monitoring, and cloud reliability improvements.',
    'Chennai',
    1300000,
    'CloudAxis',
    (SELECT id FROM users WHERE email = 'recruiter@test.com'),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM jobs WHERE title = 'DevOps Engineer' AND company = 'CloudAxis'
);

INSERT INTO jobs (title, description, location, salary, company, recruiter_id, created_at)
SELECT
    'Data Analyst',
    'Analyze hiring data, build dashboards, and generate insights for recruiters and leadership teams.',
    'Mumbai',
    750000,
    'InsightWorks',
    (SELECT id FROM users WHERE email = 'recruiter@test.com'),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM jobs WHERE title = 'Data Analyst' AND company = 'InsightWorks'
);

INSERT INTO jobs (title, description, location, salary, company, recruiter_id, created_at)
SELECT
    'QA Engineer',
    'Design test cases, automate regression suites, and improve product quality across releases.',
    'Noida',
    700000,
    'QualityFirst',
    (SELECT id FROM users WHERE email = 'recruiter@test.com'),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM jobs WHERE title = 'QA Engineer' AND company = 'QualityFirst'
);

INSERT INTO jobs (title, description, location, salary, company, recruiter_id, created_at)
SELECT
    'Product Manager',
    'Own roadmap planning, align stakeholders, and deliver user-focused hiring platform improvements.',
    'Gurgaon',
    1500000,
    'VisionLoop',
    (SELECT id FROM users WHERE email = 'recruiter@test.com'),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM jobs WHERE title = 'Product Manager' AND company = 'VisionLoop'
);

INSERT INTO jobs (title, description, location, salary, company, recruiter_id, created_at)
SELECT
    'Mobile App Developer',
    'Build and maintain mobile-first application flows for job seekers using modern app technologies.',
    'Remote',
    1000000,
    'AppSprint',
    (SELECT id FROM users WHERE email = 'recruiter@test.com'),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM jobs WHERE title = 'Mobile App Developer' AND company = 'AppSprint'
);
