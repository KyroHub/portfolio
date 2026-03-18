# Wannes Portfolio & Coptic Dictionary

A modern, high-performance scholarly portfolio housing an advanced digital Coptic-English dictionary and a repository of academic publications. Built meticulously for blazing-fast linguistic analysis.

## 🏛️ Sections

### 1. The Coptic Dictionary (`/dictionary`)
A dedicated fuzzy-search lexicon processing over 3,300 Coptic roots.
- **Intelligent Fuzzy-Search:** The search engine leverages Unicode Normalization (NFD) to separate and ignore combining diacritics (supralinear strokes, jinkims). This allows broad matching across dialects natively.
- **Dialect & Grammatical Bounds:** Implements explicit scholarly stratification. Entries dynamically highlight their Absolute, Nominal (`-`), Pronominal (`=`), and Stative (`†`) morphological states directly inside the user interface.
- **Virtual Coptic Keyboard:** A built-in interactive dashboard ensuring flawless data entry for non-standard Coptic characters and specific combining marks without relying on OS packages.
- **Real-Time Analytics:** A comprehensive visualization dashboard (`/analytics`) powered by Recharts, calculating live data metrics regarding Noun Genders, Parts of Speech, and Dialect combinations.
- **Offline Custom Typography:** Safely bundles the specialized `Antinoou` font locally via `next/font/local` to guarantee impeccable Coptic diacritic shaping.

### 2. My Publications (Coming Soon)
A curated collection of academic works, publications, and ongoing linguistic research papers.

## 🛠️ Tech Stack
- **Framework:** Next.js (React Server Components / App Router)
- **Styling:** Tailwind CSS V4 (Utility-First)
- **Theming:** `next-themes` (System-aware Dark/Light aesthetics)
- **Data Engine:** Statically generated JSON payloads hydrated from custom Excel TS-Node parsers.
- **Visualization:** Recharts

## 🚀 Running Locally
First, clone the repository and install the dependencies:
```bash
git clone https://github.com/Username/wannes-portfolio.git
cd wannes-portfolio
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to experience the application.

## 📄 Licensing

This dual-distribution repository is protected under two separate open-source definitions:

- **Source Code (`MIT License`)**: 
  The Next.js web application architecture, UI components, fuzzy search algorithms, and parser scripts are freely licensed under the standard [MIT License](./LICENSE). Let's build a better internet for Coptic linguistics together.

- **Coptic Dictionary Dataset (`CC-BY 4.0`)**: 
  The raw parsed Lexical JSON data (`public/data/dictionary.json`) is rigorously derived from public morphological studies and licensed under the Creative Commons Attribution 4.0 International License (**CC-BY 4.0**). You are free to share and adapt the material as long as appropriate scholarly credit is explicitly given.
