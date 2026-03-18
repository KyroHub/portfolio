"use client";

import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";

type LanguageBadge = "COP" | "NL" | "ENG";

interface Publication {
  title: string;
  subtitle?: string;
  lang: LanguageBadge;
  image?: string;
  link?: string;
  comingSoon?: boolean;
}

const LANG_COLORS: Record<LanguageBadge, string> = {
  COP: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  NL:  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  ENG: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400 border-sky-200 dark:border-sky-800",
};

const publications: Publication[] = [
  {
    title: "The Holy Bible in Coptic",
    lang: "COP",
    image: "/publications/holy-bible-coptic.png",
    link: "https://www.amazon.com/dp/B0CBSKX4CZ",
    comingSoon: false,
  },
  {
    title: "Inleiding tot het Bohairisch Koptisch: Basisgrammatica.",
    subtitle: "Deel I (3 delen)",
    lang: "NL",
    comingSoon: true,
  },
  {
    title: "Bohairisch–Nederlands Woordenboek: Een Beknopt Lexicon van het Koptisch",
    lang: "NL",
    comingSoon: true,
  },
  {
    title: "Complex Verb Constructions in Coptic: Lexical and Morphological Perspectives from Bohairic and Sahidic",
    lang: "ENG",
    comingSoon: true,
  },
  {
    title: "Parallel Paradigms of Bohairic and Sahidic Coptic",
    lang: "ENG",
    comingSoon: true,
  },
  {
    title: "Tales and Legends: A Bohairic Coptic Reader",
    subtitle: "Vol. I",
    lang: "ENG",
    comingSoon: true,
  },
  {
    title: "Speak with Us: A Coptic Curriculum",
    subtitle: "Translated by Kyrillos Wannes",
    lang: "ENG",
    comingSoon: true,
  },
];

function TileInner({ pub, comingSoonLabel }: { pub: Publication; comingSoonLabel: string }) {
  return (
    <>
      {/* Language Badge */}
      <span className={`absolute top-3 right-3 z-20 text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full border ${LANG_COLORS[pub.lang]}`}>
        {pub.lang}
      </span>

      {/* Decorative underlay — live tiles only */}
      {!pub.comingSoon && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      {/* Book cover area */}
      <div className="relative w-full aspect-[3/4.2] rounded-xl overflow-hidden mb-5 shadow-sm border border-stone-100 dark:border-stone-800 bg-stone-100 dark:bg-stone-900">
        {pub.image ? (
          <Image
            src={pub.image}
            alt={pub.title}
            fill
            className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300 dark:from-stone-800 dark:to-stone-900">
            {/* Simulated blurred page lines */}
            <div className="w-full h-full absolute inset-0 opacity-20 flex flex-col justify-center gap-2 px-6">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="h-2 rounded-full bg-stone-500 blur-sm"
                  style={{ width: `${60 + Math.sin(i) * 30}%` }}
                />
              ))}
            </div>
            {/* Coming Soon overlay badge */}
            <div className="relative z-10 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-stone-200 dark:border-stone-700">
              <span className="text-stone-700 dark:text-stone-300 font-bold text-sm tracking-widest uppercase">
                {comingSoonLabel}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Title & subtitle */}
      <div className="flex flex-col flex-1 justify-end">
        <h2 className="text-base font-bold text-stone-800 dark:text-stone-200 mb-1 z-10 leading-snug line-clamp-3">
          {pub.title}
        </h2>
        {pub.subtitle && (
          <p className="text-stone-500 dark:text-stone-400 text-xs z-10 mb-2 leading-snug">
            {pub.subtitle}
          </p>
        )}
        {pub.link && !pub.comingSoon && (
          <p className="text-stone-500 dark:text-stone-400 text-sm z-10 flex items-center font-medium mt-1">
            Available on Amazon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </p>
        )}
      </div>
    </>
  );
}

function PublicationTile({ pub, comingSoonLabel }: { pub: Publication; comingSoonLabel: string }) {
  const baseClass = "group relative rounded-3xl bg-white/70 dark:bg-stone-900/50 backdrop-blur-md border border-stone-200 dark:border-stone-800 p-5 md:p-6 shadow-md dark:shadow-xl dark:shadow-black/20 transition-all duration-300 flex flex-col justify-between overflow-hidden";

  if (pub.link && !pub.comingSoon) {
    return (
      <a
        href={pub.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-emerald-500/10 cursor-pointer transform hover:-translate-y-1`}
      >
        <TileInner pub={pub} comingSoonLabel={comingSoonLabel} />
      </a>
    );
  }

  return (
    <div className={`${baseClass} opacity-90 cursor-default`}>
      <TileInner pub={pub} comingSoonLabel={comingSoonLabel} />
    </div>
  );
}

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
          {publications.map((pub, i) => (
            <PublicationTile key={i} pub={pub} comingSoonLabel={t("home.comingSoon")} />
          ))}
        </div>

      </div>
    </div>
  );
}
