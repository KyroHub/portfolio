import { getDashboardPath } from "@/lib/locale";
import { redirectToPreferredLocale } from "@/lib/publicLocaleRouting";

export default async function DashboardPage() {
  return redirectToPreferredLocale(getDashboardPath);
}
