-- ============================================================
-- SKILLHUB DATABASE SEED DATA (MySQL 8.0+)
-- ============================================================

USE `skillhub_db`;

-- ------------------------------------------------------------
-- 1. Seed Users (passwords hashed or verified via demo)
-- Passwords:
-- alex.learner@skillhub.com -> 'LearnerPass2026!'
-- recruiter@techcorp.io     -> 'RecruiterPass2026!'
-- ------------------------------------------------------------
INSERT INTO `users` (`id`, `email`, `phone_number`, `password_hash`, `role`, `status`, `full_name`, `avatar_url`)
VALUES 
  ('usr-learner-001', 'alex.learner@skillhub.com', '+1-555-0192', '$2a$10$wO3nEPrgK1aT2vQ6X4m3A.rYgEwN8d/jVl5xW8rS7l7KzT3e9X8Wq', 'LEARNER', 'ACTIVE', 'Alex Rivera', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
  ('usr-recruiter-001', 'recruiter@techcorp.io', '+1-555-0188', '$2a$10$wO3nEPrgK1aT2vQ6X4m3A.rYgEwN8d/jVl5xW8rS7l7KzT3e9X8Wq', 'EMPLOYER', 'ACTIVE', 'Sarah Jenkins', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'),
  ('usr-learner-002', 'aarav.sharma@example.com', '+91-9876543210', '$2a$10$wO3nEPrgK1aT2vQ6X4m3A.rYgEwN8d/jVl5xW8rS7l7KzT3e9X8Wq', 'LEARNER', 'ACTIVE', 'Aarav Sharma', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150')
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

-- ------------------------------------------------------------
-- 2. Seed Learner Profiles
-- ------------------------------------------------------------
INSERT INTO `learner_profiles` (`id`, `user_id`, `student_id_tag`, `age`, `physical_address`, `skill_level`, `target_role`, `weekly_commitment_hours`, `career_goal`, `total_hours_learned`, `reputation_score`)
VALUES 
  ('lp-001', 'usr-learner-001', '#SH-2026-8842', 22, 'San Francisco, CA, USA', 'Intermediate', 'Full Stack React Engineer', 15, 'Land a Senior Frontend Role at a Tier-1 Tech Firm', 42.50, 480),
  ('lp-002', 'usr-learner-002', '#SH-2026-1049', 21, '42 Tech Innovation Park, Bengaluru, Karnataka, 560100', 'Basic', 'Full Stack Developer', 12, 'Master Web Development & AI Engineering', 18.00, 150)
ON DUPLICATE KEY UPDATE `reputation_score` = VALUES(`reputation_score`);

-- ------------------------------------------------------------
-- 3. Seed Employer Profiles
-- ------------------------------------------------------------
INSERT INTO `employer_profiles` (`id`, `user_id`, `company_name`, `company_website`, `industry`, `location`, `company_size`)
VALUES 
  ('ep-001', 'usr-recruiter-001', 'TechCorp Inc.', 'https://techcorp.io', 'Enterprise Cloud & AI', 'San Francisco & Remote', '500-1000')
ON DUPLICATE KEY UPDATE `company_name` = VALUES(`company_name`);

-- ------------------------------------------------------------
-- 4. Seed Courses
-- ------------------------------------------------------------
INSERT INTO `courses` (`id`, `title`, `category`, `category_label`, `emoji_icon`, `gradient_css`, `badge_label`, `rating`, `hours`, `students_count`, `skills_json`, `description`, `is_published`)
VALUES
('course-react', 'React.js & Modern Frontend Architecture', 'dev', 'Development', '⚛️', 'linear-gradient(135deg, #667eea, #764ba2)', '🔥 Trending', 4.9, 36, '18.4K', 
 '["React 19", "Next.js", "Redux", "TypeScript"]', 
 'Build scalable web applications with React, modern hooks, server components, and performance patterns.', 1),

('course-aiml', 'AI & Machine Learning Specialization', 'ai', 'AI & Data Science', '🤖', 'linear-gradient(135deg, #f093fb, #f5576c)', '✨ High Demand', 4.9, 48, '14.2K', 
 '["Python", "PyTorch", "LLMs", "LangChain"]', 
 'From foundational statistical models and neural networks to building custom LLM-powered autonomous AI agents.', 1),

('course-python', 'Python for Data Science & Automation', 'ai', 'AI & Data Science', '🐍', 'linear-gradient(135deg, #43e97b, #38f9d7)', '⭐ Bestseller', 4.8, 30, '24.1K', 
 '["Python 3.12", "Pandas", "SQL", "Web Scraping"]', 
 'Automate repetitive workflows, parse complex datasets, and build data visualization dashboards from scratch.', 1),

('course-uiux', 'UI/UX Design Masterclass & Product Strategy', 'design', 'Design', '🎨', 'linear-gradient(135deg, #4facfe, #00f2fe)', '💎 Industry Ready', 4.8, 34, '9.8K', 
 '["Figma", "Design Systems", "User Research", "Wireframing"]', 
 'Master Figma components, design tokens, interactive prototyping, and UX research methodologies.', 1),

('course-cloud', 'Cloud Architecture & DevOps Bootcamp', 'cloud', 'Cloud & DevOps', '☁️', 'linear-gradient(135deg, #667eea, #764ba2)', '🚀 High Paying', 4.9, 42, '7.5K', 
 '["AWS", "Docker", "Kubernetes", "GitHub Actions"]', 
 'Deploy resilient microservices to the cloud, configure automated CI/CD pipelines, and manage container clusters.', 1),

('course-cyber', 'Cybersecurity & Ethical Hacking', 'security', 'Cybersecurity', '🛡️', 'linear-gradient(135deg, #fa709a, #fee140)', '🔐 Certified', 4.7, 38, '6.3K', 
 '["Network Security", "OWASP Top 10", "Pen Testing", "Wireshark"]', 
 'Understand threat vectors, penetration testing methodologies, defensive security, and OWASP vulnerability analysis.', 1),

('course-mobile', 'Cross-Platform Mobile App Dev with Flutter', 'dev', 'Development', '📱', 'linear-gradient(135deg, #a18cd1, #fbc2eb)', '⚡ Fast Track', 4.8, 36, '8.9K', 
 '["Flutter", "Dart", "Firebase", "State Management"]', 
 'Craft smooth 60fps iOS and Android applications from a single codebase with Flutter and Firebase backend.', 1),

('course-data', 'Data Analytics & Business Intelligence', 'ai', 'AI & Data Science', '📊', 'linear-gradient(135deg, #ff9a9e, #fecfef)', '📈 Practical', 4.8, 28, '12.6K', 
 '["SQL", "Power BI", "Tableau", "Excel Advanced"]', 
 'Transform raw multi-table company data into executive dashboards and actionable business growth insights.', 1),

('course-web3', 'Blockchain & Web3 Decentralized Apps', 'dev', 'Development', '⛓️', 'linear-gradient(135deg, #f6d365, #fda085)', '🌐 Next Gen', 4.7, 40, '5.1K', 
 '["Solidity", "Ethereum", "Ethers.js", "Smart Contracts"]', 
 'Write and deploy secure smart contracts, build decentralized frontends, and interact with EVM networks.', 1),

('course-fullstack', 'Full-Stack MERN Architect Certification', 'dev', 'Development', '💻', 'linear-gradient(135deg, #84fab0, #8fd3f4)', '🏆 Comprehensive', 4.9, 54, '21.0K', 
 '["MongoDB", "Express", "React", "Node.js", "Tailwind"]', 
 'Comprehensive zero-to-hero full stack curriculum covering schema design, microservices, auth, and state.', 1),

('course-sysdesign', 'High-Scale Distributed Systems Design', 'cloud', 'Cloud & DevOps', '🏛️', 'linear-gradient(135deg, #cfd9df, #e2ebf0)', '🎯 Senior Level', 4.9, 32, '11.3K', 
 '["System Design", "Kafka", "Redis", "Load Balancing"]', 
 'Ace engineering architecture interviews and architect systems supporting millions of concurrent requests.', 1),

('course-agentic', 'Agentic AI & Autonomous Multi-Agent Systems', 'ai', 'AI & Data Science', '🔮', 'linear-gradient(135deg, #c471ed, #f64f59)', '🚀 Cutting Edge', 4.9, 44, '8.4K', 
 '["LangGraph", "AutoGPT", "Vector DBs", "Tool Calling"]', 
 'Build production autonomous AI workflows, orchestrate multi-agent collaboration, and integrate external tools.', 1)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- ------------------------------------------------------------
-- 5. Seed Course Modules
-- ------------------------------------------------------------
INSERT INTO `course_modules` (`course_id`, `module_index`, `name`, `duration`)
VALUES
('course-react', 0, 'Module 1: JavaScript ES6+ & React Core Mental Model', '6 hrs'),
('course-react', 1, 'Module 2: Advanced Hooks, State & Context Optimization', '8 hrs'),
('course-react', 2, 'Module 3: Full Stack Integration with Next.js & Server Actions', '12 hrs'),
('course-react', 3, 'Module 4: Production Deployment, Testing & CI/CD', '10 hrs'),

('course-aiml', 0, 'Module 1: Math for ML, NumPy & Pandas Deep Dive', '10 hrs'),
('course-aiml', 1, 'Module 2: Supervised & Unsupervised Learning Algorithms', '12 hrs'),
('course-aiml', 2, 'Module 3: Deep Neural Networks & PyTorch Fundamentals', '14 hrs'),
('course-aiml', 3, 'Module 4: Generative AI, RAG & LLM Application Engineering', '12 hrs'),

('course-python', 0, 'Module 1: Python Fundamentals, Data Structures & OOP', '8 hrs'),
('course-python', 1, 'Module 2: Data Manipulation with Pandas & NumPy', '8 hrs'),
('course-python', 2, 'Module 3: Automated Scripts & Web Scraping with BeautifulSoup', '7 hrs'),
('course-python', 3, 'Module 4: Exploratory Data Analysis & Interactive Dashboards', '7 hrs'),

('course-cloud', 0, 'Module 1: Linux Administration & Cloud Fundamentals', '8 hrs'),
('course-cloud', 1, 'Module 2: Docker Containers & Multi-Service Orchestration', '10 hrs'),
('course-cloud', 2, 'Module 3: Kubernetes Cluster Deployment & Autoscaling', '12 hrs'),
('course-cloud', 3, 'Module 4: CI/CD Pipelines with GitHub Actions & Terraform', '12 hrs')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ------------------------------------------------------------
-- 6. Seed Course Enrollments for Demo Learner
-- ------------------------------------------------------------
INSERT INTO `course_enrollments` (`id`, `user_id`, `course_id`, `progress_percentage`, `completed_lessons_count`, `total_lessons_count`, `status`)
VALUES
  ('enr-001', 'usr-learner-001', 'course-react', 75, 3, 4, 'ACTIVE'),
  ('enr-002', 'usr-learner-001', 'course-aiml', 25, 1, 4, 'ACTIVE'),
  ('enr-003', 'usr-learner-002', 'course-python', 50, 2, 4, 'ACTIVE')
ON DUPLICATE KEY UPDATE `progress_percentage` = VALUES(`progress_percentage`);

-- ------------------------------------------------------------
-- 7. Seed Jobs
-- ------------------------------------------------------------
INSERT INTO `jobs` (`id`, `title`, `company`, `location`, `type`, `salary`, `field`, `description`, `requirements_json`, `is_featured`)
VALUES
('job-001', 'Senior Frontend Engineer', 'Vercel', 'San Francisco, CA (Remote)', 'Full-time', '$145,000 - $180,000', 'development', 
 'Build next-generation developer tooling and web experiences powered by Next.js and Edge Runtime.', 
 '["React 19", "Next.js", "TypeScript", "5+ years frontend experience"]', 1),

('job-002', 'AI / ML Platform Engineer', 'OpenAI Ecosystem Partner', 'Remote', 'Full-time', '$160,000 - $210,000', 'ai', 
 'Scale inference endpoints, optimize high-throughput vector retrieval, and integrate LLM agents.', 
 '["Python", "PyTorch", "Kubernetes", "Vector Databases"]', 1),

('job-003', 'Full Stack Product Engineer', 'Stripe', 'Seattle, WA (Hybrid)', 'Full-time', '$150,000 - $190,000', 'development', 
 'Architect secure global checkout APIs, billing dashboards, and merchant onboarding flows.', 
 '["Node.js", "React", "MySQL / Postgres", "REST APIs"]', 1),

('job-004', 'Cloud Infrastructure & SRE', 'Datadog', 'New York, NY (Hybrid)', 'Full-time', '$140,000 - $175,000', 'cloud', 
 'Maintain 99.999% reliability for telemetry data processing clusters running across multiple AWS regions.', 
 '["Kubernetes", "Terraform", "Go / Python", "Prometheus"]', 0),

('job-005', 'Senior Product Designer (UI/UX)', 'Figma', 'Remote (Global)', 'Full-time', '$135,000 - $165,000', 'design', 
 'Lead design tokens architecture, collaboration mechanics, and craft micro-interactions.', 
 '["Figma Master", "Design Systems", "Prototyping", "User Research"]', 0)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- ------------------------------------------------------------
-- 8. Seed Tutors
-- ------------------------------------------------------------
INSERT INTO `tutors` (`id`, `name`, `title`, `rating`, `reviews_count`, `hourly_rate`, `bio`, `specialties_json`, `avatar_url`)
VALUES
('tut-001', 'Dr. Aris Thorne', 'Ex-Google Staff ML Engineer & PhD', 4.9, 148, 85, 
 '12+ years building production ML systems. Mentored 400+ engineers into top-tier tech roles.', 
 '["Machine Learning", "Deep Learning", "Python", "LLMs"]', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),

('tut-002', 'Elena Rostova', 'Principal Frontend Architect @ Stripe', 5.0, 210, 95, 
 'Specializing in high-performance React applications, Next.js architecture, and frontend systems design.', 
 '["React", "TypeScript", "Performance", "Next.js"]', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'),

('tut-003', 'Devon Vance', 'Senior Cloud Solutions Architect (AWS Certified)', 4.8, 94, 75, 
 'Hands-on mentorship in Kubernetes, AWS cloud architectures, Terraform, and DevOps CI/CD pipelines.', 
 '["AWS", "Docker", "Kubernetes", "CI/CD"]', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),

('tut-004', 'Priya Patel', 'Design Lead & Design Systems Advocate', 4.9, 132, 70, 
 'Empowering designers to craft world-class design systems, portfolio reviews, and product leadership skills.', 
 '["Figma", "Design Systems", "UI/UX", "Portfolio Review"]', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);
