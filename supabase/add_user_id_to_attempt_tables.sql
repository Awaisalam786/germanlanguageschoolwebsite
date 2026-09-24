-- ==============================================================================
-- Migration: Add user_id foreign key to skill engine attempt tables
-- File: supabase/add_user_id_to_attempt_tables.sql
-- 
-- Description:
-- Adds nullable UUID foreign keys referencing auth.users(id) to:
--   1. reading_attempts
--   2. grammar_attempts
--   3. vocab_engine_attempts
--
-- This enables public learner accounts to associate and view their reading,
-- grammar, and vocabulary test attempts in their personal dashboard by verified user_id.
--
-- NOTE: Do not run automatically against production without manual review.
-- Apply via the Supabase Dashboard SQL Editor when ready.
-- ==============================================================================

-- 1. Add user_id column to reading_attempts
ALTER TABLE reading_attempts 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_reading_attempts_user_id 
ON reading_attempts(user_id);

-- 2. Add user_id column to grammar_attempts
ALTER TABLE grammar_attempts 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_grammar_attempts_user_id 
ON grammar_attempts(user_id);

-- 3. Add user_id column to vocab_engine_attempts
ALTER TABLE vocab_engine_attempts 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_vocab_engine_attempts_user_id 
ON vocab_engine_attempts(user_id);
