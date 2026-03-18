"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";

export default function GlobalLandingPage() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col justify-center items-center p-6">
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-sky-500/10 dark:bg-sky-900/10 rounded-b-full blur-[120px] -z-10 pointer-events-none transition-colors duration-500"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-900/10 rounded-full blur-[100px] -z-10 pointer-events-none transition-colors duration-500"></div>

      <div className="max-w-4xl w-full text-center space-y-12 z-10">
        
        {/* Title and Logo */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 flex flex-col items-center">
          <div className="relative w-48 h-48 md:w-64 md:h-64 mb-2 hover:scale-105 transition-transform duration-500">
            <Image 
              src="/logo/logo-colored.svg" 
              alt="Wannes Portfolio Logo" 
              fill 
              className="object-contain drop-shadow-2xl dark:drop-shadow-[0_20px_20px_rgba(255,255,255,0.05)]" 
              priority
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-tr from-stone-800 to-stone-500 dark:from-stone-100 dark:to-stone-400 bg-clip-text text-transparent drop-shadow-sm font-coptic z-10">
            {t("home.title")}
          </h1>
          <p className="text-lg md:text-2xl text-stone-500 dark:text-stone-400 font-medium max-w-2xl mx-auto z-10">
            {t("home.subtitle")}
          </p>
        </div>

        {/* Global Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          
          {/* My Publications Section */}
          <Link href="/publications" prefetch={false} className="group relative rounded-3xl bg-white/70 dark:bg-stone-900/50 backdrop-blur-md border border-stone-200 dark:border-stone-800 p-8 md:p-12 shadow-md dark:shadow-xl dark:shadow-black/20 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] overflow-hidden cursor-pointer transform hover:-translate-y-1">
             {/* Decorative underlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 z-10 text-emerald-600 dark:text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-200 mb-4 z-10 text-center">
              {t("home.publications")}
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-center z-10 max-w-sm">
              {t("home.publications.desc")}
            </p>
          </Link>

          {/* Coptic Dictionary Link */}
          <Link href="/dictionary" prefetch={false} className="group relative rounded-3xl bg-white/70 dark:bg-stone-900/50 backdrop-blur-md border border-stone-200 dark:border-stone-800 p-8 md:p-12 shadow-md dark:shadow-xl dark:shadow-black/20 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-sky-500/10 transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] overflow-hidden cursor-pointer transform hover:-translate-y-1">
             {/* Decorative underlay */}
             <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mb-6 z-10 text-sky-600 dark:text-sky-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-200 mb-4 z-10 text-center">
              {t("home.copticDict")}
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-center z-10 max-w-sm">
              {t("home.copticDict.desc")}
            </p>
          </Link>

          {/* Coptic Grammar Link */}
          <Link href="/grammar" prefetch={false} className="group relative rounded-3xl bg-white/70 dark:bg-stone-900/50 backdrop-blur-md border border-stone-200 dark:border-stone-800 p-8 md:p-12 shadow-md dark:shadow-xl dark:shadow-black/20 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-sky-500/10 transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] overflow-hidden cursor-pointer transform hover:-translate-y-1">
             {/* Decorative underlay */}
             <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mb-6 z-10 text-sky-600 dark:text-sky-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-200 mb-4 z-10 text-center">
              {t("grammar.title")}
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-center z-10 max-w-sm">
              {t("grammar.subtitle")}
            </p>
          </Link>

        </div>
      </div>
    </main>
  );
}
