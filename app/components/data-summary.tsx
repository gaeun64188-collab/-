"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

type DistrictPct = { name: string; pct: number };

type Props = {
  region?: string;
  districtPercents?: DistrictPct[]; // if omitted, fallback static
  payRate?: number; // percent 0-100
};

export default function DataSummary({ region = "대구 중구", districtPercents, payRate = 28 }: Props) {
  const { lang } = useLanguage();
  const [todayLabel, setTodayLabel] = useState("");

  useEffect(() => {
    const formatToday = () => {
      const now = new Date();
      const date = now.toLocaleDateString(lang === "KO" ? "ko-KR" : lang === "EN" ? "en-US" : lang === "JP" ? "ja-JP" : "zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const weekday = now.toLocaleDateString(undefined, { weekday: "long" });
      setTodayLabel(`${date} · ${weekday}`);
    };

    formatToday();

    // schedule update at next midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow.getTime() - now.getTime() + 1000;
    const timer = window.setTimeout(() => {
      formatToday();
      // re-register daily
      window.setInterval(formatToday, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    return () => {
      window.clearTimeout(timer);
    };
  }, [lang]);

  const titleMap: Record<string, string> = {
    KO: "대구시 상권 요약",
    EN: "Daegu District Summary",
    JP: "大邱市 商圏サマリー",
    ZH: "大邱市 商圈摘要",
  };

  const payLabelMap: Record<string, string> = {
    KO: "대구로페이 결제 비중",
    EN: "DaeguPay usage",
    JP: "大邱ローペイ 利用比率",
    ZH: "大邱Pay 支付占比",
  };

  const fallbackDistricts: DistrictPct[] = [
    { name: "중구", pct: 28 },
    { name: "수성구", pct: 24 },
    { name: "달서구", pct: 18 },
    { name: "북구", pct: 16 },
    { name: "동구", pct: 14 },
  ];

  const list = districtPercents && districtPercents.length ? districtPercents : fallbackDistricts;

  return (
    <div className="mt-6 rounded-3xl bg-white p-6 border border-emerald-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-bold text-gray-900">{titleMap[lang]}</h4>
        <div className="text-sm text-slate-500">{region} · {todayLabel}</div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <div className="text-xs font-semibold text-slate-500">구·군별 유동인구 비율</div>
          <div className="mt-3 space-y-3">
            {list.map((d) => (
              <div key={d.name} className="flex items-center gap-3">
                <div className="min-w-[56px] text-sm font-medium text-slate-700">{d.name}</div>
                <div className="flex-1">
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-emerald-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400"
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                </div>
                <div className="shrink-0">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded-md">{d.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-500">{payLabelMap[lang]}</div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1">
              <div className="h-3.5 w-full overflow-hidden rounded-full bg-emerald-100">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400" style={{ width: `${payRate}%` }} />
              </div>
              <div className="mt-2 text-sm text-slate-600">{payRate}%</div>
            </div>

            <div className="w-32 rounded-lg bg-emerald-50 p-2 text-center text-sm font-semibold text-emerald-700">
              {lang === "KO" ? "상세보기" : lang === "EN" ? "Details" : lang === "JP" ? "詳細" : "详情"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
