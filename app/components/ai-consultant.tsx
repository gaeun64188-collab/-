"use client";

import { FormEvent, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const starterMessage = {
  role: "assistant" as const,
  content:
    "안녕하세요! 대구 소상공인 맞춤 지원금·대출 상담을 도와드릴게요. 지역, 업종, 월매출을 알려주시면 가장 적합한 정책과 금융 상품을 추천해드릴게요.",
};

export default function AIConsultant({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const history = [...messages.slice(-6), userMessage];

    setMessages((prev) => [...prev, userMessage, { role: "assistant", content: "상담 내용을 확인하고 맞춤 답변을 정리하고 있습니다..." }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      const data = await response.json();
      const reply = data?.reply || "답변을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";

      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", content: reply };
        return next;
      });
    } catch (error) {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: "AI 연결에 문제가 있었습니다. 잠시 후 다시 시도해 주세요.",
        };
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-emerald-950/35 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-emerald-200 bg-white shadow-[0_24px_70px_rgba(16,185,129,0.18)]">
        <div className="flex items-center justify-between border-b border-emerald-100 bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 px-5 py-4 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-50/80">AI 상담사</p>
            <h3 className="mt-1 text-xl font-bold">대구 소상공인 맞춤 상담</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold transition hover:bg-white/15"
          >
            닫기
          </button>
        </div>

        <div className="flex max-h-[70vh] flex-col gap-3 bg-emerald-50/40 p-4">
          <div className="space-y-3 overflow-y-auto pr-1">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                    message.role === "user"
                      ? "bg-emerald-600 text-white"
                      : "border border-emerald-100 bg-white text-emerald-900"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-2 border-t border-emerald-100 bg-white p-3">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={3}
                placeholder="예: 중구 카페, 월 매출 3000만 원, 운영자금이 필요해요"
                className="flex-1 resize-none rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-900 outline-none ring-0 placeholder:text-emerald-700/50 focus:border-emerald-400"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
              >
                {loading ? "전송중" : "전송"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
