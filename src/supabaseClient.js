import { createClient } from "@supabase/supabase-js";

// Replace these variables with your actual Supabase project URL and public key.
const SUPABASE_URL = "https://qyysxlzchbiiturruemx.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_0aCXtmRNuK3q6Q3LNXNIvw_VJLyMijF";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
