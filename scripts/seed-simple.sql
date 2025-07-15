-- Simple seed data for HeyPrompt Platform

-- Clear existing test data if any
DELETE FROM users WHERE id LIKE 'user%';
DELETE FROM templates WHERE id LIKE 'template%';

-- Insert sample users
INSERT INTO users (
  id, email, name, avatar_url, bio, company, location, website,
  github_username, twitter_username, linkedin_username,
  oauth_provider, oauth_provider_id, created_at, updated_at
) VALUES 
('user1', 'john.doe@example.com', 'John Doe', 'https://avatar.example.com/johndoe', 'AI enthusiast and script writer', 'Media Productions Inc.', 'Los Angeles, CA', 'https://johndoe.com', 'johndoe', 'johndoe', 'johndoe', 'github', 'github123', datetime('now'), datetime('now')),
('user2', 'alice.smith@example.com', 'Alice Smith', 'https://avatar.example.com/alicesmith', 'Healthcare AI researcher', 'HealthTech Solutions', 'Boston, MA', 'https://alicesmith.com', 'alicesmith', 'alicesmith', 'alicesmith', 'google', 'google456', datetime('now'), datetime('now')),
('user3', 'bob.wilson@example.com', 'Bob Wilson', 'https://avatar.example.com/bobwilson', 'E-commerce automation expert', 'RetailBot Inc.', 'Seattle, WA', 'https://bobwilson.com', 'bobwilson', 'bobwilson', 'bobwilson', 'github', 'github789', datetime('now'), datetime('now'));

-- Insert sample templates with simplified JSON
INSERT INTO templates (
  id, title, description, industry, use_case, version, status, user_id,
  prompt_config, agent_config, execution_environment, metadata, tags,
  license, is_public, rating, usage_count, fork_count, created_at, updated_at
) VALUES 
('template1', 'Short Drama Production Assistant', 'Automated script generation, character development, and scene planning for short-form video content', 'Media & Entertainment', 'Short Drama Production', '1.0.0', 'published', 'user1', '{"systemPrompt": "You are an expert script writer.", "userPromptTemplate": "Create a short drama script for {genre}.", "parameters": [], "constraints": {"maxTokens": 2000}}', '{"workflow": [], "errorHandling": {}, "monitoring": {}, "scaling": {}}', '[{"infrastructure": "vscode", "requirements": "Node.js 18+"}]', '{"category": "Content Creation", "complexity": "intermediate", "estimatedRuntime": 120}', '["video", "script", "automation"]', 'MIT', 1, 4.8, 1250, 12, datetime('now'), datetime('now')),
('template2', 'E-commerce Product Description Generator', 'AI-powered tool for creating compelling product descriptions', 'Retail', 'Product Marketing', '1.0.0', 'published', 'user3', '{"systemPrompt": "You are an expert copywriter.", "userPromptTemplate": "Create a product description for {productName}.", "parameters": [], "constraints": {"maxTokens": 500}}', '{"workflow": [], "errorHandling": {}, "monitoring": {}, "scaling": {}}', '[{"infrastructure": "web", "requirements": "Modern web browser"}]', '{"category": "Marketing", "complexity": "beginner", "estimatedRuntime": 60}', '["ecommerce", "copywriting", "seo"]', 'MIT', 1, 4.5, 892, 8, datetime('now'), datetime('now')),
('template3', 'Healthcare Symptom Analyzer', 'AI assistant for preliminary symptom analysis', 'Healthcare & Life Science', 'Health Information', '1.0.0', 'published', 'user2', '{"systemPrompt": "You are a health information assistant.", "userPromptTemplate": "Analyze symptoms: {symptoms}.", "parameters": [], "constraints": {"maxTokens": 800}}', '{"workflow": [], "errorHandling": {}, "monitoring": {}, "scaling": {}}', '[{"infrastructure": "secure-cloud", "requirements": "HIPAA-compliant environment"}]', '{"category": "Healthcare", "complexity": "advanced", "estimatedRuntime": 90}', '["healthcare", "symptoms", "health-info"]', 'Apache-2.0', 1, 4.7, 643, 5, datetime('now'), datetime('now'));