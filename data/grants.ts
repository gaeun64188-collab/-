export interface Grant {
  id: string;
  title: string;
  regions: string[]; // e.g. ['대구 중구', '대구시']
  businessTypes: string[]; // e.g. ['음식점업']
  amount?: string;
  description: string;
  url?: string;
  deadline?: string; // YYYY-MM-DD 또는 설명
  contact?: string; // 담당부서/전화
  tags?: string[];
}

export const grants: Grant[] = [
  {
    id: 'dg-city-01',
    title: '대구시 소상공인 창업·경영 지원금',
    regions: ['대구시'],
    businessTypes: ['음식점업', '도소매업', '서비스업'],
    amount: '최대 300만원',
    description: '대구시에 등록된 소상공인을 대상으로 창업과 경영안정 자금을 지원합니다. 업종별 특화프로그램과 컨설팅 바우처가 포함될 수 있습니다.',
    url: 'https://www.daegu.go.kr',
    deadline: '상시',
    contact: '대구시 소상공인지원과 / 053-xxxx-xxxx',
    tags: ['청년창업자 우대', 'iM뱅크 특례보증'],
  },
  {
    id: 'dg-junggu-restaurant',
    title: '대구 중구 상권 활성화 음식점 지원금',
    regions: ['대구 중구'],
    businessTypes: ['음식점업'],
    amount: '업체당 200만원 (시설·홍보)',
    description: '중구 내 음식점의 시설개선(인테리어, 주방설비) 및 지역 마케팅 비용을 지원합니다. 구체적 세부 요건은 중구청 공고를 확인하세요.',
    url: 'https://junggu.daegu.go.kr',
    deadline: '2026-12-31',
    contact: '중구청 경제과 / 053-xxxx-xxxx',
    tags: ['전통시장·골목상권', '대구로페이/정산 연계'],
  },
  {
    id: 'dg-sme-it',
    title: '대구소상공인 디지털 전환 지원',
    regions: ['대구시'],
    businessTypes: ['도소매업', '서비스업', '음식점업'],
    amount: '최대 150만원 (시스템 도입비 일부)',
    description: '온라인 판매·배달·간편결제 등 디지털 전환을 위한 솔루션 도입 비용 일부를 지원합니다. 매출증대 연계 지원을 우대합니다.',
    url: 'https://www.daegu.go.kr/digital-support',
    deadline: '상시(프로그램별 상이)',
    contact: '대구시 디지털전환팀 / 053-xxxx-xxxx',
    tags: ['대구로페이/정산 연계', 'iM뱅크 특례보증'],
  },
  {
    id: 'dg-suseong-visitor',
    title: '수성구 관광·체험형 음식점 지원',
    regions: ['대구 수성구'],
    businessTypes: ['음식점업', '체험형서비스'],
    amount: '업체당 최대 250만원',
    description: '수성구를 방문하는 관광객 대상 체험형 음식점(시음, 쿠킹클래스 등)의 운영·홍보 비용을 지원합니다.',
    url: 'https://suseong.daegu.go.kr',
    deadline: '2026-11-30',
    contact: '수성구청 문화관광과 / 053-xxxx-xxxx',
    tags: ['전통시장·골목상권', '청년창업자 우대'],
  },
  {
    id: 'dg-dalseo-renew',
    title: '달서구 소상공인 시설개선 보조금',
    regions: ['대구 달서구'],
    businessTypes: ['음식점업', '도소매업'],
    amount: '업체당 최대 200만원',
    description: '달서구 내 노후 시설의 안전점검·리모델링을 위한 보조금입니다. 에너지 효율 개선 항목을 우대합니다.',
    url: 'https://dalseo.daegu.go.kr',
    deadline: '2026-10-15',
    contact: '달서구청 경제지원과 / 053-xxxx-xxxx',
    tags: ['iM뱅크 특례보증', '대구로페이/정산 연계'],
  },
];

export interface BankCard {
  id: string;
  name: string;
  summary: string;
  eligibility?: string;
  link?: string;
}

export const imBankCards: BankCard[] = [
  {
    id: 'imb-01',
    name: 'iM뱅크 소상공인 특례보증 A',
    summary: '창업·영세 소상공인을 위한 신속심사 특례보증. 보증비율 우대.',
    eligibility: '사업자등록 후 3년 이내 또는 연매출 10억 이하 소상공인 대상',
    link: 'https://www.imbank.co.kr/product/guarantee-a',
  },
  {
    id: 'imb-02',
    name: 'iM뱅크 매출연계 특례보증 B',
    summary: '매출 데이터 기반 심사로 음식점·소매업에 유리한 보증 상품.',
    eligibility: '최근 6개월 카드매출 또는 POS 매출 확인 가능한 업체 우대',
    link: 'https://www.imbank.co.kr/product/guarantee-b',
  },
  {
    id: 'imb-03',
    name: 'iM뱅크 운영자금 특례보증 C',
    summary: '시설개선 및 운영자금 목적의 보증 상품으로 상환조건 유연성 제공.',
    eligibility: '영업 중인 소상공인 대상, 사업계획서 필요',
    link: 'https://www.imbank.co.kr/product/guarantee-c',
  },
];
