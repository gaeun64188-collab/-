"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import GrantMatcher from "../components/grant-matcher";

export default function GrantsPage() {
  const { lang, setLang } = useLanguage();

  const languageOptions = ["KO", "EN", "JP", "ZH"] as const;
  const languageLabelMap = {
    KO: "한국어",
    EN: "English",
    JP: "日本語",
    ZH: "中文",
  } as const;

  const nextLanguage = () => {
    const currentIndex = languageOptions.indexOf(lang);
    const nextIndex = (currentIndex + 1) % languageOptions.length;
    setLang(languageOptions[nextIndex]);
  };

  return (
    <main className="min-h-screen bg-[#f0fdf4] text-slate-800">
      <header className="bg-emerald-600 text-white shadow-[0_16px_32px_rgba(5,150,105,0.18)]">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-base font-extrabold ring-1 ring-white/20">
                iM
              </div>
              <div className="leading-none">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100">소상공인</div>
                <div className="mt-0.5 text-lg font-extrabold">플랫폼</div>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={nextLanguage}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/15"
              >
                {languageLabelMap[lang]} ▾
              </button>
              <Link
                href="/"
                className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/15"
              >
                홈
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <GrantMatcher
          initialRegion="대구 중구"
          initialBusinessType="음식점업"
          selectedRegion="대구 중구"
          selectedBusinessType="음식점업"
        />
      </div>
    </main>
  );
}
