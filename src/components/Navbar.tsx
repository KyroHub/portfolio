"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "./LanguageProvider";

export function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const links = [
    { href: "/publications", label: t("nav.publications") },
    { href: "/dictionary", label: t("nav.dictionary") },
    { href: "/grammar", label: t("nav.grammar") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-stone-950/70 border-b border-stone-200 dark:border-stone-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Home Link */}
          {pathname === "/" ? (
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image 
                  src="/logo/logo-colored.svg" 
                  alt="Wannes Logo" 
                  fill 
                  className="object-contain drop-shadow" 
                  priority
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-stone-800 to-stone-500 dark:from-stone-100 dark:to-stone-400 bg-clip-text text-transparent font-coptic">
                {t("nav.home")}
              </span>
            </div>
          ) : (
            <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105">
              <div className="relative w-10 h-10">
                <Image 
                  src="/logo/logo-colored.svg" 
                  alt="Wannes Logo" 
                  fill 
                  className="object-contain drop-shadow" 
                  priority
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-stone-800 to-stone-500 dark:from-stone-100 dark:to-stone-400 bg-clip-text text-transparent font-coptic">
                {t("nav.home")}
              </span>
            </Link>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold tracking-wide transition-colors duration-200 ${
                    isActive 
                      ? "text-sky-600 dark:text-sky-400" 
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Toggles */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>

        </div>
      </div>
    </header>
  );
}
