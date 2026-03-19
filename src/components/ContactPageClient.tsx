"use client";

import { useActionState } from "react";
import { ArrowRight, Mail, MessageSquare, User } from "lucide-react";
import { sendContactEmail, type ContactFormState } from "@/actions/contact";
import { useLanguage } from "@/components/LanguageProvider";

const inquiryOptions = [
  "contact.option.dictionary",
  "contact.option.grammar",
  "contact.option.research",
  "contact.option.publication",
  "contact.option.general",
] as const;

export default function ContactPageClient() {
  const { t } = useLanguage();
  const [state, formAction, isPending] = useActionState<ContactFormState | null, FormData>(
    sendContactEmail,
    null
  );

  return (
    <div className="min-h-screen relative overflow-hidden px-6 py-16 md:px-10">
      <div className="absolute top-0 left-0 w-[420px] h-[420px] bg-sky-500/10 dark:bg-sky-900/10 rounded-full blur-[120px] -z-10 pointer-events-none transition-colors duration-500" />
      <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-emerald-500/10 dark:bg-emerald-900/10 rounded-full blur-[120px] -z-10 pointer-events-none transition-colors duration-500" />

      <div className="max-w-3xl mx-auto pt-8">
        <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-tr from-sky-600 to-emerald-500 dark:from-sky-400 dark:to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
            {t("contact.title")}
          </h1>
          <p className="text-lg md:text-xl text-stone-500 dark:text-stone-400 font-medium max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        <form
          action={formAction}
          className="space-y-8 bg-white/70 dark:bg-stone-900/50 backdrop-blur-md border border-stone-200 dark:border-stone-800 rounded-3xl p-8 md:p-10 shadow-md dark:shadow-xl dark:shadow-black/20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150"
        >
          <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                {t("contact.name")}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500" size={20} />
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  className="w-full rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-950/70 py-3 pl-12 pr-4 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                  placeholder={t("contact.namePlaceholder")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                {t("contact.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500" size={20} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  className="w-full rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-950/70 py-3 pl-12 pr-4 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                  placeholder={t("contact.emailPlaceholder")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="inquiryType" className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
              {t("contact.inquiry")}
            </label>
            <select
              id="inquiryType"
              name="inquiryType"
              required
              defaultValue=""
              className="w-full rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-950/70 py-3 px-4 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            >
              <option value="" disabled>
                {t("contact.select")}
              </option>
              {inquiryOptions.map((optionKey) => {
                const optionLabel = t(optionKey);
                return (
                  <option key={optionKey} value={optionLabel}>
                    {optionLabel}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
              {t("contact.message")}
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 text-stone-400 dark:text-stone-500" size={20} />
              <textarea
                id="message"
                name="message"
                required
                rows={7}
                className="w-full rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-950/70 py-3 pl-12 pr-4 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 resize-y"
                placeholder={t("contact.messagePlaceholder")}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-2xl bg-sky-600 hover:bg-sky-500 disabled:bg-sky-600/70 text-white font-semibold py-4 px-6 flex items-center justify-center gap-3 transition-colors shadow-sm"
          >
            {isPending ? t("contact.sending") : t("contact.send")}
            <ArrowRight size={20} />
          </button>

          {state?.success && (
            <p className="text-center font-medium text-emerald-700 dark:text-emerald-400">
              {t("contact.success")}
            </p>
          )}

          {state?.error && (
            <p className="text-center font-medium text-red-700 dark:text-red-400">
              {state.error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
