"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const supportOptions = [
  "대구시 소상공인 창업·경영 지원금",
  "대구 중구 상권 활성화 음식점 지원금",
  "대구소상공인 디지털 전환 지원",
  "수성구 관광·체험형 음식점 지원",
];

const districtOptions = [
  "대구 중구",
  "대구 동구",
  "대구 서구",
  "대구 남구",
  "대구 북구",
  "대구 수성구",
  "대구 달서구",
  "대구 달성군",
];

const usePurposeOptions = [
  "매장 리모델링",
  "대구로페이 홍보/마케팅",
  "신규 장비 도입",
  "임차료/운영자금",
];

export default function GeneratorPage() {
  const { lang, setLang, t } = useLanguage();
  const [selectedSupport, setSelectedSupport] = useState(supportOptions[0]);
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
  const [storeName, setStoreName] = useState("대구 카페 24");
  const [industry, setIndustry] = useState("카페");
  const [district, setDistrict] = useState("대구 중구");
  const [menu, setMenu] = useState("아메리카노, 브런치 세트, 디저트");
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([
    "매장 리모델링",
    "대구로페이 홍보/마케팅",
  ]);
  const [generated, setGenerated] = useState(false);
  const [copyNotice, setCopyNotice] = useState("");
  const [printNotice, setPrintNotice] = useState("");

  const budgetBreakdown = useMemo(() => {
    const base = [
      { label: "마케팅 100만 원", amount: "100만 원" },
      { label: "시설개선 200만 원", amount: "200만 원" },
      { label: "신규 장비 150만 원", amount: "150만 원" },
    ];
    return base;
  }, []);

  const togglePurpose = (purpose: string) => {
    setSelectedPurposes((prev) =>
      prev.includes(purpose)
        ? prev.filter((item) => item !== purpose)
        : [...prev, purpose]
    );
  };

  const handleGenerate = () => {
    setGenerated(true);
    setCopyNotice("");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copiedText);
      setCopyNotice("복사되었습니다");
      setTimeout(() => setCopyNotice(""), 1800);
    } catch (error) {
      setCopyNotice("복사에 실패했습니다");
      setTimeout(() => setCopyNotice(""), 1800);
    }
  };

  const handlePrint = () => {
    setPrintNotice("🖨️ PDF 다운로드를 위해 'PDF로 저장'을 선택해 주세요!");
    window.print();
    setTimeout(() => setPrintNotice(""), 2200);
  };

  const copiedText = `지원 신청 동기 및 사업 개요
- ${selectedSupport} 신청을 통해 ${storeName}의 고객 유입 확대와 매장 경쟁력 강화 목적을 달성하고자 합니다.
- ${industry} 업종 특성상 ${district} 상권의 생활 밀도와 유동인구를 활용해 재방문율을 높이고 지역 상권 활성화에 기여하고자 합니다.

자금 집행 세부 계획
- 대구로페이 홍보/마케팅: 100만 원
- 매장 리모델링 및 인테리어 개선: 200만 원
- 신규 장비 도입: 150만 원

기대 효과
- 매출 증대: 월 평균 매출 15% 상승 기대
- 지역 상권 활성화: 고객 재방문율과 온라인·오프라인 연계 확대
- 상권 경쟁력 강화: 브랜드 인지도와 방문객 체류시간 개선`;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.22),_transparent_26%),linear-gradient(180deg,_#f0fdf4_0%,_#ecfdf5_38%,_#f6fff9_100%)] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="no-print mb-6 rounded-[28px] border border-emerald-200 bg-white/90 p-6 shadow-[0_20px_50px_rgba(16,185,129,0.1)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">AI 사업계획서 생성기</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-950">
                {t.generatorTitle}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={nextLanguage}
                className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100"
              >
                {languageLabelMap[lang]} ▾
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100"
              >
                🏠 {t.home}
              </a>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6 rounded-[28px] border border-emerald-200 bg-white p-6 shadow-[0_20px_50px_rgba(16,185,129,0.08)]">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-sm font-bold text-emerald-800">Step 1</p>
              <h2 className="mt-2 text-xl font-extrabold text-emerald-950">신청할 지원금 선택</h2>
              <select
                value={selectedSupport}
                onChange={(event) => setSelectedSupport(event.target.value)}
                className="mt-3 w-full rounded-xl border border-emerald-200 bg-white px-3 py-3 text-sm font-medium text-emerald-900 outline-none focus:border-emerald-400"
              >
                {supportOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-sm font-bold text-emerald-800">Step 2</p>
              <h2 className="mt-2 text-xl font-extrabold text-emerald-950">내 매장 정보 입력</h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-emerald-900">
                  상호명
                  <input
                    value={storeName}
                    onChange={(event) => setStoreName(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-emerald-200 bg-white px-3 py-3 outline-none focus:border-emerald-400"
                  />
                </label>

                <label className="block text-sm font-medium text-emerald-900">
                  업종
                  <input
                    value={industry}
                    onChange={(event) => setIndustry(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-emerald-200 bg-white px-3 py-3 outline-none focus:border-emerald-400"
                  />
                </label>

                <label className="block text-sm font-medium text-emerald-900 sm:col-span-2">
                  대구시 구/군 선택
                  <select
                    value={district}
                    onChange={(event) => setDistrict(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-emerald-200 bg-white px-3 py-3 outline-none focus:border-emerald-400"
                  >
                    {districtOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-medium text-emerald-900 sm:col-span-2">
                  주력 메뉴/상품
                  <textarea
                    value={menu}
                    onChange={(event) => setMenu(event.target.value)}
                    rows={3}
                    className="mt-2 w-full resize-none rounded-xl border border-emerald-200 bg-white px-3 py-3 outline-none focus:border-emerald-400"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-sm font-bold text-emerald-800">Step 3</p>
              <h2 className="mt-2 text-xl font-extrabold text-emerald-950">지원금 사용 목적 선택</h2>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {usePurposeOptions.map((purpose) => {
                  const checked = selectedPurposes.includes(purpose);
                  return (
                    <label
                      key={purpose}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm font-medium transition ${
                        checked
                          ? 'border-emerald-500 bg-emerald-600 text-white shadow-sm'
                          : 'border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePurpose(purpose)}
                        className="h-4 w-4 accent-emerald-600"
                      />
                      <span>{purpose}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 px-5 py-4 text-lg font-extrabold text-white shadow-[0_16px_35px_rgba(16,185,129,0.25)] transition hover:brightness-105"
            >
              {t.generatorCta}
            </button>
          </section>

          <aside className="print-document rounded-[28px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-6 shadow-[0_20px_50px_rgba(16,185,129,0.08)]">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">생성 결과</p>
            <h2 className="mt-2 text-2xl font-extrabold text-emerald-950">사업계획서 미리보기</h2>

            {!generated ? (
              <div className="mt-5 rounded-2xl border border-dashed border-emerald-200 bg-white/70 p-6 text-sm text-emerald-800/70">
                선택 내용을 입력하고 AI 생성 버튼을 눌러 사업계획서 초안을 확인하세요.
              </div>
            ) : (
              <div className="mt-5 space-y-5">
                <div className="rounded-2xl border border-emerald-200 bg-white p-4">
                  <p className="text-sm font-bold text-emerald-800">1) 지원 신청 동기 및 사업 개요</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {storeName}은 {district}에서 안정적인 고객 기반을 확보하고, {industry} 시장에서 차별화된 경험을 제공하기 위해 {selectedSupport}에 신청합니다.
                    본 사업은 지역 상권의 소비 확장과 매장 경쟁력 강화, 그리고 우수한 서비스 제공을 목표로 합니다.
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-white p-4">
                  <p className="text-sm font-bold text-emerald-800">2) 자금 집행 세부 계획</p>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                    {budgetBreakdown.map((item) => (
                      <li key={item.label} className="flex items-center justify-between gap-3 border-b border-emerald-50 pb-1">
                        <span>{item.label}</span>
                        <span className="font-semibold text-emerald-700">{item.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-white p-4">
                  <p className="text-sm font-bold text-emerald-800">3) 기대 효과</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    이번 지원사업을 통해 매출 증대와 재방문율 상승을 기대하며, 지역 고객 유입 확대와 상권 활성화에 기여할 수 있습니다. 또한 {menu} 중심의 제품 경쟁력을 강화해 매장 운영의 지속성을 높일 수 있습니다.
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-sm font-bold text-emerald-800">참고 문구</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{copiedText}</p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row no-print">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex-1 rounded-xl border border-emerald-200 bg-white px-3 py-3 text-sm font-bold text-emerald-800"
                  >
                    🖨️ 사업계획서 PDF/인쇄
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-xl border border-emerald-200 bg-white px-3 py-3 text-sm font-bold text-emerald-800"
                  >
                    📱 내 핸드폰으로 전송
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex-1 rounded-xl border border-emerald-200 bg-white px-3 py-3 text-sm font-bold text-emerald-800"
                  >
                    📋 텍스트 복사
                  </button>
                </div>

                {copyNotice && (
                  <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-sm font-semibold text-emerald-800">
                    {copyNotice}
                  </div>
                )}

                {printNotice && (
                  <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-center text-sm font-semibold text-amber-800">
                    {printNotice}
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
