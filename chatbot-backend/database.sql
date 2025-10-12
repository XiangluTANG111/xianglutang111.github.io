-- Xianglu Chatbot Database Schema
-- PostgreSQL Database Setup

-- Create database (run this separately)
-- CREATE DATABASE xianglu_chatbot;

-- Connect to the database and run the following:

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    session_id UUID NOT NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);

-- User feedback table (optional)
CREATE TABLE IF NOT EXISTS user_feedback (
    id SERIAL PRIMARY KEY,
    session_id UUID NOT NULL,
    conversation_id INTEGER REFERENCES conversations(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table (optional)
CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    session_id UUID NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);

-- Sample data for testing (optional)
-- INSERT INTO conversations (session_id, user_message, ai_response, metadata) 
-- VALUES (
--     '123e4567-e89b-12d3-a456-426614174000',
--     'Hello, what is your research about?',
--     'Hi there! I''m currently working on several research projects at Stanford and Columbia...',
--     '{"model": "gpt-4", "tokens": 150}'
-- );
