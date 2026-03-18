"use client";

import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";

export default function PublicationsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center p-6 md:p-10">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-900/10 rounded-full blur-[120px] -z-10 pointer-events-none transition-colors duration-500"></div>

      <div className="max-w-5xl w-full space-y-12 z-10 pt-10">
        
        {/* Header */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-tr from-stone-800 to-stone-500 dark:from-stone-100 dark:to-stone-400 bg-clip-text text-transparent drop-shadow-sm mb-4">
            {t("nav.publications")}
          </h1>
          <p className="text-lg md:text-xl text-stone-500 dark:text-stone-400 font-medium max-w-2xl mx-auto">
            {t("home.publications.desc")}
          </p>
        </div>

        {/* Publications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          
          {/* Holy Bible in Coptic Tile */}
          <a href="https://www.amazon.com/dp/B0CBSKX4CZ" target="_blank" rel="noopener noreferrer" className="group relative rounded-3xl bg-white/70 dark:bg-stone-900/50 backdrop-blur-md border border-stone-200 dark:border-stone-800 p-5 md:p-6 shadow-md dark:shadow-xl dark:shadow-black/20 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer transform hover:-translate-y-1">
             {/* Decorative underlay */}
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

             <div className="relative w-full aspect-[3/4.2] rounded-xl overflow-hidden mb-5 shadow-sm border border-stone-100 dark:border-stone-800 bg-stone-100 dark:bg-stone-950">
               <Image 
                 src="/publications/holy-bible-coptic.png" 
                 alt="Holy Bible in Coptic Cover" 
                 fill 
                 className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
               />
             </div>
             <div className="flex flex-col flex-1 justify-end">
               <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200 mb-2 z-10 line-clamp-2 leading-tight">
                 The Holy Bible in Coptic
               </h2>
               <p className="text-stone-500 dark:text-stone-400 text-sm z-10 flex items-center font-medium">
                 Available on Amazon
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                 </svg>
               </p>
             </div>
          </a>

        </div>

      </div>
    </div>
  );
}
