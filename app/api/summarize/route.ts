import { NextResponse } from 'next/server';

type Body = {
  title?: string;
  text: string;
};

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const prompt = `다음 공고문을 한국어로 3줄 요약하고, 신청에 필요한 서류 목록을 JSON으로 출력해 주세요. 응답은 반드시 JSON 형식으로 다음 키를 포함해야 합니다: summary (문장 3개로 된 문자열), required_documents (문자열 배열).\n\n공고 제목: ${body.title ?? ''}\n공고 내용:\n${body.text}`;

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: '당신은 공고문 요약 전문가입니다. 결과를 JSON으로만 반환하세요.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 600,
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      return NextResponse.json({ error: 'OpenAI API error', details: txt }, { status: 502 });
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content ?? '';

    let parsed: any = null;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        try { parsed = JSON.parse(match[0]); } catch (e) { parsed = { raw: content }; }
      } else {
        parsed = { raw: content };
      }
    }

    return NextResponse.json({ result: parsed });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'unknown' }, { status: 500 });
  }
}
