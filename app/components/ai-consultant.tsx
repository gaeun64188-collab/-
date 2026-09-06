"use client";

import { FormEvent, PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const FALLBACK_REPLY = `안녕하세요, 사장님! 대구 중구 카페 사업장을 위한 iM뱅크(대구은행) 금리 우대 및 대구로페이 연계 조건 안내드립니다.

1. 🏦 iM뱅크 소상공인 우대 금리 혜택
• 대구신용보증재단 특례보증 연계 시 기본 이차보전(이자 지원) 최대 2.0%p~3.0%p 혜택이 적용됩니다.
• iM뱅크 사업자 가맹점 계좌를 주거래 계좌로 지정 시 추가 0.2%p~0.5%p 금리 우대를 받으실 수 있습니다.

2. 💳 대구로페이 가맹점 유지 조건
• 대구로 앱 내 '지역화폐 가맹점'으로 등록되어 있어야 하며, 대구로페이 결제 정산 계좌를 iM뱅크 계좌로 연결해 두셔야 우대 금리가 유지됩니다.
• 전통시장 및 골목상권 활성화 구역 내 카페인 경우 대구로페이 결제 수수료 0% 감면 혜택이 함께 적용됩니다.

3. 📋 필요한 준비 서류
• 사업자등록증 사본, 최근년도 부가가치세 과세표준증명원, 신분증을 준비하시고 대구신용보증재단 중구지점 또는 iM뱅크 대구 중구 지점에 방문/신청하시면 됩니다.

더 자세한 서류 접수 절차나 보증 한도 조회가 필요하시면 언제든 말씀해 주세요!`;

const starterMessage = {
  role: "assistant" as const,
  content:
    "안녕하세요! 대구 소상공인 맞춤 지원금·대출 상담을 도와드릴게요. 지역, 업종, 월매출을 알려주시면 가장 적합한 정책과 금융 상품을 추천해드릴게요.",
};

export default function AIConsultant({
  open,
  onClose,
  initialPrompt = "",
}: {
  open: boolean;
  onClose: () => void;
  initialPrompt?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const resizeOffsetRef = useRef({ startX: 0, startY: 0, startWidth: 360, startHeight: 520 });
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [size, setSize] = useState({ width: 360, height: 520 });

  const clampSize = (nextWidth: number, nextHeight: number) => {
    const maxWidth = Math.max(300, Math.min(window.innerWidth - 24, 480));
    const maxHeight = Math.max(420, Math.min(window.innerHeight - 24, 680));

    return {
      width: Math.min(Math.max(nextWidth, 300), maxWidth),
      height: Math.min(Math.max(nextHeight, 420), maxHeight),
    };
  };

  const updatePosition = (nextX: number, nextY: number) => {
    const panelWidth = size.width;
    const panelHeight = size.height;
    const maxX = Math.max(12, window.innerWidth - panelWidth - 12);
    const maxY = Math.max(12, window.innerHeight - panelHeight - 12);

    setPosition({
      x: Math.min(Math.max(12, nextX), maxX),
      y: Math.min(Math.max(12, nextY), maxY),
    });
  };

  const resetPosition = () => {
    const nextSize = clampSize(size.width, size.height);
    const defaultX = Math.max(12, window.innerWidth - nextSize.width - 20);
    const defaultY = Math.max(12, window.innerHeight - nextSize.height - 20);

    setSize(nextSize);
    setPosition({ x: defaultX, y: defaultY });
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;

    dragOffsetRef.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      updatePosition(moveEvent.clientX - dragOffsetRef.current.x, moveEvent.clientY - dragOffsetRef.current.y);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handleResizePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    resizeOffsetRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startWidth: size.width,
      startHeight: size.height,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const nextWidth = resizeOffsetRef.current.startWidth + (moveEvent.clientX - resizeOffsetRef.current.startX);
      const nextHeight = resizeOffsetRef.current.startHeight + (moveEvent.clientY - resizeOffsetRef.current.startY);
      const nextSize = clampSize(nextWidth, nextHeight);

      setSize(nextSize);
      const maxX = Math.max(12, window.innerWidth - nextSize.width - 12);
      const maxY = Math.max(12, window.innerHeight - nextSize.height - 12);

      setPosition((prev) => ({
        x: Math.min(Math.max(prev.x, 12), maxX),
        y: Math.min(Math.max(prev.y, 12), maxY),
      }));
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const submitPrompt = async (prompt: string) => {
    const trimmed = prompt.trim();
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
      const reply = typeof data?.reply === "string" && data.reply.trim() ? data.reply : FALLBACK_REPLY;

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
          content: FALLBACK_REPLY,
        };
        return next;
      });
    } finally {
      setLoading(false);
      setAutoSubmitted(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    resetPosition();
  }, [open]);

  useEffect(() => {
    if (!open || !initialPrompt.trim()) return;
    if (autoSubmitted) return;

    setInput(initialPrompt);
    setAutoSubmitted(true);
    const timer = window.setTimeout(() => {
      void submitPrompt(initialPrompt);
    }, 50);

    return () => window.clearTimeout(timer);
  }, [open, initialPrompt, autoSubmitted]);

  if (!open) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    await submitPrompt(trimmed);
  };

  return (
    <div
      ref={panelRef}
      className="fixed z-50 overflow-hidden rounded-[24px] border border-emerald-200 bg-white shadow-[0_24px_70px_rgba(16,185,129,0.2)]"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        maxWidth: "calc(100vw - 24px)",
        maxHeight: "calc(100vh - 24px)",
      }}
    >
      <div
        className="flex cursor-grab items-center justify-between border-b border-emerald-100 bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 px-4 py-3 text-white active:cursor-grabbing"
        onPointerDown={handlePointerDown}
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-50/80">AI 상담사</p>
          <h3 className="mt-1 text-base font-bold">대구 소상공인 맞춤 상담</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-xs font-semibold transition hover:bg-white/15"
        >
          닫기
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 bg-emerald-50/40 p-3">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 shadow-sm whitespace-pre-line ${
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

        <form onSubmit={handleSubmit} className="mt-2 border-t border-emerald-100 bg-white p-2">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={3}
              placeholder="예: 중구 카페, 월 매출 3000만 원, 운영자금이 필요해요"
              className="flex-1 resize-none rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 outline-none ring-0 placeholder:text-emerald-700/50 focus:border-emerald-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-2xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {loading ? "전송중" : "전송"}
            </button>
          </div>
        </form>
      </div>

      <div
        className="absolute bottom-1 right-1 h-5 w-5 cursor-se-resize rounded-full border border-emerald-200 bg-white/90 shadow-sm"
        onPointerDown={handleResizePointerDown}
        aria-label="상담 창 크기 조절"
        title="상담 창 크기 조절"
      />
    </div>
  );
}
