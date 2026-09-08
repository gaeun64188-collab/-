"use client";

import React, { useState } from "react";

export default function GlobalSupportModal({
  open,
  onClose,
  lang,
  setLang,
}: {
  open: boolean;
  onClose: () => void;
  lang: "KO" | "EN" | "JP" | "ZH";
  setLang: (next: "KO" | "EN" | "JP" | "ZH") => void;
}) {
  const [active, setActive] = useState<1 | 2 | 3>(1);
  const [visaType, setVisaType] = useState("F-2");
  const [policySummary, setPolicySummary] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [menuTranslations, setMenuTranslations] = useState<{ en?: string; jp?: string; zh?: string } | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);


  const ui: Record<string, any> = {
    KO: {
      title: "Global Merchant Support (글로벌 소상공인 AI 지원)",
      tabs: [
        "지원금·대출 가이드",
        "다국어 메뉴·마케팅",
        "세무·법률 자문",
      ],
      visaLabel: "비자 유형",
      summarize: "모국어 3줄 요약",
      productLabel: "상품명 입력",
      generateMenu: "메뉴판 이미지 생성",
      questionLabel: "질문 입력",
      ask: "질문하기",
      close: "닫기",
      langSelectLabel: "언어",
    },
    EN: {
      title: "Global Merchant Support",
      tabs: ["AI Subsidy & Loan Guide", "Multilingual Marketing & Menu", "Global AI Legal & Tax Advisor"],
      visaLabel: "Visa Type",
      summarize: "3-line native summary",
      productLabel: "Enter product name",
      generateMenu: "Generate menu image",
      questionLabel: "Ask your question",
      ask: "Ask",
      close: "Close",
      langSelectLabel: "Language",
    },
    JP: {
      title: "Global Merchant Support",
      tabs: ["助成金・ローン案内", "多言語メニュー・マーケ", "AI 法務・税務アドバイザー"],
      visaLabel: "ビザ種別",
      summarize: "母国語で3行要約",
      productLabel: "商品名を入力",
      generateMenu: "メニュー画像を生成",
      questionLabel: "質問を入力",
      ask: "質問する",
      close: "閉じる",
      langSelectLabel: "言語",
    },
    ZH: {
      title: "Global Merchant Support",
      tabs: ["补贴与贷款指南", "多语言菜单与营销", "AI 法务/税务顾问"],
      visaLabel: "签证类型",
      summarize: "母语三行摘要",
      productLabel: "输入商品名称",
      generateMenu: "生成菜单图片",
      questionLabel: "请输入问题",
      ask: "提问",
      close: "关闭",
      langSelectLabel: "语言",
    },
  };

  const L = ui[lang] ?? ui.EN;

  const handleSummarize = () => {
    // placeholder: simulate a 3-line summary in the user's language
    const summaries: Record<string, string> = {
      KO: "• 지원금 A: 조건 충족 시 신청 가능\n• 지원금 B: 소상공인 전용, 제출서류 필요\n• 대출: iM뱅크 우대금리 안내",
      EN: "• Policy A: Eligible for certain visa holders\n• Policy B: SME-targeted grants; docs required\n• Loan: iM Bank preferential rates",
      JP: "• 支援A: 一部ビザ保持者が申請可能\n• 支援B: 中小向け、書類必要\n• ローン: iM銀行優遇金利",
      ZH: "• 政策A: 某些签证持有人可申请\n• 政策B: 面向中小商户，需提交材料\n• 贷款: iM银行优惠利率",
    };
    setPolicySummary(summaries[lang] ?? summaries.EN);
  };

  const [translating, setTranslating] = useState(false);

  if (!open) return null;

  const handleTranslateMenu = async () => {
    if (!productName) return;
    setTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: productName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMenuTranslations({ en: "", jp: "", zh: "" });
      } else {
        setMenuTranslations({ en: data.en || "", jp: data.jp || "", zh: data.zh || "" });
      }
    } catch (err) {
      console.error("translate api error", err);
      setMenuTranslations({ en: "", jp: "", zh: "" });
    } finally {
      setTranslating(false);
    }
  };

  const handleAsk = () => {
    // placeholder answer - in production this would call AI backend
    const sample: Record<string, string> = {
      KO: `한국의 소상공인 제도에 대한 답변(예시):\n- 세무: 부가세 신고는 연1회(간이 제외) 등\n- 금융: iM뱅크 소상공인 대출 가능`,
      EN: `Sample answer about Korean small business finance/tax:\n- Tax: VAT filing rules apply\n- Finance: iM Bank offers SME loans`,
      JP: `サンプル回答: 韓国の小規模事業者制度について\n- 税務: VAT申告について\n- 金融: iM銀行の中小向けローン情報`,
      ZH: `示例回答：关于韩国小微商户的税务/金融\n- 税务: 增值税申报规则\n- 金融: iM银行小微贷款信息`,
    };
    setAnswer(sample[lang] ?? sample.EN);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-50 max-w-2xl rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🌐</div>
            <div>
              <div className="text-sm font-semibold text-slate-700">{L.title}</div>
              <div className="text-xs text-slate-500">{lang}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang("EN")}
              className={`rounded-full px-2 py-1 text-sm ${lang === "EN" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700"}`}
            >
              🇺🇸 English
            </button>
            <button
              type="button"
              onClick={() => setLang("JP")}
              className={`rounded-full px-2 py-1 text-sm ${lang === "JP" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700"}`}
            >
              🇯🇵 日本語
            </button>
            <button
              type="button"
              onClick={() => setLang("ZH")}
              className={`rounded-full px-2 py-1 text-sm ${lang === "ZH" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700"}`}
            >
              🇨🇳 中文
            </button>
            <button type="button" onClick={onClose} className="ml-3 text-sm text-slate-500">{L.close}</button>
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          {(L.tabs as string[]).map((tab, idx) => {
            const id = (idx + 1) as 1 | 2 | 3;
            return (
              <button
                key={tab}
                onClick={() => setActive(id)}
                className={`rounded-full px-3 py-2 text-sm font-medium ${active === id ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700"}`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="max-h-[60vh] overflow-auto">
          {active === 1 && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">{L.visaLabel}</label>
              <select value={visaType} onChange={(e) => setVisaType(e.target.value)} className="w-full rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2">
                <option>F-2</option>
                <option>F-5</option>
                <option>F-6</option>
                <option>D-9</option>
              </select>

              <div className="mt-4 flex gap-2">
                <button onClick={handleSummarize} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white">{L.summarize}</button>
                <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{visaType} • 예시 분류 보기</div>
              </div>

              {policySummary && (
                <pre className="mt-3 whitespace-pre-wrap rounded-md border border-emerald-100 bg-white p-3 text-sm text-slate-700">{policySummary}</pre>
              )}
            </div>
          )}

          {active === 2 && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">{L.productLabel}</label>
              <div className="flex gap-2">
                <input value={productName} onChange={(e) => setProductName(e.target.value)} className="flex-1 rounded-xl border border-emerald-100 px-3 py-2" />
                <button onClick={handleTranslateMenu} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white">{L.generateMenu}</button>
              </div>

              {menuTranslations && (
                <div className="mt-4 grid gap-2">
                  <div className="rounded-lg border border-emerald-100 bg-white p-3 text-sm">🇺🇸 English: {menuTranslations.en}</div>
                  <div className="rounded-lg border border-emerald-100 bg-white p-3 text-sm">🇯🇵 日本語: {menuTranslations.jp}</div>
                  <div className="rounded-lg border border-emerald-100 bg-white p-3 text-sm">🇨🇳 中文: {menuTranslations.zh}</div>
                </div>
              )}
            </div>
          )}

          {active === 3 && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">{L.questionLabel}</label>
              <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={4} className="w-full rounded-xl border border-emerald-100 px-3 py-2 text-sm" />
              <div className="mt-3 flex gap-2">
                <button onClick={handleAsk} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white">{L.ask}</button>
                <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{lang === "EN" ? "Answer will come in English" : lang === "JP" ? "日本語で回答します" : lang === "ZH" ? "将以中文回答" : "모국어로 답변"}</div>
              </div>

              {answer && (
                <pre className="mt-3 whitespace-pre-wrap rounded-md border border-emerald-100 bg-white p-3 text-sm text-slate-700">{answer}</pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
