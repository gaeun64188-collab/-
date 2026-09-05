import React, { useMemo, useState } from 'react';
import { grants, imBankCards } from '../../data/grants';

interface Props {
  initialRegion?: string;
  initialBusinessType?: string;
  maxBankCards?: number;
}

const REGION_OPTIONS = ['대구 중구', '대구시', '전체'];
const BUSINESS_OPTIONS = ['음식점업', '도소매업', '서비스업', '전체'];

export default function GrantMatcher({ initialRegion = '대구 중구', initialBusinessType = '음식점업', maxBankCards = 3 }: Props) {
  const [region, setRegion] = useState<string>(initialRegion);
  const [businessType, setBusinessType] = useState<string>(initialBusinessType);

  const matchedGrants = useMemo(() => {
    return grants.filter((g) => {
      const regionMatch =
        region === '전체' || g.regions.some((r) => r === region || region.includes(r) || r.includes(region) || (r.includes('대구') && region.includes('대구')));
      const bizMatch = businessType === '전체' || g.businessTypes.some((b) => b === businessType || businessType.includes(b));
      return regionMatch && bizMatch;
    });
  }, [region, businessType]);

  const suggestedCards = useMemo(() => imBankCards.slice(0, maxBankCards), [maxBankCards]);

  return (
    <div className="rounded-[28px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-5 shadow-[0_18px_40px_rgba(16,185,129,0.08)] sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">지원금 매칭</p>
          <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-emerald-950">선택 조건에 맞는 지원금 및 카드</h3>
          <p className="mt-1 text-sm text-emerald-800/70">지역: {region} · 업종: {businessType}</p>
        </div>
      </div>

      <div className="mb-4 flex gap-3 flex-wrap">
        <label className="flex items-center gap-2">
          <span className="text-sm font-bold text-emerald-800">지역</span>
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="ml-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-emerald-900 shadow-sm outline-none focus:border-emerald-400">
            {REGION_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-sm font-bold text-emerald-800">업종</span>
          <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="ml-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-emerald-900 shadow-sm outline-none focus:border-emerald-400">
            {BUSINESS_OPTIONS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <GrantListColumn
          grants={matchedGrants}
        />

        <div>
          <p className="text-sm font-bold text-emerald-800">추천 iM뱅크 특례보증 카드</p>
          <ul className="mt-2 space-y-3">
            {suggestedCards.map((c) => (
              <li key={c.id} className="rounded-2xl border border-emerald-200 bg-white/90 p-3 shadow-sm shadow-emerald-100">
                <a href={c.link} target="_blank" rel="noreferrer" className="block">
                  <p className="font-extrabold text-emerald-950">{c.name}</p>
                  <p className="mt-1 text-sm text-emerald-800/75">{c.summary}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function GrantListColumn({ grants }: { grants: any[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentGrant, setCurrentGrant] = useState<any | null>(null);

  const openGrant = async (g: any) => {
    setCurrentGrant(g);
    setOpen(true);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const resp = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: g.title, text: `${g.description}\nURL: ${g.url ?? ''}` }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data?.error || '요약 중 오류가 발생했습니다.');
      } else {
        setResult(data.result);
      }
    } catch (e: any) {
      setError(e.message ?? '네트워크 오류');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!result) return;
    const text = buildExportText(currentGrant, result);
    try {
      await navigator.clipboard.writeText(text);
      alert('요약과 필요서류가 클립보드에 복사되었습니다.');
    } catch (e) {
      alert('복사에 실패했습니다. 수동으로 선택해 복사하세요.');
    }
  };

  const downloadPDF = async () => {
    if (!result) return;
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const title = currentGrant?.title ?? 'application';
      const text = buildExportText(currentGrant, result);
      const lines = doc.splitTextToSize(text, 170);
      doc.setFontSize(12);
      doc.text(lines, 10, 10);
      doc.save(`${sanitizeFileName(title)}.pdf`);
    } catch (e) {
      alert('PDF 생성에 실패했습니다.');
    }
  };

  const buildExportText = (grant: any, res: any) => {
    const parts: string[] = [];
    parts.push(`공고: ${grant?.title ?? ''}`);
    parts.push('');
    parts.push('AI 3줄 요약:');
    if (typeof res.summary === 'string') parts.push(res.summary);
    else parts.push(JSON.stringify(res.summary));
    parts.push('');
    parts.push('필요 서류:');
    if (Array.isArray(res.required_documents)) {
      res.required_documents.forEach((d: string, i: number) => parts.push(`${i + 1}. ${d}`));
    }
    parts.push('');
    parts.push(`원문 링크: ${grant?.url ?? ''}`);
    return parts.join('\n');
  };

  const sanitizeFileName = (s: string) => s.replace(/[^a-z0-9가-힣\-_ ]/gi, '_').slice(0, 120);

  return (
    <div>
      <p className="text-sm font-bold text-emerald-800">대구시 지원금</p>
      {grants.length === 0 ? (
        <p className="mt-2 text-sm text-emerald-800/75">해당 조건에 맞는 지원금이 없습니다. 가까운 행정기관을 확인하세요.</p>
      ) : (
        <ul className="mt-2 space-y-3">
          {grants.map((g) => (
            <li key={g.id} className="rounded-2xl border border-emerald-200 bg-white/90 p-3 shadow-sm shadow-emerald-100">
              <button onClick={() => openGrant(g)} className="w-full text-left">
                <p className="font-extrabold text-emerald-950">{g.title}</p>
                <p className="mt-1 text-sm text-emerald-600">{g.amount ?? ''}</p>
                <p className="mt-2 text-sm text-emerald-800/75 truncate">{g.description}</p>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/30 backdrop-blur-sm">
          <div className="relative w-full max-w-lg border-4 border-emerald-700 bg-white p-6 shadow-[0_20px_50px_rgba(16,185,129,0.24)]">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-3 rounded border border-emerald-200 bg-emerald-50 px-2 py-1 font-bold text-emerald-700">✖</button>
            <h2 className="mb-2 text-lg font-extrabold text-emerald-950">{currentGrant?.title}</h2>

            {loading && <p className="text-sm text-emerald-800/75">요약 생성 중...</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}

            {result && (
              <div className="mt-3">
                <p className="font-extrabold text-emerald-900">AI 3줄 요약</p>
                <p className="mt-1 whitespace-pre-line text-sm text-emerald-800/80">{typeof result.summary === 'string' ? result.summary : JSON.stringify(result.summary)}</p>

                <p className="mt-3 font-extrabold text-emerald-900">필요 서류</p>
                <ul className="mt-1 list-disc pl-5 text-sm text-emerald-800/80">
                  {(Array.isArray(result.required_documents) ? result.required_documents : []).map((d: string, i: number) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>

                {result.raw && (
                  <details className="mt-3 text-xs text-emerald-800/70"><summary>원문 응답 보기</summary><pre className="whitespace-pre-wrap">{String(result.raw)}</pre></details>
                )}
                <div className="mt-4 flex gap-3">
                  <button onClick={copyToClipboard} className="border border-emerald-200 bg-emerald-50 px-3 py-2 font-bold text-emerald-900">요약 복사</button>
                  <button onClick={downloadPDF} className="border border-emerald-300 bg-white px-3 py-2 font-bold text-emerald-900">신청서 PDF 다운로드</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
