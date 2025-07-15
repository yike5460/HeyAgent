-- Check database status
SELECT 'Database Status' as info, 'Ready' as status;
SELECT 'Users' as table_name, COUNT(*) as count FROM users;
SELECT 'Templates' as table_name, COUNT(*) as count FROM templates;
SELECT 'Template Tags' as table_name, COUNT(*) as count FROM template_tags;
SELECT 'Industries' as table_name, COUNT(*) as count FROM industries;

-- Show sample data
SELECT 'Sample Users:' as info;
SELECT name, email, company FROM users WHERE id LIKE 'user%' LIMIT 3;

SELECT 'Sample Templates:' as info;
SELECT title, industry, status, rating FROM templates WHERE id LIKE 'template%' LIMIT 3;