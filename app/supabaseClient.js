import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://fexscqaukalbrmgliubj.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZleHNjcWF1a2FsYnJtZ2xpdWJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0OTU4MTYsImV4cCI6MjA5NjA3MTgxNn0.xHyIgRyKp9YhKKqwbKAnp7pX4vniHGH2RLlbqt0QtHU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
