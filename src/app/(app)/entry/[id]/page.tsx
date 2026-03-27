import { getEntryPath } from "@/lib/locale";
import { redirectToPreferredLocaleWithParams } from "@/lib/publicLocaleRouting";

export default async function LegacyEntryRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return redirectToPreferredLocaleWithParams(params, ({ id }, locale) =>
    getEntryPath(id, locale),
  );
}
