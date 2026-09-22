-- ============================================================
-- SKILLHUB RELATIONAL DATABASE SCHEMA (MySQL 8.0+)
-- Character Set: utf8mb4, Collation: utf8mb4_unicode_ci
-- ============================================================

CREATE DATABASE IF NOT EXISTS `skillhub_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `skillhub_db`;

-- ------------------------------------------------------------
-- 1. Table: users (Core Identity & RBAC)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `email` VARCHAR(255) NULL UNIQUE,
  `phone_number` VARCHAR(32) NULL UNIQUE,
  `password_hash` VARCHAR(255) NULL,
  `role` ENUM('LEARNER', 'EMPLOYER', 'INSTRUCTOR', 'ADMIN') NOT NULL DEFAULT 'LEARNER',
  `status` ENUM('ACTIVE', 'PENDING', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  `full_name` VARCHAR(128) NOT NULL,
  `avatar_url` VARCHAR(512) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. Table: learner_profiles (Student Onboarding & Milestones)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `learner_profiles` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL UNIQUE,
  `student_id_tag` VARCHAR(32) NOT NULL UNIQUE,
  `age` SMALLINT UNSIGNED NOT NULL DEFAULT 20,
  `physical_address` TEXT NOT NULL,
  `skill_level` ENUM('Basic', 'Intermediate', 'Advanced') NOT NULL DEFAULT 'Basic',
  `target_role` VARCHAR(128) NOT NULL DEFAULT 'Full Stack Developer',
  `weekly_commitment_hours` SMALLINT UNSIGNED NOT NULL DEFAULT 10,
  `career_goal` VARCHAR(255) NOT NULL DEFAULT 'Get Hired at Top Tech Company',
  `total_hours_learned` DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  `reputation_score` INT NOT NULL DEFAULT 100,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_learner_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. Table: employer_profiles (Companies Posting Jobs)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `employer_profiles` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL UNIQUE,
  `company_name` VARCHAR(128) NOT NULL,
  `company_website` VARCHAR(255) NULL,
  `industry` VARCHAR(64) NOT NULL DEFAULT 'Technology',
  `location` VARCHAR(128) NOT NULL DEFAULT 'Remote',
  `company_size` VARCHAR(32) NOT NULL DEFAULT '50-200',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_employer_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. Table: courses (Learning Catalog)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `courses` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(32) NOT NULL,
  `category_label` VARCHAR(64) NOT NULL,
  `emoji_icon` VARCHAR(16) NOT NULL,
  `gradient_css` VARCHAR(255) NOT NULL,
  `badge_label` VARCHAR(64) NOT NULL,
  `rating` DECIMAL(3,1) NOT NULL DEFAULT 4.9,
  `hours` SMALLINT UNSIGNED NOT NULL DEFAULT 30,
  `students_count` VARCHAR(32) NOT NULL DEFAULT '12.5K',
  `skills_json` JSON NOT NULL,
  `description` TEXT NOT NULL,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_courses_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. Table: course_modules (Modules for each course)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `course_modules` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `course_id` VARCHAR(64) NOT NULL,
  `module_index` SMALLINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `duration` VARCHAR(32) NOT NULL DEFAULT '8 hrs',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_module_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_course_module` (`course_id`, `module_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 6. Table: course_enrollments (Active Student Course Subscriptions)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `course_enrollments` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `course_id` VARCHAR(64) NOT NULL,
  `progress_percentage` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `completed_lessons_count` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `total_lessons_count` SMALLINT UNSIGNED NOT NULL DEFAULT 4,
  `status` ENUM('ACTIVE', 'COMPLETED', 'DROPPED') NOT NULL DEFAULT 'ACTIVE',
  `enrolled_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_accessed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_enrollment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_enrollment_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_user_course` (`user_id`, `course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 7. Table: lesson_progress (Granular Module Completion)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `lesson_progress` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `enrollment_id` VARCHAR(36) NOT NULL,
  `course_id` VARCHAR(64) NOT NULL,
  `module_index` SMALLINT UNSIGNED NOT NULL,
  `is_completed` TINYINT(1) NOT NULL DEFAULT 0,
  `completed_at` TIMESTAMP NULL,
  CONSTRAINT `fk_progress_enrollment` FOREIGN KEY (`enrollment_id`) REFERENCES `course_enrollments` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_enrollment_module` (`enrollment_id`, `module_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 8. Table: jobs (Career Marketplace Opportunities)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `title` VARCHAR(128) NOT NULL,
  `company` VARCHAR(128) NOT NULL,
  `location` VARCHAR(128) NOT NULL,
  `type` VARCHAR(32) NOT NULL DEFAULT 'Full-time',
  `salary` VARCHAR(64) NOT NULL DEFAULT 'Competitive',
  `field` VARCHAR(32) NOT NULL DEFAULT 'development',
  `description` TEXT NOT NULL,
  `requirements_json` JSON NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_jobs_field` (`field`),
  INDEX `idx_jobs_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 9. Table: job_applications (Student Job Submissions)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `job_applications` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `job_id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NULL,
  `applicant_name` VARCHAR(128) NOT NULL,
  `applicant_email` VARCHAR(255) NOT NULL,
  `applicant_phone` VARCHAR(32) NULL,
  `cover_note` TEXT NULL,
  `status` ENUM('SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'SUBMITTED',
  `applied_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_application_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 10. Table: tutors (1-on-1 Mentorship Marketplace)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tutors` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `name` VARCHAR(128) NOT NULL,
  `title` VARCHAR(128) NOT NULL,
  `rating` DECIMAL(3,1) NOT NULL DEFAULT 4.9,
  `reviews_count` INT UNSIGNED NOT NULL DEFAULT 120,
  `hourly_rate` INT UNSIGNED NOT NULL DEFAULT 50,
  `bio` TEXT NOT NULL,
  `specialties_json` JSON NOT NULL,
  `avatar_url` VARCHAR(512) NULL,
  `is_available` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 11. Table: tutor_bookings (Scheduled Sessions)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tutor_bookings` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `tutor_id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `slot_time` VARCHAR(128) NOT NULL,
  `status` ENUM('CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'CONFIRMED',
  `notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_booking_tutor` FOREIGN KEY (`tutor_id`) REFERENCES `tutors` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_booking_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 12. Table: otp_verifications (Telco Verification & Onboarding)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `otp_verifications` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `contact` VARCHAR(255) NOT NULL,
  `otp_code` VARCHAR(8) NOT NULL,
  `session_token` VARCHAR(128) NOT NULL UNIQUE,
  `expires_at` TIMESTAMP NOT NULL,
  `is_verified` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_otp_session` (`session_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 13. Table: newsletter_subscribers
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `subscribed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
