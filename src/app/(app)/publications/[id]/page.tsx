import { getPublicationPath } from "@/features/publications/lib/publications";
import { redirectToPreferredLocaleWithParams } from "@/lib/publicLocaleRouting";

export default async function LegacyPublicationDetailRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return redirectToPreferredLocaleWithParams(params, ({ id }, locale) =>
    getPublicationPath(id, locale),
  );
}
