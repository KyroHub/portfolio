import { getGrammarLessonPath } from "@/features/grammar/lib/grammarPaths";
import { redirectToPreferredLocaleWithParams } from "@/lib/publicLocaleRouting";

export default async function LegacyGrammarLessonRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return redirectToPreferredLocaleWithParams(params, ({ slug }, locale) =>
    getGrammarLessonPath(slug, locale),
  );
}
