// The project URL and publishable key are safe to ship to browsers: what each visitor can read or
// change is decided by the database's row-level security rules, not by keeping this key secret.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://gwnkblvupulwmioszjhr.supabase.co";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "sb_publishable_FW-XuMVYPL0enFoybC5t7w_aVoiEpxx";
