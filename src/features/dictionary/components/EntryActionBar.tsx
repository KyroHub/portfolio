"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Flag, Heart, Loader2, MessageSquareText } from "lucide-react";
import {
  submitEntryReport,
  type EntryReportActionState,
} from "@/actions/dictionaryEntryActions";
import { AuthGatedActionButton } from "@/components/AuthGatedActionButton";
import { FormField } from "@/components/FormField";
import { useLanguage } from "@/components/LanguageProvider";
import { StatusNotice } from "@/components/StatusNotice";
import { cx } from "@/lib/classes";
import { type TranslationKey } from "@/lib/i18n";
import { useOptionalAuthGate } from "@/lib/supabase/useOptionalAuthGate";
import type { Language } from "@/types/i18n";
import type { LexicalEntry } from "@/features/dictionary/types";
import {
  ENTRY_REPORT_MAX_COMMENTARY_LENGTH,
  ENTRY_REPORT_MIN_COMMENTARY_LENGTH,
  ENTRY_REPORT_REASONS,
  type EntryFavoriteErrorCode,
  type EntryReportReason,
} from "../lib/entryActions";
import { useEntryFavorite } from "../lib/useEntryFavorite";

type EntryActionBarProps = {
  entry: LexicalEntry;
};

type ActionNotice = {
  message: string;
  tone: "error" | "success";
} | null;

const ENTRY_REPORT_REASON_LABEL_KEYS: Record<EntryReportReason, TranslationKey> = {
  typo: "entry.actions.reason.typo",
  translation: "entry.actions.reason.translation",
  grammar: "entry.actions.reason.grammar",
  relation: "entry.actions.reason.relation",
  other: "entry.actions.reason.other",
};

const ENTRY_FAVORITE_ERROR_LABEL_KEYS: Record<
  EntryFavoriteErrorCode,
  TranslationKey
> = {
  "load-failed": "entry.actions.favoriteError.loadFailed",
  "not-configured": "entry.actions.favoriteError.notConfigured",
  unavailable: "entry.actions.favoriteError.unavailable",
  "update-failed": "entry.actions.favoriteError.updateFailed",
};

function EntryReportPanel({
  entry,
  language,
  onClose,
  onSubmitted,
}: {
  entry: LexicalEntry;
  language: Language;
  onClose: () => void;
  onSubmitted: Dispatch<SetStateAction<ActionNotice>>;
}) {
  const { t } = useLanguage();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState<
    EntryReportActionState,
    FormData
  >(submitEntryReport, null);

  useEffect(() => {
    if (!state?.success || !state.message) {
      return;
    }

    formRef.current?.reset();
    onSubmitted({
      message: state.message,
      tone: "success",
    });
    onClose();
  }, [onClose, onSubmitted, state?.message, state?.success]);

  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50/85 p-5 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/35">
      <div className="mb-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-stone-800 dark:text-stone-200">
          <MessageSquareText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          {t("entry.actions.reportTitle")}
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600 dark:text-stone-400">
          {t("entry.actions.reportDescription")}
        </p>
      </div>

      <form ref={formRef} action={formAction} className="space-y-4">
        <input type="hidden" name="entryId" value={entry.id} />
        <input type="hidden" name="language" value={language} />

        <div className="grid gap-4 md:grid-cols-[minmax(0,15rem)_1fr]">
          <FormField
            htmlFor={`entry-report-reason-${entry.id}`}
            label={t("entry.actions.reasonLabel")}
            labelTone="muted"
          >
            <select
              id={`entry-report-reason-${entry.id}`}
              name="reason"
              defaultValue=""
              required
              className="select-base h-11 rounded-xl text-sm"
            >
              <option value="" disabled>
                {t("entry.actions.reasonPlaceholder")}
              </option>
              {ENTRY_REPORT_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {t(ENTRY_REPORT_REASON_LABEL_KEYS[reason])}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            htmlFor={`entry-report-commentary-${entry.id}`}
            label={t("entry.actions.commentaryLabel")}
            labelTone="muted"
          >
            <textarea
              id={`entry-report-commentary-${entry.id}`}
              name="commentary"
              required
              minLength={ENTRY_REPORT_MIN_COMMENTARY_LENGTH}
              maxLength={ENTRY_REPORT_MAX_COMMENTARY_LENGTH}
              rows={5}
              className="textarea-base min-h-[8rem] resize-y rounded-2xl text-sm leading-6"
              placeholder={t("entry.actions.commentaryPlaceholder")}
            />
          </FormField>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-stone-500 dark:text-stone-400">
            {t("entry.actions.commentaryHint")}
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-ghost" onClick={onClose}>
              {t("entry.actions.cancelReport")}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary gap-2 px-5"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Flag className="h-4 w-4" />
              )}
              {isPending
                ? t("entry.actions.submittingReport")
                : t("entry.actions.submitReport")}
            </button>
          </div>
        </div>

        {state?.error ? (
          <StatusNotice tone="error" align="left">
            {state.error}
          </StatusNotice>
        ) : null}
      </form>
    </div>
  );
}

export function EntryActionBar({ entry }: EntryActionBarProps) {
  const { language, t } = useLanguage();
  const authGate = useOptionalAuthGate();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportNotice, setReportNotice] = useState<ActionNotice>(null);
  const {
    errorCode,
    isFavorited,
    isLoading,
    isPending,
    pendingAction,
    toggleFavorite,
  } = useEntryFavorite(entry.id, authGate.user?.id ?? null);

  const lockedMessage = authGate.authAvailable
    ? t("entry.actions.loginPrompt")
    : t("entry.actions.authUnavailable");
  const favoriteErrorMessage = errorCode
    ? t(ENTRY_FAVORITE_ERROR_LABEL_KEYS[errorCode])
    : null;
  const isReportPanelVisible = authGate.isAuthenticated && isReportOpen;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400">
            {t("entry.actions.eyebrow")}
          </p>
          <p className="text-sm leading-6 text-stone-600 dark:text-stone-400">
            {t("entry.actions.description")}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <AuthGatedActionButton
            className={cx(
              "btn-secondary gap-2 px-4",
              (isLoading || isPending) && "opacity-70",
              isFavorited &&
                "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/25 dark:text-rose-300 dark:hover:bg-rose-950/40",
            )}
            disabled={isLoading || isPending}
            isAuthenticated={authGate.isAuthenticated}
            isReady={authGate.isReady}
            lockedMessage={lockedMessage}
            onClick={() => {
              setReportNotice(null);
              void toggleFavorite();
            }}
          >
            {isLoading || isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart className={cx("h-4 w-4", isFavorited && "fill-current")} />
            )}
            {isLoading
              ? t("entry.actions.favoriteLoading")
              : isPending
              ? pendingAction === "remove"
                ? t("entry.actions.favoriteRemoving")
                : t("entry.actions.favoriteSaving")
              : isFavorited
                ? t("entry.actions.favorited")
                : t("entry.actions.favorite")}
          </AuthGatedActionButton>

          <AuthGatedActionButton
            className={cx(
              "btn-secondary gap-2 px-4",
              isReportOpen &&
                "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/25 dark:text-amber-300 dark:hover:bg-amber-950/40",
            )}
            isAuthenticated={authGate.isAuthenticated}
            isReady={authGate.isReady}
            lockedMessage={lockedMessage}
            onClick={() => {
              setReportNotice(null);
              setIsReportOpen((current) => !current);
            }}
          >
            <Flag className="h-4 w-4" />
            {isReportPanelVisible
              ? t("entry.actions.reportClose")
              : t("entry.actions.report")}
          </AuthGatedActionButton>
        </div>
      </div>

      {favoriteErrorMessage ? (
        <StatusNotice tone="error" align="left">
          {favoriteErrorMessage}
        </StatusNotice>
      ) : null}

      {reportNotice ? (
        <StatusNotice tone={reportNotice.tone} align="left">
          {reportNotice.message}
        </StatusNotice>
      ) : null}

      {isReportPanelVisible ? (
        <EntryReportPanel
          entry={entry}
          language={language}
          onClose={() => setIsReportOpen(false)}
          onSubmitted={setReportNotice}
        />
      ) : null}
    </div>
  );
}
