import React from 'react';

const COPTIC_LETTERS = [
  "ⲁ", "ⲃ", "ⲅ", "ⲇ", "ⲉ", "ⲋ", "ⲍ", "ⲏ", "ⲑ", "ⲓ", "ⲕ", "ⲗ", "ⲙ", 
  "ⲛ", "ⲝ", "ⲟ", "ⲡ", "ⲣ", "ⲥ", "ⲧ", "ⲩ", "ⲫ", "ⲭ", "ⲯ", "ⲱ", 
  "ϣ", "ϥ", "ϧ", "ϩ", "ϫ", "ϭ", "ϯ"
];

// Provide diacritics separately for ease of use
const DIACRITICS = [
  { char: "\u0300", label: "̀  (Jinkim)" },
  { char: "\u0304", label: "̄  (Stroke)" },
  { char: "\u0308", label: "̈  (Diaeresis)" }
];

interface CopticKeyboardProps {
  onAppend: (char: string) => void;
  onBackspace: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function CopticKeyboard({ onAppend, onBackspace, isOpen, onClose }: CopticKeyboardProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-0 z-50 w-full md:w-[600px] bg-white/95 dark:bg-stone-900/90 backdrop-blur-xl border border-stone-200 dark:border-stone-700/80 rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-stone-600 dark:text-stone-300 font-semibold text-sm tracking-widest uppercase">Virtual Keyboard</h3>
        <button onClick={onClose} className="text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-8 gap-2 mb-4">
        {COPTIC_LETTERS.map(char => (
          <button
            key={char}
            onClick={() => onAppend(char)}
            className="h-12 flex items-center justify-center font-coptic text-2xl text-stone-700 dark:text-stone-200 bg-stone-100/80 dark:bg-stone-800/80 hover:bg-sky-100 dark:hover:bg-sky-600/50 hover:text-sky-700 dark:hover:text-white rounded-lg border border-stone-200 dark:border-stone-700 transition-colors shadow-sm active:scale-95"
          >
            {char}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-2">
        {DIACRITICS.map(d => (
          <button
            key={d.label}
            onClick={() => onAppend(d.char)}
            className="flex-1 h-10 flex items-center justify-center font-coptic text-lg text-stone-700 dark:text-stone-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg border border-emerald-200 dark:border-emerald-900/50 transition-colors active:scale-95"
            title="Combine with previous letter"
          >
            <span className="opacity-50 mr-1">◌</span>{d.char} <span className="text-xs font-sans font-medium text-emerald-600 dark:text-emerald-500/80 ml-2">{d.label.replace(d.char, '').trim()}</span>
          </button>
        ))}
        
        <button
          onClick={onBackspace}
          className="flex flex-col flex-1 h-10 items-center justify-center text-sm font-semibold text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-lg border border-rose-200 dark:border-rose-900/50 transition-colors active:scale-95"
          aria-label="Backspace"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
          </svg>
        </button>
      </div>
      <div className="flex">
         <button
          onClick={() => onAppend(" ")}
          className="w-full h-10 flex items-center justify-center font-semibold text-sm tracking-widest text-stone-600 dark:text-stone-400 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 rounded-lg border border-stone-300 dark:border-stone-700 transition-colors active:scale-95 uppercase"
        >
          Space
        </button>
      </div>
    </div>
  );
}
