"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, GraduationCap, LibraryBig } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function HomePageClient() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col justify-center items-center p-6">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-sky-500/10 dark:bg-sky-900/10 rounded-b-full blur-[120px] -z-10 pointer-events-none transition-colors duration-500" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-900/10 rounded-full blur-[100px] -z-10 pointer-events-none transition-colors duration-500" />

      <div className="max-w-4xl w-full text-center space-y-12 z-10">
        <section className="space-y-4 flex flex-col items-center">
          <div className="relative w-48 h-48 md:w-64 md:h-64 mb-2 transition-transform duration-500 hover:scale-[1.03]">
            <Image
              src="/logo/logo-colored.svg"
              alt="Wannes Portfolio Logo"
              fill
              className="object-contain drop-shadow-2xl dark:drop-shadow-[0_20px_20px_rgba(255,255,255,0.05)]"
              priority
            />
          </div>
          <h1 className="page-title font-coptic">
            {t("home.title")}
          </h1>
          <p className="page-lead max-w-2xl text-lg md:text-2xl">
            {t("home.subtitle")}
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
          <Link
            href="/publications"
            className="group relative h-full rounded-3xl bg-white/70 dark:bg-stone-900/50 backdrop-blur-md border border-stone-200 dark:border-stone-800 p-8 md:p-10 shadow-md dark:shadow-xl dark:shadow-black/20 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col items-center min-h-[280px] overflow-hidden cursor-pointer transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 z-10 text-emerald-600 dark:text-emerald-400">
              <LibraryBig className="h-8 w-8" />
            </div>

            <div className="z-10 flex flex-1 w-full flex-col items-center justify-between">
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold text-stone-800 dark:text-stone-200 text-center">
                  {t("home.publications")}
                </h2>
                <p className="text-stone-500 dark:text-stone-400 text-center leading-7">
                  {t("home.publications.desc")}
                </p>
              </div>

              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {t("home.publications.cta")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>

          <Link
            href="/dictionary"
            className="group relative h-full rounded-3xl bg-white/70 dark:bg-stone-900/50 backdrop-blur-md border border-stone-200 dark:border-stone-800 p-8 md:p-10 shadow-md dark:shadow-xl dark:shadow-black/20 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-sky-500/10 transition-all duration-300 flex flex-col items-center min-h-[280px] overflow-hidden cursor-pointer transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mb-6 z-10 text-sky-600 dark:text-sky-400">
              <BookOpen className="h-8 w-8" />
            </div>

            <div className="z-10 flex flex-1 w-full flex-col items-center justify-between">
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold text-stone-800 dark:text-stone-200 text-center">
                  {t("home.copticDict")}
                </h2>
                <p className="text-stone-500 dark:text-stone-400 text-center leading-7">
                  {t("home.copticDict.desc")}
                </p>
              </div>

              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-400">
                {t("home.dictionary.cta")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>

          <Link
            href="/grammar"
            className="group relative h-full rounded-3xl bg-white/70 dark:bg-stone-900/50 backdrop-blur-md border border-stone-200 dark:border-stone-800 p-8 md:p-10 shadow-md dark:shadow-xl dark:shadow-black/20 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-sky-500/10 transition-all duration-300 flex flex-col items-center min-h-[280px] overflow-hidden cursor-pointer transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mb-6 z-10 text-sky-600 dark:text-sky-400">
              <GraduationCap className="h-8 w-8" />
            </div>

            <div className="z-10 flex flex-1 w-full flex-col items-center justify-between">
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold text-stone-800 dark:text-stone-200 text-center">
                  {t("grammar.title")}
                </h2>
                <p className="text-stone-500 dark:text-stone-400 text-center leading-7">
                  {t("grammar.subtitle")}
                </p>
              </div>

              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-400">
                {t("home.grammar.cta")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </section>

        <section className="mt-16 sm:mt-24 w-full bg-gradient-to-r from-stone-900 to-stone-800 dark:from-stone-950 dark:to-stone-900 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-stone-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/16 rounded-full blur-[90px] pointer-events-none" />

          <div className="text-center md:text-left z-10 flex-1">
            <span className="inline-block px-3 py-1 bg-sky-500/15 border border-sky-400/25 text-sky-300 text-xs font-semibold uppercase tracking-widest rounded-full mb-4">
              {t("home.comingSoon")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-50 [text-shadow:0_1px_2px_rgba(0,0,0,0.55)] mb-3">
              {t("home.app.title")}
            </h2>
            <p className="text-stone-400 text-lg leading-8 max-w-xl mx-auto md:mx-0">
              {t("home.app.desc")}
            </p>
          </div>

          <div className="z-10 flex-shrink-0">
            <div
              className="inline-block opacity-80 cursor-not-allowed hover:opacity-100 transition-opacity duration-300"
              title={t("home.comingSoon")}
            >
              <Image
                src="https://toolbox.marketingtools.apple.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&releaseDate=1276560000&h=7e7b68fad19738b5649a1bfb78ff46e9"
                alt="Download on the App Store"
                width={250}
                height={83}
                className="h-14 w-auto md:h-16 drop-shadow-md"
                unoptimized
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
