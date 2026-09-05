"use client";

import { useState } from "react";
import AIConsultant from "../components/ai-consultant";
import { useLanguage } from "../context/LanguageContext";

const summaryCards = [
  {
    icon: "💰",
    label: "이번 달 누적 매출",
    value: "1,420만 원",
    meta: "전월 대비 +8.5%",
  },
  {
    icon: "💳",
    label: "대구로페이 결제 정산액",
    value: "385만 원",
    meta: "수수료 0% 절감 혜택 적용",
  },
  {
    icon: "🏦",
    label: "iM뱅크 이자 감면 혜택",
    value: "월 12.5만 원 절감 중",
    meta: "우대금리 0.5%p",
  },
  {
    icon: "⏰",
    label: "다음 주 정산 예정 금액",
    value: "128만 원",
    meta: "iM뱅크 계좌 자동 입금 예정",
  },
];

const weeklyBars = [42, 58, 49, 68, 72, 81, 90];

export default function DashboardPage() {
  const { lang, setLang, t } = useLanguage();
  const [isAiOpen, setIsAiOpen] = useState(false);
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

  const handleConsultRequest = () => {
    setIsAiOpen(true);
  };

  const handleDownloadReport = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_26%),linear-gradient(180deg,_#f0fdf4_0%,_#ecfdf5_35%,_#f8fffb_100%)] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <header className="mx-auto mb-6 flex max-w-6xl items-center justify-between gap-4 rounded-[28px] border border-emerald-200 bg-white/85 px-5 py-4 shadow-[0_12px_30px_rgba(16,185,129,0.08)] backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <a href="/" className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100">
            ← {t.home}
          </a>
          <button
            type="button"
            onClick={nextLanguage}
            className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
          >
            {languageLabelMap[lang]} ▾
          </button>
        </div>

        <a
          href="/generator"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
        >
          {t.dashboardGenerate}
        </a>
      </header>

      <div className="mx-auto max-w-6xl">
        <section className="rounded-[32px] border border-emerald-200 bg-white/80 p-6 shadow-[0_30px_80px_rgba(16,185,129,0.10)] backdrop-blur-sm sm:p-8 lg:p-10">
          <div className="flex flex-col gap-3 border-b border-emerald-100 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                정산 & 금융 현황
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-emerald-950 sm:text-4xl">
                {t.dashboardTitle}
              </h1>
            </div>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
              2026년 09월 기준
            </div>
          </div>

          <p className="mt-5 max-w-3xl text-base text-slate-600 sm:text-lg">
            {t.dashboardSubtitle}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className="rounded-[24px] border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-5 shadow-[0_18px_40px_rgba(16,185,129,0.06)]"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-2xl">{card.icon}</span>
                  <span className="rounded-full border border-emerald-200 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                    Live
                  </span>
                </div>
                <p className="text-sm text-slate-600">{card.label}</p>
                <p className="mt-3 text-2xl font-bold tracking-[-0.04em] text-emerald-950">{card.value}</p>
                <p className="mt-2 text-sm font-medium text-emerald-700">{card.meta}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-emerald-200 bg-white p-6 shadow-[0_18px_40px_rgba(16,185,129,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">
                  매출 패턴
                </p>
                <h2 className="mt-2 text-2xl font-bold text-emerald-950">주간/월간 매출 패턴 & 대구로페이 비중</h2>
              </div>
              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                대구로페이 비중 28%
              </div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
              <div className="rounded-[24px] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5">
                <div className="mb-4 flex items-center justify-between text-sm text-slate-600">
                  <span>이번 주 카드 결제 추이</span>
                  <span className="font-semibold text-emerald-700">+12.4%</span>
                </div>
                <div className="flex h-44 items-end gap-3">
                  {weeklyBars.map((height, index) => (
                    <div key={index} className="flex flex-1 flex-col items-center justify-end gap-2">
                      <div
                        className={`w-full rounded-t-2xl ${index === weeklyBars.length - 1 ? "bg-gradient-to-t from-emerald-600 to-emerald-400" : "bg-gradient-to-t from-emerald-500 to-emerald-300"}`}
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-[10px] font-medium text-slate-500">{["월", "화", "수", "목", "금", "토", "일"][index]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-5">
                <p className="mb-4 text-sm font-medium text-slate-600">결제 수단 비중</p>
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-[conic-gradient(#10b981_0_28%,#d1fae5_28%_60%,#bbf7d0_60%_100%)] shadow-inner">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-center">
                    <div>
                      <div className="text-xl font-bold text-emerald-800">28%</div>
                      <div className="text-[10px] text-slate-500">대구로페이</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> 대구로페이</span>
                    <span className="font-semibold text-emerald-700">28%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-200" /> 카드/기타</span>
                    <span className="font-semibold text-slate-700">72%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-emerald-200 bg-white p-6 shadow-[0_18px_40px_rgba(16,185,129,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">
              iM뱅크 금융 대시보드
            </p>
            <h2 className="mt-2 text-2xl font-bold text-emerald-950">
              대구시 소상공인 경영안정 자금 (iM뱅크 연계)
            </h2>

            <div className="mt-6 rounded-[24px] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>대출 잔액</span>
                <span className="font-semibold text-emerald-700">2,400만 / 3,000만 원</span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-emerald-100">
                <div className="h-full w-[80%] rounded-full bg-gradient-to-r from-emerald-500 to-green-400" />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                <span>상환 일정</span>
                <span className="font-semibold text-slate-700">8개월 남음</span>
              </div>
            </div>

            <div className="mt-6 rounded-[20px] border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-900">💡 혜택 강조</p>
              <p className="mt-2 text-sm leading-6 text-emerald-800">
                "대구로페이 가맹점 유지로 이번 달 이자 차액 0.5%p 추가 보전 적용 완료!"
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">월 이자</p>
                <p className="mt-2 text-2xl font-bold text-emerald-950">42만 원</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">우대 적용</p>
                <p className="mt-2 text-2xl font-bold text-emerald-950">-12.5만</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-4 rounded-[28px] border border-emerald-200 bg-white/80 p-6 shadow-[0_18px_40px_rgba(16,185,129,0.06)] sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleDownloadReport}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500"
          >
            📄 이번 달 매출/정산 보고서 PDF 다운로드
          </button>

          <button
            type="button"
            onClick={handleConsultRequest}
            className="inline-flex items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100"
          >
            💬 iM뱅크 추가 우대 금리 상담 신청하기
          </button>
        </section>
      </div>

      <AIConsultant
        open={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        initialPrompt="대구 중구 카페 사장님입니다. iM뱅크 추가 우대 금리와 대구로페이 유지 조건을 확인하고 싶어요."
      />
    </main>
  );
}
