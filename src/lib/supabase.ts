import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://eaqmajmkidwdsqbkdrla.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhcW1ham1raWR3ZHNxYmtkcmxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjI1NTMsImV4cCI6MjA2Njg5ODU1M30.vNr9CvRI9Lbko5S1LTH44KXnTGaGOwHhCkysK_xv9IM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
