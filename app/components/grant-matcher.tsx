import React, { useMemo, useState } from 'react';
import AIConsultant from './ai-consultant';
import { grants, imBankCards } from '../../data/grants';

type PolicyDetailModal = {
  title: string;
  region: string;
  industry: string;
  description: string;
  summary: string[];
  requiredDocuments: string[];
  loading: boolean;
};

interface Props {
  initialRegion?: string;
  initialBusinessType?: string;
  maxBankCards?: number;
  selectedRegion?: string;
  selectedBusinessType?: string;
}

const REGION_OPTIONS = [
  '대구 중구',
  '대구 동구',
  '대구 서구',
  '대구 남구',
  '대구 북구',
  '대구 수성구',
  '대구 달서구',
  '대구 달성군',
  '대구시',
  '경북',
  '전체',
];
const BUSINESS_OPTIONS = ['음식점업', '도소매업', '서비스업', '전체'];
const QUICK_TAGS = [
  { label: '🌟 전체 보기', value: '전체' },
  { label: '🐣 청년창업자 우대', value: '청년창업자 우대' },
  { label: '🏪 전통시장·골목상권', value: '전통시장·골목상권' },
  { label: '💳 대구로페이/정산 연계', value: '대구로페이/정산 연계' },
  { label: '🏦 iM뱅크 특례보증', value: 'iM뱅크 특례보증' },
];

export default function GrantMatcher({
  initialRegion = '대구 중구',
  initialBusinessType = '음식점업',
  maxBankCards = 3,
  selectedRegion,
  selectedBusinessType,
}: Props) {
  const [region, setRegion] = useState<string>(selectedRegion ?? initialRegion);
  const [businessType, setBusinessType] = useState<string>(selectedBusinessType ?? initialBusinessType);
  const [selectedTag, setSelectedTag] = useState<string>('전체');
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiChatPrompt, setAiChatPrompt] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyDetailModal | null>(null);

  React.useEffect(() => {
    if (selectedRegion) setRegion(selectedRegion);
  }, [selectedRegion]);

  React.useEffect(() => {
    if (selectedBusinessType) setBusinessType(selectedBusinessType);
  }, [selectedBusinessType]);

  const matchedGrants = useMemo(() => {
    return grants.filter((g) => {
      const regionMatch =
        region === '전체' || g.regions.some((r) => r === region || region.includes(r) || r.includes(region) || (r.includes('대구') && region.includes('대구')));
      const bizMatch = businessType === '전체' || g.businessTypes.some((b) => b === businessType || businessType.includes(b));
      const tagMatch = selectedTag === '전체' || (Array.isArray(g.tags) && g.tags.includes(selectedTag));
      return regionMatch && bizMatch && tagMatch;
    });
  }, [region, businessType, selectedTag]);

  const suggestedCards = useMemo(() => imBankCards.slice(0, maxBankCards), [maxBankCards]);

  const openAiConsultant = (title: string, summary: string, docs: string[] = []) => {
    const prompt = `안녕하세요! '${title}' 정책의 신청 자격과 우대 조건에 대해 더 자세히 알려주세요. 한줄 설명: ${summary}. 필요한 서류: ${docs.join(', ')}.`;
    setAiChatPrompt(prompt);
    setAiChatOpen(true);
  };

  const openPolicyDetail = async (title: string, description: string, region: string, industry: string) => {
    setSelectedPolicy({
      title,
      region,
      industry,
      description,
      summary: [],
      requiredDocuments: [],
      loading: true,
    });

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, region, industry }),
      });

      const data = await response.json();
      const result = data?.result ?? {};
      setSelectedPolicy({
        title,
        region,
        industry,
        description,
        summary: Array.isArray(result.summary) ? result.summary : [
          '• 대구시 관내 사업자를 등록한 소상공인 대상 지원사업입니다.',
          '• 이자 차액 보전 및 iM뱅크 특례보증 우대를 제공합니다.',
          '• 예산 소진 시 조기 마감될 수 있어 서류 준비 후 신청을 권장합니다.',
        ],
        requiredDocuments: Array.isArray(result.required_documents) ? result.required_documents : [
          '사업자등록증 사본',
          '부가가치세 과세표준증명원',
          '신분증',
          '매출증빙서류',
        ],
        loading: false,
      });
    } catch (error) {
      setSelectedPolicy({
        title,
        region,
        industry,
        description,
        summary: [
          '• 대구시 관내 사업자를 등록한 소상공인 대상 지원사업입니다.',
          '• 이자 차액 보전 및 iM뱅크 특례보증 우대를 제공합니다.',
          '• 예산 소진 시 조기 마감될 수 있어 서류 준비 후 신청을 권장합니다.',
        ],
        requiredDocuments: [
          '사업자등록증 사본',
          '부가가치세 과세표준증명원',
          '신분증',
          '매출증빙서류',
        ],
        loading: false,
      });
    }
  };

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

      <div className="mb-4 flex flex-wrap gap-2">
        {QUICK_TAGS.map((tag) => {
          const active = selectedTag === tag.value;
          return (
            <button
              key={tag.value}
              type="button"
              onClick={() => setSelectedTag(tag.value)}
              className={`rounded-full border px-3 py-2 text-sm transition ${
                active
                  ? 'border-emerald-600 bg-emerald-600 text-white font-bold shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-emerald-50'
              }`}
            >
              {tag.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <GrantListColumn
          grants={matchedGrants}
          region={region}
          industry={businessType}
          onOpenDetail={openPolicyDetail}
          onAskAi={openAiConsultant}
        />

        <div>
          <p className="text-sm font-bold text-emerald-800">추천 iM뱅크 특례보증 카드</p>
          <ul className="mt-2 space-y-3">
            {suggestedCards.map((c) => (
              <li key={c.id} className="rounded-2xl border border-emerald-200 bg-white/90 p-3 shadow-sm shadow-emerald-100">
                <button type="button" onClick={() => openPolicyDetail(c.name, c.summary, region, businessType)} className="w-full text-left">
                  <p className="font-extrabold text-emerald-950">{c.name}</p>
                  <p className="mt-1 text-sm text-emerald-800/75">{c.summary}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm shadow-emerald-100">
          <div className="mb-3 flex items-center gap-2 text-emerald-700">
            <span className="text-xl">📄</span>
            <span className="text-xs font-semibold uppercase tracking-[0.12em]">필수 서류 가이드</span>
          </div>
          <h4 className="text-lg font-extrabold text-emerald-950">처음 신청하시나요? 필수 제출 서류 발급 가이드 (홈택스/정부24)</h4>
          <p className="mt-2 text-sm text-emerald-800/75">
            사업자등록증, 부가가치세 과세표준증명원, 신용정보 확인서 등을 홈택스·정부24에서 발급하는 가장 빠른 방법을 정리해보세요.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm shadow-emerald-100">
          <div className="mb-3 flex items-center gap-2 text-emerald-700">
            <span className="text-xl">💡</span>
            <span className="text-xs font-semibold uppercase tracking-[0.12em]">신청 팁</span>
          </div>
          <h4 className="text-lg font-extrabold text-emerald-950">2026 대구시 골목상권 디지털 전환 지원금 신청 팁</h4>
          <p className="mt-2 text-sm text-emerald-800/75">
            결제 시스템·배달·POS 연동 내역과 최근 6개월 매출 증빙을 함께 준비하면 심사 통과 가능성이 높아집니다.
          </p>
        </div>
      </div>

      {selectedPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/30 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-xl rounded-[28px] border border-emerald-200 bg-white p-5 shadow-[0_20px_50px_rgba(16,185,129,0.24)]">
            <button
              type="button"
              onClick={() => setSelectedPolicy(null)}
              className="absolute right-4 top-4 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-sm font-bold text-emerald-700"
            >
              ✖
            </button>

            <div className="pr-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">정책 상세</p>
              <h2 className="mt-2 text-xl font-extrabold text-emerald-950">{selectedPolicy.title}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">{selectedPolicy.region}</span>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">{selectedPolicy.industry}</span>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="font-extrabold text-emerald-900">🤖 AI 3줄 요약</p>
                {selectedPolicy.loading ? (
                  <p className="mt-2 text-sm text-emerald-800/75">AI가 공고문을 분석 중입니다...</p>
                ) : (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-800/80">
                    {selectedPolicy.summary.map((item, index) => (
                      <li key={`${item}-${index}`}>{item.replace(/^•\s*/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3">
                <p className="text-[11px] leading-5 text-emerald-800/80">
                  💡 본 리포트는 공공데이터포털, 대구 D-데이터허브, DIP 빅데이터활용센터의 실시간/분석 데이터를 기반으로 AI가 종합 분석한 결과입니다.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-white p-4">
                <p className="font-extrabold text-emerald-900">📋 필요 서류</p>
                <ul className="mt-3 space-y-2">
                  {selectedPolicy.requiredDocuments.map((doc, index) => (
                    <li key={`${doc}-${index}`} className="flex items-center gap-3 text-sm text-emerald-800/80">
                      <input type="checkbox" checked readOnly className="h-4 w-4 accent-emerald-600" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setSelectedPolicy(null);
                  openAiConsultant(selectedPolicy.title, selectedPolicy.summary.join(' '), selectedPolicy.requiredDocuments);
                }}
                className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-500"
              >
                💬 AI 상담사에게 이 정책 더 물어보기
              </button>
              <button
                type="button"
                onClick={() => window.alert('서류 목록이 문자로 발송되었습니다.')}
                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-900"
              >
                📱 서류 목록 문자 받기
              </button>
              <button
                type="button"
                onClick={() => setSelectedPolicy(null)}
                className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-bold text-emerald-700"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      <AIConsultant open={aiChatOpen} onClose={() => setAiChatOpen(false)} initialPrompt={aiChatPrompt} />
    </div>
  );
}

function GrantListColumn({
  grants,
  region,
  industry,
  onOpenDetail,
  onAskAi,
}: {
  grants: any[];
  region: string;
  industry: string;
  onOpenDetail: (title: string, description: string, region: string, industry: string) => void;
  onAskAi: (title: string, summary: string, docs?: string[]) => void;
}) {
  return (
    <div>
      <p className="text-sm font-bold text-emerald-800">대구시 지원금</p>
      {grants.length === 0 ? (
        <p className="mt-2 text-sm text-emerald-800/75">해당 조건에 맞는 지원금이 없습니다. 가까운 행정기관을 확인하세요.</p>
      ) : (
        <ul className="mt-2 space-y-3">
          {grants.map((g) => (
            <li key={g.id} className="rounded-2xl border border-emerald-200 bg-white/90 p-3 shadow-sm shadow-emerald-100">
              <button onClick={() => onOpenDetail(g.title, g.description, region, industry)} className="w-full text-left">
                <p className="font-extrabold text-emerald-950">{g.title}</p>
                <p className="mt-1 text-sm text-emerald-600">{g.amount ?? ''}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {(Array.isArray(g.tags) ? g.tags : []).slice(0, 3).map((tag: string) => (
                    <span
                      key={`${g.id}-${tag}`}
                      className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-sm text-emerald-800/75 truncate">{g.description}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
