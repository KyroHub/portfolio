"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Filter } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useTheme } from "next-themes";
import type { AnalyticsDialect, AnalyticsSnapshotMap } from "@/lib/analytics";
import { useLanguage } from "@/components/LanguageProvider";

const POS_COLORS = ["#38bdf8", "#34d399", "#f472b6", "#fbbf24", "#a78bfa", "#f87171", "#94a3b8"];
const GENDER_COLORS = ["#38bdf8", "#f472b6", "#34d399", "#94a3b8"];

type AnalyticsPageClientProps = {
  snapshots: AnalyticsSnapshotMap;
};

export default function AnalyticsPageClient({ snapshots }: AnalyticsPageClientProps) {
  const [selectedDialect, setSelectedDialect] = useState<AnalyticsDialect>("ALL");
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const stats = snapshots[selectedDialect] ?? snapshots.ALL;
  const isDark = mounted && resolvedTheme === "dark";
  const calcPct = (num: number, total: number) => (total > 0 ? `${((num / total) * 100).toFixed(1)}%` : "0.0%");
  const chartPlaceholder = (
    <div className="h-full w-full rounded-2xl bg-stone-100/70 dark:bg-stone-900/40" />
  );

  return (
    <main className="min-h-screen relative overflow-hidden pb-32 pt-16 px-6">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-emerald-500/10 dark:bg-emerald-900/10 rounded-b-full blur-[120px] -z-10 pointer-events-none transition-colors duration-500"></div>
      <div className="absolute top-20 right-[-10%] w-[420px] h-[420px] bg-sky-500/10 dark:bg-sky-900/10 rounded-full blur-[100px] -z-10 pointer-events-none transition-colors duration-500"></div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dictionary" className="btn-secondary gap-2 px-4">
              <ArrowLeft className="h-4 w-4" />
              {t("analytics.back")}
            </Link>
          </div>

          <div className="flex items-center space-x-3 bg-white/60 dark:bg-stone-900/60 backdrop-blur-md border border-stone-200 dark:border-stone-700 rounded-2xl p-3 px-4 shadow-sm">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest whitespace-nowrap">
              <Filter className="h-4 w-4" />
              {t("analytics.filter")}
            </span>
            <select className="bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-sky-500/30 text-sky-600 dark:text-sky-400 outline-none cursor-pointer" value={selectedDialect} onChange={(e) => setSelectedDialect(e.target.value as AnalyticsDialect)}>
              <option value="ALL">{t("dialect.ALL")}</option>
              <option value="S">{t("dialect.S")} (S)</option>
              <option value="B">{t("dialect.B")} (B)</option>
              <option value="A">{t("dialect.A")} (A)</option>
              <option value="L">{t("dialect.L")} (L)</option>
              <option value="F">{t("dialect.F")} (F)</option>
            </select>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-tr from-emerald-500 to-sky-600 dark:from-emerald-400 dark:to-sky-400 bg-clip-text text-transparent mb-10 pb-2">
          {t("analytics.title")}
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-md rounded-3xl border border-stone-200 dark:border-stone-800 p-6 flex flex-col justify-center shadow-sm dark:shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl"></div>
            <h3 className="text-stone-500 dark:text-stone-400 font-semibold text-sm uppercase tracking-widest mb-1">{t("analytics.totalRoots")}</h3>
            <p className="text-5xl font-bold text-stone-800 dark:text-stone-200">{stats.totalRoots.toLocaleString()}</p>
          </div>
          <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-md rounded-3xl border border-stone-200 dark:border-stone-800 p-6 flex flex-col justify-center shadow-sm dark:shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl"></div>
            <h3 className="text-stone-500 dark:text-stone-400 font-semibold text-sm uppercase tracking-widest mb-1">{t("analytics.meaningUnknown")}</h3>
            <p className="text-4xl font-bold text-sky-600 dark:text-sky-400">{stats.unknownMeaning.toLocaleString()}</p>
          </div>
          <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-md rounded-3xl border border-stone-200 dark:border-stone-800 p-6 flex flex-col justify-center shadow-sm dark:shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl"></div>
            <h3 className="text-stone-500 dark:text-stone-400 font-semibold text-sm uppercase tracking-widest mb-1">{t("analytics.meaningUncertain")}</h3>
            <p className="text-4xl font-bold text-sky-600/70 dark:text-sky-400/70">{stats.uncertainMeaning.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white/50 dark:bg-stone-900/50 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm dark:shadow-lg flex flex-col h-full">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-300 border-b border-stone-200 dark:border-stone-800 pb-3 mb-6">{t("analytics.posBreakdown")}</h2>
            <div className="h-[300px] w-full mb-6">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip contentStyle={{ backgroundColor: isDark ? "#1c1917" : "#ffffff", borderColor: isDark ? "#292524" : "#e5e5e5", borderRadius: "12px", color: isDark ? "#e7e5e4" : "#1c1917" }} itemStyle={{ color: isDark ? "#e7e5e4" : "#1c1917" }} />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} />
                    <Pie data={stats.posChartData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3} dataKey="value" animationBegin={0} animationDuration={1200}>
                      {stats.posChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={POS_COLORS[index % POS_COLORS.length]} stroke={isDark ? "rgba(0,0,0,0)" : "#ffffff"} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                chartPlaceholder
              )}
            </div>
          </div>

          <div className="bg-white/50 dark:bg-stone-900/50 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm dark:shadow-lg flex flex-col h-full">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-300 border-b border-stone-200 dark:border-stone-800 pb-3 mb-6">{t("analytics.nounGenders")} <span className="text-lg font-normal text-stone-500">({stats.totalNouns} {t("analytics.total")})</span></h2>
            <div className="h-[300px] w-full mb-6">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip contentStyle={{ backgroundColor: isDark ? "#1c1917" : "#ffffff", borderColor: isDark ? "#292524" : "#e5e5e5", borderRadius: "12px", color: isDark ? "#e7e5e4" : "#1c1917" }} itemStyle={{ color: isDark ? "#e7e5e4" : "#1c1917" }} />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} />
                    <Pie data={stats.genderChartData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3} dataKey="value" animationBegin={200} animationDuration={1200}>
                      {stats.genderChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} stroke={isDark ? "rgba(0,0,0,0)" : "#ffffff"} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                chartPlaceholder
              )}
            </div>

            <div className="mt-auto px-4 py-3 bg-stone-50 dark:bg-stone-950/40 rounded-2xl border border-stone-200 dark:border-stone-800/50 shadow-sm">
              <li className="flex justify-between items-center text-sm text-sky-600 dark:text-sky-400 mb-2 list-none">
                <span>{t("analytics.verbalNouns")}</span>
                <span className="font-bold">+{stats.verbalNouns} <span className="opacity-70 font-normal ml-2">({calcPct(stats.verbalNouns, stats.totalNouns)})</span></span>
              </li>
              <div className="w-full h-px bg-stone-300 dark:bg-stone-800 my-2"></div>
              <div className="flex justify-between text-stone-700 dark:text-stone-300 font-bold">
                <span>{t("analytics.totalMasculine")}</span>
                <span>{stats.totalMasculine}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
