import { NextResponse } from 'next/server';

const fallbackSummary = [
  '• 대구시 관내 사업자를 등록한 소상공인 대상 지원사업입니다.',
  '• 이자 차액 보전 및 iM뱅크 특례보증 우대를 제공합니다.',
  '• 예산 소진 시 조기 마감될 수 있어 서류 준비 후 신청을 권장합니다.',
];

const fallbackDocs = [
  '사업자등록증 사본',
  '부가가치세 과세표준증명원',
  '신분증',
  '매출증빙서류',
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const title = typeof body?.title === 'string' ? body.title : '지원정책';
    const description = typeof body?.description === 'string' ? body.description : '';
    const region = typeof body?.region === 'string' ? body.region : '대구시';
    const industry = typeof body?.industry === 'string' ? body.industry : '소상공인';

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        result: {
          summary: fallbackSummary,
          required_documents: fallbackDocs,
          title,
          region,
          industry,
        },
      });
    }

    const prompt = `다음 정책 정보를 한국어로 3줄 불렛포인트 요약하고, 신청에 필요한 핵심 서류 3~4개를 JSON으로만 반환해 주세요. JSON 키는 summary (배열), required_documents (배열)만 포함하세요. 정책명: ${title}\n지역: ${region}\n업종: ${industry}\n내용: ${description}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              '당신은 대구 소상공인 지원정책 요약 전문가입니다. 결과는 JSON 형식으로 summary 배열과 required_documents 배열만 반환하세요. 반드시 마크다운 기호나 설명 문구 없이 JSON만 반환하세요.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({
        result: {
          summary: fallbackSummary,
          required_documents: fallbackDocs,
          title,
          region,
          industry,
        },
      });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? '';

    let parsed: any = null;
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          parsed = { summary: fallbackSummary, required_documents: fallbackDocs };
        }
      } else {
        parsed = { summary: fallbackSummary, required_documents: fallbackDocs };
      }
    }

    const summary = Array.isArray(parsed?.summary) && parsed.summary.length > 0 ? parsed.summary : fallbackSummary;
    const requiredDocs = Array.isArray(parsed?.required_documents) && parsed.required_documents.length > 0 ? parsed.required_documents : fallbackDocs;

    return NextResponse.json({
      result: {
        summary,
        required_documents: requiredDocs,
      },
    });
  } catch (error) {
    return NextResponse.json({
      result: {
        summary: fallbackSummary,
        required_documents: fallbackDocs,
      },
    });
  }
}
