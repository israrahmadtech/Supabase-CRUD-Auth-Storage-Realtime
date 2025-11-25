import { createClient } from "@supabase/supabase-js";

const projectUrl = "https://cqpiwlbmgpqwviupuoba.supabase.co"
const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxcGl3bGJtZ3Bxd3ZpdXB1b2JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MjY5MTAsImV4cCI6MjA3OTQwMjkxMH0.WTvYHU27DNeN8ofR0NZtfJsbEFnLcGsK_tLVjPoFY2s"

export const supabase = createClient(projectUrl, apiKey)