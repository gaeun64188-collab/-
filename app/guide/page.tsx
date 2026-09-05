"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

const steps = [
  {
    badge: "STEP 1",
    titleKey: "guideStep1",
    description:
      "대구시 8개 구·군 및 업종별 검색을 통해 내 매장에 꼭 맞는 지원금과 iM뱅크 특례보증 상품을 실시간 탐색합니다.",
  },
  {
    badge: "STEP 2",
    titleKey: "guideStep2",
    description:
      "간단한 매장 정보 입력만으로 대구시 제출 양식에 맞는 사업계획서와 필수 제출 서류 목록을 AI가 자동 생성해 드립니다.",
  },
  {
    badge: "STEP 3",
    titleKey: "guideStep3",
    description:
      "대구로페이 가맹점 등록과 iM뱅크 계좌 연동으로 대출 우대 금리(최대 0.5%p) 및 결제 수수료 감면 혜택을 누리세요.",
  },
];

const faqs = [
  {
    question: "대구시 소상공인 지원금은 누구나 신청할 수 있나요?",
    answer:
      "대구광역시 내 사업자등록이 되어 있는 소상공인이라면 업종 및 조건에 따라 신청 가능합니다.",
  },
  {
    question: "iM뱅크 우대 금리는 어떻게 받나요?",
    answer:
      "대구신용보증재단 특례보증 이용 및 대구로페이 정산 계좌를 iM뱅크로 지정 시 추가 금리 우대가 적용됩니다.",
  },
];

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
                {t.home}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[28px] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700 ring-1 ring-emerald-100">
              {t.navGuide}
            </span>
            <h1 className="mt-5 text-3xl font-bold text-slate-900 md:text-5xl">
              {t.guideTitle}
            </h1>
            <p className="mt-4 text-base text-slate-600 md:text-lg">
              {t.guideSubtitle}
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.badge}
                className="rounded-[24px] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm"
              >
                <span className="inline-flex rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                  {step.badge}
                </span>
                <h2 className="mt-5 text-xl font-bold text-slate-900">{t[step.titleKey as keyof typeof t]}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[28px] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-slate-900">{t.faqTitle}</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((item, index) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 open:bg-white open:shadow-sm"
                open={index === 0}
              >
                <summary className="cursor-pointer list-none text-base font-semibold text-slate-800">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">A: {item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-10 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-emerald-500"
          >
            {t.guideCTA}
          </Link>
        </div>
      </div>
    </main>
  );
}
