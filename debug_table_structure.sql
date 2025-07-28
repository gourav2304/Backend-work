-- Run these queries to diagnose the table structure issue

-- 1. Check if the table exists and get its structure
DESCRIBE centralagentAuditrail;

-- Alternative way to check table structure
SHOW COLUMNS FROM centralagentAuditrail;

-- 2. Check the exact table name (case sensitivity)
SHOW TABLES LIKE '%audit%';

-- 3. Get the complete CREATE TABLE statement for the existing table
SHOW CREATE TABLE centralagentAuditrail;

-- 4. Check all tables in the database
SHOW TABLES;