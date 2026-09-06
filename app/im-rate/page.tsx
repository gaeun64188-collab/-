"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const rateBenefits = [
  { label: "대구로페이 가맹점 우대", value: "-0.2%p", detail: "가맹점 등록 및 정산계좌 연동 시" },
  { label: "AI 상권분석 리포트 활용 매장", value: "-0.2%p", detail: "리포트 기반 매장 운영 전략 반영" },
  { label: "iM뱅크 자동이체 계좌 등록", value: "-0.1%p", detail: "사업자 계좌 자동이체 등록 시" },
];

const loanOptions = [5000, 8000, 12000, 20000];

export default function ImRatePage() {
  const [selectedLoan, setSelectedLoan] = useState(5000);

  const annualSavings = useMemo(() => {
    const baseRate = 0.005;
    const totalSavings = selectedLoan * 10000 * baseRate * 1;
    return totalSavings;
  }, [selectedLoan]);

  const totalSavingsText = annualSavings >= 250000 ? "연간 이자 약 25만 원 절감!" : `연간 이자 약 ${Math.round(annualSavings / 10000).toLocaleString()}천 원 절감!`;

  return (
    <main className="min-h-screen bg-[#edf8ef] px-4 py-8 text-slate-800">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50">
            ← 메인으로
          </Link>
          <div className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm">
            iM 우대금리
          </div>
        </div>

        <section className="overflow-hidden rounded-[30px] border border-emerald-100 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 px-6 py-8 text-white md:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-50/80">소상공인 금융 인센티브</p>
            <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">iM뱅크 우대금리 혜택 한눈에 보기</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50 md:text-base">
              대구로페이, AI 상권분석, 자동이체 조건을 충족하면 최대 <span className="font-extrabold">-0.5%p</span>까지 금리 혜택을 받을 수 있습니다.
            </p>
          </div>

          <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">조건별 금리 감면 체크리스트</h2>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">최대 -0.5%p</div>
              </div>

              <div className="space-y-4">
                {rateBenefits.map((benefit, index) => (
                  <div key={benefit.label} className="rounded-[22px] border border-emerald-100 bg-emerald-50/60 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-black text-white">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-base font-bold text-slate-800">{benefit.label}</div>
                          <div className="mt-1 text-sm text-slate-600">{benefit.detail}</div>
                        </div>
                      </div>
                      <div className="rounded-full bg-white px-3 py-1 text-sm font-extrabold text-emerald-700 ring-1 ring-emerald-100">
                        {benefit.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[26px] border border-emerald-200 bg-gradient-to-r from-emerald-600 to-green-500 p-5 text-white shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-100">총 우대금리</div>
                    <div className="mt-2 text-3xl font-black">-0.5%p</div>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-emerald-50 ring-1 ring-white/20">
                    연간 이자 절감 최대치
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-emerald-100 bg-emerald-50/50 p-5 shadow-inner">
              <h2 className="text-xl font-bold text-slate-900">실시간 이자 절감 계산기</h2>

              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-600">대출금액</span>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {loanOptions.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setSelectedLoan(amount)}
                        className={`rounded-2xl border px-3 py-2 text-sm font-bold transition ${
                          selectedLoan === amount
                            ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                            : "border-emerald-200 bg-white text-emerald-700 hover:border-emerald-300"
                        }`}
                      >
                        {amount.toLocaleString()}만
                      </button>
                    ))}
                  </div>
                </label>

                <div className="rounded-[24px] border border-emerald-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>기존 금리 기준</span>
                    <span className="font-semibold text-slate-700">연 4.5%</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                    <span>우대금리 적용</span>
                    <span className="font-semibold text-emerald-700">연 4.0%</span>
                  </div>

                  <div className="mt-5 h-3 overflow-hidden rounded-full bg-emerald-100">
                    <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-emerald-500 to-green-400" />
                  </div>

                  <div className="mt-5 rounded-2xl bg-emerald-600 p-4 text-white">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-100">절감 효과</div>
                    <div className="mt-2 text-2xl font-black">{totalSavingsText}</div>
                    <div className="mt-1 text-sm text-emerald-50">{selectedLoan.toLocaleString()}만 원 기준, 연간 이자 부담이 줄어듭니다.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-4 rounded-[28px] border border-emerald-100 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">신청 바로가기</p>
            <h3 className="mt-2 text-2xl font-extrabold text-slate-900">iM뱅크 모바일 앱에서 우대대출 신청</h3>
          </div>
          <a
            href="https://www.imbank.co.kr/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500"
          >
            iM뱅크 모바일 앱 / iM샵 우대대출 신청 연결
          </a>
        </section>
      </div>
    </main>
  );
}
