"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Filter } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useTheme } from "next-themes";
import type { AnalyticsSnapshotMap } from "@/features/analytics/lib/analytics";
import { FormLabel } from "@/components/FormField";
import { useLanguage } from "@/components/LanguageProvider";
import { PageHeader } from "@/components/PageHeader";
import { PageShell, pageShellAccents } from "@/components/PageShell";
import { SurfacePanel } from "@/components/SurfacePanel";
import { cx } from "@/lib/classes";
import {
  type AnalyticsDialect,
  dialectFilterOptions,
  getDialectFilterOptionLabel,
} from "@/features/dictionary/config";

const POS_COLORS = ["#38bdf8", "#34d399", "#f472b6", "#fbbf24", "#a78bfa", "#f87171", "#94a3b8"];
const GENDER_COLORS = ["#38bdf8", "#f472b6", "#34d399", "#94a3b8"];
const FILTER_SELECT_CLASS_NAME =
  "select-base h-auto cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-sky-600 dark:text-sky-400";
const CHART_LEGEND_STYLE = {
  fontSize: "12px",
  paddingTop: "20px",
} satisfies CSSProperties;
const LIGHT_TOOLTIP_STYLE = {
  backgroundColor: "#ffffff",
  borderColor: "#e5e5e5",
  borderRadius: "12px",
  color: "#1c1917",
} satisfies CSSProperties;
const DARK_TOOLTIP_STYLE = {
  backgroundColor: "#1c1917",
  borderColor: "#292524",
  borderRadius: "12px",
  color: "#e7e5e4",
} satisfies CSSProperties;

type AnalyticsStatCardProps = {
  accentClassName: string;
  title: string;
  value: string;
  valueClassName?: string;
};

type AnalyticsChartCardProps = {
  children: ReactNode;
  footer?: ReactNode;
  title: ReactNode;
};

function AnalyticsStatCard({
  accentClassName,
  title,
  value,
  valueClassName = "text-5xl font-bold text-stone-800 dark:text-stone-200",
}: AnalyticsStatCardProps) {
  return (
    <SurfacePanel
      rounded="3xl"
      variant="subtle"
      shadow="soft"
      className="relative overflow-hidden p-6"
    >
      <div className={cx("absolute -right-4 -top-4 h-24 w-24 rounded-full blur-2xl", accentClassName)} />
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-widest text-stone-500 dark:text-stone-400">
        {title}
      </h3>
      <p className={valueClassName}>{value}</p>
    </SurfacePanel>
  );
}

function AnalyticsChartCard({
  children,
  footer,
  title,
}: AnalyticsChartCardProps) {
  return (
    <SurfacePanel
      rounded="3xl"
      shadow="soft"
      className="flex h-full flex-col p-6"
    >
      <h2 className="mb-6 border-b border-stone-200 pb-3 text-2xl font-bold text-stone-800 dark:border-stone-800 dark:text-stone-300">
        {title}
      </h2>
      {children}
      {footer}
    </SurfacePanel>
  );
}

type AnalyticsPageClientProps = {
  snapshots: AnalyticsSnapshotMap;
};

export default function AnalyticsPageClient({ snapshots }: AnalyticsPageClientProps) {
  const [selectedDialect, setSelectedDialect] = useState<AnalyticsDialect>("ALL");
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();
  const stats = snapshots[selectedDialect] ?? snapshots.ALL;
  const isThemeReady = resolvedTheme !== undefined;
  const isDark = resolvedTheme === "dark";
  const calcPct = (num: number, total: number) => (total > 0 ? `${((num / total) * 100).toFixed(1)}%` : "0.0%");
  const tooltipContentStyle = isDark ? DARK_TOOLTIP_STYLE : LIGHT_TOOLTIP_STYLE;
  const tooltipItemStyle = {
    color: isDark ? "#e7e5e4" : "#1c1917",
  } satisfies CSSProperties;
  const chartCellStroke = isDark ? "rgba(0,0,0,0)" : "#ffffff";
  const chartPlaceholder = (
    <div className="h-full w-full rounded-2xl bg-stone-100/70 dark:bg-stone-900/40" />
  );

  return (
    <PageShell
      className="min-h-screen px-6 pb-32 pt-16"
      contentClassName="max-w-6xl mx-auto"
      accents={[
        pageShellAccents.heroEmeraldArc,
        pageShellAccents.topRightSkyOrbInset,
      ]}
    >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dictionary" className="btn-secondary gap-2 px-4">
              <ArrowLeft className="h-4 w-4" />
              {t("analytics.back")}
            </Link>
          </div>

          <SurfacePanel
            variant="subtle"
            shadow="soft"
            className="flex items-center space-x-3 rounded-2xl p-3 px-4 dark:border-stone-700"
          >
            <span className="inline-flex items-center gap-2 whitespace-nowrap text-stone-500 dark:text-stone-400">
              <Filter className="h-4 w-4" />
              <FormLabel tone="muted">{t("analytics.filter")}</FormLabel>
            </span>
            <select
              className={FILTER_SELECT_CLASS_NAME}
              value={selectedDialect}
              onChange={(e) => setSelectedDialect(e.target.value as AnalyticsDialect)}
            >
              {dialectFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {getDialectFilterOptionLabel(option.value, t)}
                </option>
              ))}
            </select>
          </SurfacePanel>
        </div>

        <PageHeader
          title={t("analytics.title")}
          align="left"
          size="compact"
          tone="analytics"
          className="mb-10"
        />

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <AnalyticsStatCard
            accentClassName="bg-sky-500/10"
            title={t("analytics.totalRoots")}
            value={stats.totalRoots.toLocaleString()}
          />
          <AnalyticsStatCard
            accentClassName="bg-yellow-500/10"
            title={t("analytics.meaningUnknown")}
            value={stats.unknownMeaning.toLocaleString()}
            valueClassName="text-4xl font-bold text-sky-600 dark:text-sky-400"
          />
          <AnalyticsStatCard
            accentClassName="bg-rose-500/10"
            title={t("analytics.meaningUncertain")}
            value={stats.uncertainMeaning.toLocaleString()}
            valueClassName="text-4xl font-bold text-sky-600/70 dark:text-sky-400/70"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <AnalyticsChartCard title={t("analytics.posBreakdown")}>
            <div className="h-[300px] w-full mb-6">
              {isThemeReady ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip contentStyle={tooltipContentStyle} itemStyle={tooltipItemStyle} />
                    <Legend wrapperStyle={CHART_LEGEND_STYLE} />
                    <Pie data={stats.posChartData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3} dataKey="value" animationBegin={0} animationDuration={1200}>
                      {stats.posChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={POS_COLORS[index % POS_COLORS.length]} stroke={chartCellStroke} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                chartPlaceholder
              )}
            </div>
          </AnalyticsChartCard>

          <AnalyticsChartCard
            title={
              <>
                {t("analytics.nounGenders")}{" "}
                <span className="text-lg font-normal text-stone-500">
                  ({stats.totalNouns} {t("analytics.total")})
                </span>
              </>
            }
            footer={
              <div className="mt-auto rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 shadow-sm dark:border-stone-800/50 dark:bg-stone-950/40">
                <li className="mb-2 flex list-none items-center justify-between text-sm text-sky-600 dark:text-sky-400">
                  <span>{t("analytics.verbalNouns")}</span>
                  <span className="font-bold">
                    +{stats.verbalNouns}{" "}
                    <span className="ml-2 font-normal opacity-70">
                      ({calcPct(stats.verbalNouns, stats.totalNouns)})
                    </span>
                  </span>
                </li>
                <div className="my-2 h-px w-full bg-stone-300 dark:bg-stone-800"></div>
                <div className="flex justify-between font-bold text-stone-700 dark:text-stone-300">
                  <span>{t("analytics.totalMasculine")}</span>
                  <span>{stats.totalMasculine}</span>
                </div>
              </div>
            }
          >
            <div className="h-[300px] w-full mb-6">
              {isThemeReady ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip contentStyle={tooltipContentStyle} itemStyle={tooltipItemStyle} />
                    <Legend wrapperStyle={CHART_LEGEND_STYLE} />
                    <Pie data={stats.genderChartData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3} dataKey="value" animationBegin={200} animationDuration={1200}>
                      {stats.genderChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} stroke={chartCellStroke} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                chartPlaceholder
              )}
            </div>
          </AnalyticsChartCard>
        </div>
    </PageShell>
  );
}
