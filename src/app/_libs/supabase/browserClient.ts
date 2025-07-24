import type { SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfig } from "@/app/_libs/env";

export const createSupabaseBrowserClient = (): SupabaseClient => {
  return createBrowserClient(supabaseConfig.url, supabaseConfig.anonKey);
};
