"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "framer-motion";
import { ChevronRight, CheckCircle2, ArrowDown } from "lucide-react";

const steps = [
  {
    badge: "STEP 01",
    titleKey: "guideStep1",
    description:
      "대구시 8개 구·군 및 업종별 검색을 통해 내 매장에 꼭 맞는 지원금과 iM뱅크 특례보증 상품을 실시간 탐색합니다.",
    image: "🎯",
    color: "from-emerald-500 to-teal-600",
  },
  {
    badge: "STEP 02",
    titleKey: "guideStep2",
    description:
      "간단한 매장 정보 입력만으로 대구시 제출 양식에 맞는 사업계획서와 필수 제출 서류 목록을 AI가 자동 생성해 드립니다.",
    image: "📄",
    color: "from-teal-500 to-cyan-600",
  },
  {
    badge: "STEP 03",
    titleKey: "guideStep3",
    description:
      "대구로페이 가맹점 등록과 iM뱅크 계좌 연동으로 대출 우대 금리(최대 0.5%p) 및 결제 수수료 감면 혜택을 누리세요.",
    image: "💳",
    color: "from-cyan-500 to-blue-600",
  },
];

// ease 속성 배열 뒤에 as const 추가하여 TypeScript 타입 지정
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as const },
};

export default function GuidePage() {
  const { lang, setLang, t } = useLanguage();
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
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-white to-emerald-50/20 text-slate-800 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Sticky Header */}
      <header className="fixed top-0 z-50 w-full border-b border-emerald-100/50 bg-white/70 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-extrabold shadow-lg shadow-emerald-200">
                iM
              </div>
              <div className="hidden sm:block leading-none">
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/70">SME PLATFORM</div>
                <div className="mt-0.5 text-lg font-black tracking-tight text-slate-900">소상공인 플랫폼</div>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={nextLanguage}
                className="rounded-full border border-emerald-100 bg-white/50 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
              >
                {languageLabelMap[lang]}
              </button>
              <Link
                href="/"
                className="hidden rounded-full bg-slate-900 px-5 py-2 text-sm font-bold text-white transition hover:bg-slate-800 sm:block"
              >
                {t.home}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-20 text-center">
        <motion.div {...fadeInUp} className="max-w-4xl">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold tracking-tight text-emerald-700">
            {t.navGuide}
          </span>
          <h1 className="mt-8 text-5xl font-black leading-[1.1] text-slate-900 md:text-7xl lg:text-8xl">
            {t.guideTitle}
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed text-slate-500 md:text-xl">
            {t.guideSubtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Scroll Down</span>
            <ArrowDown className="h-5 w-5 animate-bounce text-emerald-500" />
          </div>
        </motion.div>
      </section>

      {/* Steps Section - Long Vertical Scroll */}
      <div className="mx-auto max-w-5xl px-4 pb-40 space-y-40 md:space-y-64">
        {steps.map((step, index) => (
          <motion.section
            key={step.badge}
            {...fadeInUp}
            className={`flex flex-col items-center gap-12 ${
              index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
            } md:justify-between`}
          >
            <div className="w-full max-w-lg space-y-6 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <span className={`inline-flex h-8 items-center rounded-full bg-gradient-to-r ${step.color} px-4 text-xs font-black text-white`}>
                  {step.badge}
                </span>
                <div className="h-px flex-1 bg-emerald-100" />
              </div>
              
              <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                {t[step.titleKey as keyof typeof t]}
              </h2>
              
              <p className="text-lg leading-relaxed text-slate-600 md:text-xl">
                {step.description}
              </p>

              <div className="flex items-center justify-center md:justify-start gap-2 pt-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="font-bold text-slate-400">iM뱅크 소상공인 지원 시스템</span>
              </div>
            </div>

            <div className="relative group w-full max-w-sm">
              <div className={`absolute -inset-4 rounded-[40px] bg-gradient-to-br ${step.color} opacity-10 blur-2xl transition duration-500 group-hover:opacity-20`} />
              <div className="relative flex aspect-square items-center justify-center rounded-[32px] border border-white/50 bg-white/40 shadow-2xl backdrop-blur-xl transition duration-500 group-hover:scale-105">
                <span className="text-9xl filter drop-shadow-2xl">{step.image}</span>
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-4 pb-40">
        <motion.div {...fadeInUp} className="rounded-[40px] bg-white p-8 shadow-2xl shadow-emerald-100/50 md:p-16">
          <h2 className="text-center text-3xl font-black text-slate-900 md:text-4xl">{t.faqTitle}</h2>
          <div className="mt-12 space-y-4">
            {[
              {
                q: "대구시 소상공인 지원금은 누구나 신청할 수 있나요?",
                a: "대구광역시 내 사업자등록이 되어 있는 소상공인이라면 업종 및 조건에 따라 신청 가능합니다.",
              },
              {
                q: "iM뱅크 우대 금리는 어떻게 받나요?",
                a: "대구신용보증재단 특례보증 이용 및 대구로페이 정산 계좌를 iM뱅크로 지정 시 추가 금리 우대가 적용됩니다.",
              },
            ].map((item, idx) => (
              <details
                key={idx}
                className="group rounded-2xl border border-slate-100 bg-slate-50/50 p-6 transition-all open:bg-white open:ring-1 open:ring-emerald-500/20"
              >
                <summary className="cursor-pointer list-none text-lg font-bold text-slate-800">
                  {item.q}
                </summary>
                <p className="mt-4 leading-relaxed text-slate-500">{item.a}</p>
              </details>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-slate-900 px-4 py-24 text-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-emerald-500 blur-3xl" />
          <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-blue-500 blur-3xl" />
        </div>
        
        <motion.div {...fadeInUp} className="relative z-10 mx-auto max-w-2xl">
          <h2 className="text-3xl font-black text-white md:text-5xl">
            지금 바로 시작해 보세요
          </h2>
          <p className="mt-6 text-lg font-medium text-slate-400">
            대구 소상공인을 위한 모든 금융 혜택을 <br className="hidden md:block" /> 한 곳에서 관리할 수 있습니다.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-8 py-5 text-lg font-black text-white transition hover:bg-emerald-400 sm:w-auto"
            >
              {t.guideCTA}
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="bg-slate-900 border-t border-white/5 py-12 px-4 text-center">
        <p className="text-sm font-medium text-slate-500">
          © 2024 iM Bank Small Business Platform. All rights reserved.
        </p>
      </footer>
    </main>
  );
}