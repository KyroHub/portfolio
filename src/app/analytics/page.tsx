"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { LexicalEntry } from "../../../scripts/parseExcel";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/ThemeToggle";

const POS_COLORS = ['#38bdf8', '#34d399', '#f472b6', '#fbbf24', '#a78bfa', '#f87171', '#94a3b8'];
const GENDER_COLORS = ['#38bdf8', '#f472b6', '#34d399', '#94a3b8'];

export default function AnalyticsPage() {
  const [dictionary, setDictionary] = useState<LexicalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDialect, setSelectedDialect] = useState<string>("ALL");
  const { resolvedTheme } = useTheme();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetch('/data/dictionary.json')
      .then(res => res.json())
      .then(data => {
        setDictionary(data);
        setLoading(false);
      });
  }, []);

  const stats = useMemo(() => {
    if (dictionary.length === 0) return null;

    let filteredDict = dictionary;
    if (selectedDialect !== "ALL") {
      filteredDict = dictionary.filter(r => r.dialects[selectedDialect] !== undefined);
    }

    let totalRoots = filteredDict.length;
    let unknownMeaning = 0;
    let uncertainMeaning = 0;

    const posCounts: Record<string, number> = { V: 0, N: 0, ADJ: 0, ADV: 0, CONJ: 0, PREP: 0, INTERJ: 0, OTHER: 0, UNKNOWN: 0 };
    const genderCounts = { M: 0, F: 0, BOTH: 0, UNSPECIFIED: 0 };

    filteredDict.forEach(entry => {
      const mStr = entry.english_meanings.join(' ').toLowerCase();
      if (mStr.includes('meaning unknown')) unknownMeaning++;
      if (mStr.includes('meaning uncertain')) uncertainMeaning++;

      if (posCounts[entry.pos] !== undefined) {
        posCounts[entry.pos]++;
      } else {
        posCounts[entry.pos] = 1;
      }

      if (entry.pos === 'N') {
        if (entry.gender === 'M') genderCounts.M++;
        else if (entry.gender === 'F') genderCounts.F++;
        else if (entry.gender === 'BOTH') genderCounts.BOTH++;
        else genderCounts.UNSPECIFIED++;
      }
    });

    const verbalNouns = posCounts.V || 0;
    const totalNouns = posCounts.N + verbalNouns;
    const totalMasculine = genderCounts.M + verbalNouns;

    // Format for Recharts
    const posChartData = [
      { name: 'Verbs', value: posCounts.V },
      { name: 'Nouns', value: posCounts.N },
      { name: 'Adjectives', value: posCounts.ADJ || 0 },
      { name: 'Adverbs', value: posCounts.ADV || 0 },
      { name: 'Conjunctions', value: posCounts.CONJ || 0 },
      { name: 'Prepositions', value: posCounts.PREP || 0 },
      { name: 'Other', value: (posCounts.OTHER || 0) + (posCounts.INTERJ || 0) }
    ].filter(d => d.value > 0);

    const genderChartData = [
      { name: 'Masculine (explicit)', value: genderCounts.M },
      { name: 'Feminine', value: genderCounts.F },
      { name: 'Epicene (Both)', value: genderCounts.BOTH },
      { name: 'Unspecified', value: genderCounts.UNSPECIFIED }
    ].filter(d => d.value > 0);

    return { totalRoots, unknownMeaning, uncertainMeaning, posChartData, genderChartData, verbalNouns, totalNouns, totalMasculine, posCounts, genderCounts };
  }, [dictionary, selectedDialect]);

  if (!mounted || loading || !stats) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="w-10 h-10 border-4 border-stone-200 dark:border-stone-700 border-t-sky-500 rounded-full animate-spin"></div>
      </main>
    );
  }

  const isDark = resolvedTheme === "dark";

  const calcPct = (num: number, total: number) => total > 0 ? ((num / total) * 100).toFixed(1) + '%' : '0.0%';

  return (
    <main className="min-h-screen relative overflow-hidden pb-32 pt-16 px-6">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-emerald-500/10 dark:bg-emerald-900/10 rounded-b-full blur-[120px] -z-10 pointer-events-none transition-colors duration-500"></div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center text-stone-600 dark:text-stone-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors bg-white/50 dark:bg-stone-900/50 px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-800 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dictionary Search
            </Link>
            <ThemeToggle />
          </div>

          {/* Dialect Filter */}
          <div className="flex items-center space-x-3 bg-white/60 dark:bg-stone-900/60 backdrop-blur-md border border-stone-200 dark:border-stone-700 rounded-xl p-2 px-4 shadow-sm">
            <span className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest whitespace-nowrap">Filter Analytics:</span>
            <select className="bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-md text-sm p-1.5 focus:ring-sky-500 text-sky-600 dark:text-sky-400 outline-none font-bold cursor-pointer" value={selectedDialect} onChange={e => setSelectedDialect(e.target.value)}>
              <option value="ALL">All Dialects</option>
              <option value="S">Sahidic (S)</option>
              <option value="B">Bohairic (B)</option>
              <option value="A">Akhmimic (A)</option>
              <option value="sA">Sub-Sahidic (sA)</option>
              <option value="F">Fayyumic (F)</option>
            </select>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-tr from-emerald-500 to-sky-600 dark:from-emerald-400 dark:to-sky-400 bg-clip-text text-transparent mb-10 pb-2">
          Dictionary Analytics
        </h1>

        {/* Global Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-md rounded-2xl border border-stone-200 dark:border-stone-800 p-6 flex flex-col justify-center shadow-sm dark:shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl"></div>
            <h3 className="text-stone-500 dark:text-stone-400 font-semibold text-sm uppercase tracking-widest mb-1">Total Roots</h3>
            <p className="text-5xl font-bold text-stone-800 dark:text-stone-200">{stats.totalRoots.toLocaleString()}</p>
          </div>
          <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-md rounded-2xl border border-stone-200 dark:border-stone-800 p-6 flex flex-col justify-center shadow-sm dark:shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl"></div>
            <h3 className="text-stone-500 dark:text-stone-400 font-semibold text-sm uppercase tracking-widest mb-1">Meaning Unknown</h3>
            <p className="text-4xl font-bold text-sky-600 dark:text-sky-400">{stats.unknownMeaning.toLocaleString()}</p>
          </div>
          <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-md rounded-2xl border border-stone-200 dark:border-stone-800 p-6 flex flex-col justify-center shadow-sm dark:shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl"></div>
            <h3 className="text-stone-500 dark:text-stone-400 font-semibold text-sm uppercase tracking-widest mb-1">Meaning Uncertain</h3>
            <p className="text-4xl font-bold text-sky-600/70 dark:text-sky-400/70">{stats.uncertainMeaning.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* POS Breakdown Chart Section */}
          <div className="bg-white/50 dark:bg-stone-900/50 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm dark:shadow-lg flex flex-col h-full">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-300 border-b border-stone-200 dark:border-stone-800 pb-3 mb-6">Part of Speech Breakdown</h2>
            <div className="h-[300px] w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    contentStyle={{ backgroundColor: isDark ? '#1c1917' : '#ffffff', borderColor: isDark ? '#292524' : '#e5e5e5', borderRadius: '12px', color: isDark ? '#e7e5e4' : '#1c1917' }} 
                    itemStyle={{ color: isDark ? '#e7e5e4' : '#1c1917' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Pie
                    data={stats.posChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1200}
                  >
                    {stats.posChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={POS_COLORS[index % POS_COLORS.length]} stroke={isDark ? "rgba(0,0,0,0)" : "#ffffff"} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Noun Gender Chart Section */}
          <div className="bg-white/50 dark:bg-stone-900/50 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm dark:shadow-lg flex flex-col h-full">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-300 border-b border-stone-200 dark:border-stone-800 pb-3 mb-6">Noun Genders <span className="text-lg font-normal text-stone-500">({stats.totalNouns} Total)</span></h2>
            <div className="h-[300px] w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    contentStyle={{ backgroundColor: isDark ? '#1c1917' : '#ffffff', borderColor: isDark ? '#292524' : '#e5e5e5', borderRadius: '12px', color: isDark ? '#e7e5e4' : '#1c1917' }} 
                    itemStyle={{ color: isDark ? '#e7e5e4' : '#1c1917' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Pie
                    data={stats.genderChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={1200}
                  >
                    {stats.genderChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} stroke={isDark ? "rgba(0,0,0,0)" : "#ffffff"} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-auto px-4 py-3 bg-stone-50 dark:bg-stone-950/40 rounded-xl border border-stone-200 dark:border-stone-800/50 shadow-sm">
               <li className="flex justify-between items-center text-sm text-sky-600 dark:text-sky-400 mb-2 list-none">
                 <span>Verbal Nouns (All Verbs)</span> 
                 <span className="font-bold">+{stats.verbalNouns} <span className="opacity-70 font-normal ml-2">({calcPct(stats.verbalNouns, stats.totalNouns)})</span></span>
               </li>
               <div className="w-full h-px bg-stone-300 dark:bg-stone-800 my-2"></div>
               <div className="flex justify-between text-stone-700 dark:text-stone-300 font-bold">
                 <span>Total Masculine Concept</span>
                 <span>{stats.totalMasculine}</span>
               </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
