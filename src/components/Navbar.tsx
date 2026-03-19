"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "./LanguageProvider";

export function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { href: "/publications", label: t("nav.publications") },
    { href: "/dictionary", label: t("nav.dictionary") },
    { href: "/grammar", label: t("nav.grammar") },
    { href: "/contact", label: t("nav.contact") },
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

          {/* Toggles and Mobile Hamburger */}
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <LanguageToggle />
            <button
              className="md:hidden p-2 ml-1 text-stone-600 dark:text-stone-400 focus:outline-none hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-stone-200 dark:border-stone-800 flex flex-col space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-semibold tracking-wide px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40" 
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-900/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

      </div>
    </header>
  );
}
