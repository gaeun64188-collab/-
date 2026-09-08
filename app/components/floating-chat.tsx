"use client";

import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const { lang } = useLanguage();

  const labelMap: Record<string, string> = {
    KO: "💬 AI 사장님 상담",
    EN: "💬 AI Business Chat",
    JP: "💬 AI相談チャット",
    ZH: "💬 AI 商家咨询",
  };

  const suggestionsMap: Record<string, string[]> = {
    KO: ["추천 질문 예시: 매출 개선 방법", "지원금 신청 도와줘", "마케팅 문구 추천"],
    EN: ["How to improve sales?", "Help with subsidies", "Suggest marketing copy"],
    JP: ["売上改善の方法は？", "補助金申請を手伝って", "マーケティング文言を提案して"],
    ZH: ["如何提升营业额？", "帮我申请补贴", "推荐营销文案"],
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-emerald-600 p-4 text-white shadow-lg hover:scale-105 transition"
        aria-label="open chat"
      >
        <span className="text-sm font-bold">{labelMap[lang]}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
          <div className="mr-6 mb-20 w-full max-w-sm rounded-2xl bg-white p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-slate-800">{labelMap[lang]}</div>
              <button type="button" onClick={() => setOpen(false)} className="text-slate-500">✕</button>
            </div>

            <div className="mt-3 text-sm text-slate-600">{lang === "KO" ? "원하시는 질문을 골라 시작하세요." : lang === "EN" ? "Pick a suggested question to start." : lang === "JP" ? "質問を選んで開始してください。" : "请选择建议的问题开始。"}</div>

            <div className="mt-4 flex flex-col gap-3">
              {suggestionsMap[lang].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => alert(`${s}`)}
                  className="w-full rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-left text-sm font-medium text-emerald-700"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <input className="flex-1 rounded-lg border border-emerald-100 px-3 py-2 text-sm outline-none" placeholder={lang === "KO" ? "메시지 입력..." : lang === "EN" ? "Type a message..." : lang === "JP" ? "メッセージ入力..." : "输入消息..."} />
              <button className="rounded-full bg-emerald-600 px-3 py-2 text-white">Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
