import { supabase } from "@/src/lib/supabase";

export type WeeklyTimePoint = { label: string; gamesMin: number; chatMin: number; demoMin: number };

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function splitTotal(totalMin: number) {
  // Default split: Games 60%, Chat 25%, Demo 15%
  const gamesMin = Math.round(totalMin * 0.6);
  const chatMin = Math.round(totalMin * 0.25);
  const demoMin = Math.max(0, totalMin - gamesMin - chatMin);
  return { gamesMin, chatMin, demoMin };
}

export async function tryLoadWeeklyTimeFromSupabase(): Promise<WeeklyTimePoint[] | null> {
  if (!supabase) return null;

  // Uses the simple `screen_time` table you created from SQL:
  // columns: day (text), minutes (int), limit (int), sort (int)
  const { data, error } = await supabase
    .from("screen_time")
    .select("day, minutes")
    .order("sort", { ascending: true })
    .limit(7);

  if (error || !Array.isArray(data) || data.length === 0) return null;

  const byDay = new Map<string, number>();
  for (const row of data as any[]) {
    const d = String(row.day ?? "");
    const m = Number(row.minutes ?? 0);
    if (d) byDay.set(d, m);
  }

  // Ensure chart is always stable 7 points.
  return DAYS.map((label) => {
    const total = byDay.get(label) ?? 0;
    const split = splitTotal(total);
    return { label, ...split };
  });
}

