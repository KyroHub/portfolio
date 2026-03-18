"use client";

import { useLanguage } from "./LanguageProvider";
import { FaXTwitter, FaInstagram, FaGithub } from "react-icons/fa6";

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-white dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 py-8 transition-colors duration-300 mt-auto z-40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-stone-500 dark:text-stone-400 text-center md:text-left">
          &copy; {currentYear} Kyrillos Wannes. {t("footer.rights")}
        </p>
        <div className="flex space-x-6 items-center">
          <a href="https://x.com/kyrilloswannes" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 transition-colors" title="X (Twitter)">
            <span className="sr-only">X (Twitter)</span>
            <FaXTwitter className="h-[22px] w-[22px]" />
          </a>
          <a href="https://www.instagram.com/kyrilloswannes/" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 transition-colors" title="Instagram">
            <span className="sr-only">Instagram</span>
            <FaInstagram className="h-[22px] w-[22px]" />
          </a>
          <a href="https://github.com/KyroHub" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 transition-colors" title="GitHub">
            <span className="sr-only">GitHub</span>
            <FaGithub className="h-[22px] w-[22px]" />
          </a>
        </div>
      </div>
    </footer>
  );
}
