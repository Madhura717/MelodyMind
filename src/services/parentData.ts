import { supabase } from "@/src/lib/supabase";

export type ScreenTimeRow = { name: string; minutes: number; limit: number };

export async function fetchParentDashboardData() {
  // Prefer Supabase if configured; fall back to local API so the UI always works.
  if (supabase) {
    // Expected table: screen_time (columns: day, minutes, limit)
    const { data: screenTime, error: stError } = await supabase
      .from("screen_time")
      .select("day, minutes, limit")
      .order("sort", { ascending: true })
      .limit(7);

    if (!stError && Array.isArray(screenTime) && screenTime.length > 0) {
      const mapped: ScreenTimeRow[] = screenTime.map((r: any) => ({
        name: String(r.day ?? ""),
        minutes: Number(r.minutes ?? 0),
        limit: Number(r.limit ?? 0),
      }));

      // Still fetch progress from local API for now (until you add more tables).
      const progress = await fetch("/api/user/progress").then((r) => r.json());
      return { ...progress, screenTime: mapped };
    }
  }

  return fetch("/api/user/progress").then((r) => r.json());
}

