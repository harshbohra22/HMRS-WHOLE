INSERT INTO cities (city_name) VALUES ('New York'), ('San Francisco'), ('London');
INSERT INTO job_positions (title) VALUES ('Senior Java Developer'), ('Frontend Engineer'), ('AI Researcher');
INSERT INTO employers (company_name, web_page, email, password, phone_number) VALUES ('Tech Solutions', 'www.techsolutions.com', 'contact@techsolutions.com', '123456', '555-1234');
INSERT INTO job_seekers (birth_date, email, last_name, name, national_id, password) VALUES ('1990-01-01', 'harsh@example.com', 'Bohra', 'Harsh', '12345678901', 'password123');

-- Insert a job advertisement
INSERT INTO job_advertisement (active, application_deadline, description, max_salary, min_salary, open_position_count, job_relase_date, city_id, employer_id, job_position_id) 
VALUES (true, '2026-12-31', 'We are looking for a Senior Java Developer with Spring Boot and AI experience.', 150000, 100000, 3, '2025-01-01', 1, 1, 1);

-- Optionally insert an application right away so it shows up in "My Applications" immediately without needing to apply again
INSERT INTO job_applications (application_date, status, job_advertisement_id, job_seeker_id) VALUES (CURRENT_TIMESTAMP, 'PENDING', 1, 1);
