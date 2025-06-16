// Replace these with your actual project values
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const SUPABASE_URL = 'https://wexxbmczibqritujgjud.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndleHhibWN6aWJxcml0dWpnanVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNzM2MjUsImV4cCI6MjA2NTY0OTYyNX0.Lk-HQPNI6ywoY09fFT8i5VjyWqr5mIwIXuhSpl9F3X8';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
