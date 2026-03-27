/* eslint-disable @next/next/no-img-element */
import { redirect } from "next/navigation";
import { logout } from "@/actions/auth";
import { Badge } from "@/components/Badge";
import { PageHeader } from "@/components/PageHeader";
import { PageShell, pageShellAccents } from "@/components/PageShell";
import { SurfacePanel } from "@/components/SurfacePanel";
import { DictionaryFavoritesOverview } from "@/features/dictionary/components/DictionaryFavoritesOverview";
import { getDictionaryEntryById } from "@/features/dictionary/lib/dictionary";
import { SubmissionCard } from "@/features/submissions/components/SubmissionCard";
import { SubmissionEmptyState } from "@/features/submissions/components/SubmissionEmptyState";
import { SubmissionFeedbackPanel } from "@/features/submissions/components/SubmissionFeedbackPanel";
import { SubmissionStatusBadge } from "@/features/submissions/components/SubmissionStatusBadge";
import { GrammarDashboardOverview } from "@/features/grammar/components/GrammarDashboardOverview";
import { buildGrammarLessonLearnerSummary } from "@/features/grammar/lib/grammarLearnerState";
import {
  getPublishedGrammarLessonBundleBySlug,
  listPublishedGrammarLessons,
} from "@/features/grammar/lib/grammarDataset";
import { AccountSettingsPanel } from "@/features/profile/components/AccountSettingsPanel";
import { getAccountAuthSettings } from "@/features/profile/lib/accountSettings";
import { getDashboardCopy } from "@/features/dashboard/lib/dashboardCopy";
import { antinoou } from "@/lib/fonts";
import { getDashboardPath } from "@/lib/locale";
import {
  getProfile,
  getUserEntryFavorites,
  getUserLessonBookmarks,
  getUserLessonNotes,
  getUserLessonProgressRows,
  getUserSectionProgressRows,
  getUserSubmissions,
} from "@/lib/supabase/queries";
import { requireAuthenticatedPageSession } from "@/lib/supabase/auth";
import { getLoginPath } from "@/lib/supabase/config";
import type { Language } from "@/types/i18n";

type DashboardPageContentProps = {
  locale: Language;
};

export async function DashboardPageContent({
  locale,
}: DashboardPageContentProps) {
  const dashboardPath = getDashboardPath(locale);
  const copy = getDashboardCopy(locale);
  const { supabase, user } = await requireAuthenticatedPageSession(dashboardPath);

  const profile = await getProfile(supabase, user.id);
  if (!profile) {
    return redirect(getLoginPath(dashboardPath));
  }

  const [
    submissions,
    lessonProgressRows,
    sectionProgressRows,
    entryFavorites,
    lessonBookmarks,
    lessonNotes,
  ] = await Promise.all([
    getUserSubmissions(supabase, user.id),
    getUserLessonProgressRows(supabase, user.id),
    getUserSectionProgressRows(supabase, user.id),
    getUserEntryFavorites(supabase, user.id),
    getUserLessonBookmarks(supabase, user.id),
    getUserLessonNotes(supabase, user.id),
  ]);
  const savedDictionaryEntries = entryFavorites.map((favorite) => ({
    entry: getDictionaryEntryById(favorite.entry_id),
    favorite,
  }));

  const grammarLessonSummaries = listPublishedGrammarLessons()
    .map((lesson) => getPublishedGrammarLessonBundleBySlug(lesson.slug))
    .filter(
      (lessonBundle): lessonBundle is NonNullable<typeof lessonBundle> =>
        lessonBundle !== null,
    )
    .map((lessonBundle) =>
      buildGrammarLessonLearnerSummary({
        lessonBundle,
        lessonProgressRows,
        sectionProgressRows,
        bookmarkRows: lessonBookmarks,
        lessonNoteRows: lessonNotes,
      }),
    );
  const { canUpdatePassword, providerLabel } = getAccountAuthSettings(
    user.app_metadata,
    locale,
  );

  return (
    <PageShell
      className="min-h-screen px-6 py-16"
      contentClassName="mx-auto min-h-[80vh] max-w-5xl"
      accents={[
        pageShellAccents.topLeftSkyOrb,
        pageShellAccents.bottomRightEmeraldOrb,
      ]}
    >
      <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <Badge tone="accent" size="xs" caps className="mb-4">
            {copy.shellBadge}
          </Badge>
          <PageHeader
            title={copy.pageTitle}
            description={copy.pageDescription}
            align="left"
            tone="brand"
            size="compact"
          />
        </div>
        <form action={logout}>
          <input type="hidden" name="redirectTo" value={dashboardPath} />
          <button className="btn-secondary px-6">{copy.signOut}</button>
        </form>
      </div>

      <div className="flex flex-col gap-12">
        <SurfacePanel
          rounded="3xl"
          className="flex items-center justify-between p-6 md:p-8"
        >
          <div>
            <h2 className="mb-2 text-2xl font-semibold text-stone-800 dark:text-stone-200">
              {copy.welcomeBack},{" "}
              {profile.full_name ? (
                <span className={`${antinoou.className} tracking-wide`}>
                  {profile.full_name}
                </span>
              ) : (
                copy.fallbackStudentName
              )}
              !
            </h2>
            <p className="font-medium text-stone-600 dark:text-stone-400">
              {copy.loggedInAs}{" "}
              <span className="font-bold text-sky-600 dark:text-sky-400">
                {profile.email}
              </span>
            </p>
          </div>
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={copy.avatarAlt}
              className="hidden h-16 w-16 rounded-full border-2 border-white object-cover shadow-sm md:block"
            />
          ) : null}
        </SurfacePanel>

        <AccountSettingsPanel
          canUpdatePassword={canUpdatePassword}
          profile={profile}
          providerLabel={providerLabel}
        />

        <GrammarDashboardOverview
          language={locale}
          lessonSummaries={grammarLessonSummaries}
        />

        <DictionaryFavoritesOverview
          favorites={savedDictionaryEntries}
          language={locale}
        />

        <div className="space-y-8">
          <h3 className="text-2xl font-bold tracking-tight text-stone-800 dark:text-stone-200">
            {copy.recentExercisesTitle}
          </h3>

          {submissions.map((submission) => (
            <SubmissionCard
              key={submission.id}
              language={locale}
              submission={submission}
              topRight={
                submission.status === "reviewed" ? (
                  <SubmissionStatusBadge
                    label={copy.reviewedLabel}
                    tone="reviewed"
                    className="absolute right-0 top-0 rounded-none rounded-bl-xl px-4 py-1.5 text-white dark:text-emerald-200"
                  />
                ) : undefined
              }
            >
              <SubmissionFeedbackPanel language={locale} submission={submission} />
            </SubmissionCard>
          ))}

          {submissions.length === 0 ? (
            <SubmissionEmptyState
              title={copy.noExercisesTitle}
              description={copy.noExercisesDescription}
            />
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}
