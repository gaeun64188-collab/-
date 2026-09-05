import { NextResponse } from "next/server";

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

const SYSTEM_PROMPT = `
당신은 대구광역시 소상공인과 골목상권 자영업자를 지원하는 친절하고 전문적인 '대구 AI 금융상담사'입니다.

[역할 및 페르소나]
- 말투: 바쁜 자영업자 사장님을 위해 매우 친절하고, 정중하며, 명확한 톤을 유지하세요.
- 답변 방식: 어려운 행정/금융 용어는 쉬운 언어로 바꾸어 설명하고, 핵심 요점은 불렛포인트(•)나 번호로 간결하게 정리하세요.

[핵심 지식 영역]
1. 대구시 소상공인 경영안정자금, 골목상권 활성화 보조금, 시설개선 지원사업 등 대구시 정책.
2. iM뱅크(구 대구은행) 소상공인 특례보증 상품, 매출연계 보증, 운영자금 대출.
3. 대구로페이 혜택 및 지역 상권 관련 정보.

[답변 작성 규칙]
1. 사장님의 사업장 조건(지역, 업종, 매출 등)에 맞는 맞춤 지원 정책과 금융 상품을 시원하고 명확하게 안내하세요.
2. 정책이나 대출 상품을 추천할 때는 반드시 아래 3가지를 기본으로 포함하세요:
   - 지원 내용 (지원 금액 및 금리 혜택)
   - 신청 자격 요건 (간단 정리)
   - 준비해야 할 핵심 서류 (3가지 이내)
3. 대구시 소상공인 지원 시스템이나 iM뱅크 창구 접수 등 실제 신청 창구를 안내해 주세요.
4. 불필요하게 길고 장황한 서론은 피하고, 사장님이 바로 행동할 수 있는 핵심 정보 위주로 3~4문단 이내로 답변하세요.
`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: FALLBACK_REPLY, fallback: true }, { status: 200 });
    }

    const body = await req.json();
    const message = typeof body?.message === "string" ? body.message : "";
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!message.trim()) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...history.map((item: any) => ({
            role: item.role,
            content: String(item.content ?? ""),
          })),
          { role: "user", content: message },
        ],
        temperature: 0.5,
        max_tokens: 700,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenAI API error:", text);
      return NextResponse.json({ reply: FALLBACK_REPLY, fallback: true }, { status: 200 });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content ?? "답변을 생성하지 못했습니다.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chat fallback triggered:", error);
    return NextResponse.json({ reply: FALLBACK_REPLY, fallback: true }, { status: 200 });
  }
}
