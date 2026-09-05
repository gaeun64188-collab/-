"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language = "KO" | "EN" | "JP" | "ZH";

export type TranslationDict = {
  heroTitle: string;
  heroSub: string;
  heroGreeting: string;
  heroWelcomeSubtitle: string;
  navGuide: string;
  login: string;
  loginProcessing: string;
  socialLogin: string;
  aiConsult: string;
  performance: string;
  live: string;
  summaryLabel: string;
  cardSales: string;
  cardRate: string;
  quick1: string;
  quick2: string;
  quick3: string;
  quick4: string;
  quick5: string;
  sectionTitle: string;
  region: string;
  industry: string;
  revenue: string;
  home: string;
  guideTitle: string;
  guideSubtitle: string;
  guideStep1: string;
  guideStep2: string;
  guideStep3: string;
  guideCTA: string;
  dashboardTitle: string;
  dashboardSubtitle: string;
  dashboardHome: string;
  dashboardGenerate: string;
  generatorTitle: string;
  generatorCta: string;
  languageName: string;
  faqTitle: string;
  notice: string;
  event: string;
  more: string;
  appTitle: string;
  marketAnalysisTitle: string;
  marketDistrict: string;
  marketIndustry: string;
  marketScore: string;
  marketTraffic: string;
  marketDaeguPay: string;
  marketReportGenerate: string;
  marketScoreValue: string;
  marketTrafficValue: string;
  marketDaeguPayValue: string;
};

const STORAGE_KEY = "im-platform-lang";

const dictionary: Record<Language, TranslationDict> = {
  KO: {
    heroTitle: "더 나은 상권 선택을 시작하세요.",
    heroSub: "대구시 소상공인과 예비 창업자를 위한 AI 맞춤 상권 분석 및 지원금·iM뱅크 금융 혜택 솔루션",
    heroGreeting: "김사장님(대구 중구 카페), 반갑습니다!",
    heroWelcomeSubtitle: "사장님 매장에 딱 맞는 지원 정책 3건이 기다리고 있습니다.",
    navGuide: "이용안내/가이드",
    login: "로그인",
    loginProcessing: "로그인 중...",
    socialLogin: "소셜 로그인 / 회원가입",
    aiConsult: "AI 상담사와 대화하기",
    performance: "이달 실적",
    live: "Live",
    summaryLabel: "AI 맞춤 상권 분석",
    cardSales: "누적 매출",
    cardRate: "우대금리",
    quick1: "상권 분석",
    quick2: "지원금 조회",
    quick3: "iM 우대금리",
    quick4: "AI 사업계획서",
    quick5: "AI 마케팅",
    sectionTitle: "선택 조건에 맞는 지원금 및 카드",
    region: "지역",
    industry: "업종",
    revenue: "매출",
    home: "홈으로",
    guideTitle: "iM 소상공인 플랫폼 이용 안내",
    guideSubtitle: "대구시 사장님을 위한 지원금 신청부터 iM뱅크 금융 혜택까지, 3단계로 쉽게 시작하세요.",
    guideStep1: "🎯 맞춤 지원 정책 조회",
    guideStep2: "📄 AI 사업계획서 3분 완성",
    guideStep3: "💳 대구로페이 & 금융 혜택 적용",
    guideCTA: "🚀 내 매장 맞춤 지원금 바로 찾기",
    dashboardTitle: "대구로페이 x iM뱅크 통합 매출 & 금융 정산 다이어리",
    dashboardSubtitle: "김사장님(대구 중구 카페)의 이번 달 실시간 정산 현황과 금융 혜택 한눈에 보기",
    dashboardHome: "홈으로",
    dashboardGenerate: "📄 AI 서류/사업계획서 생성",
    generatorTitle: "대구시 소상공인 지원금 신청, AI가 3분 만에 사업계획서를 작성해 드립니다.",
    generatorCta: "🤖 AI 사업계획서 자동 생성하기",
    languageName: "한국어",
    faqTitle: "자주 묻는 질문",
    notice: "새소식",
    event: "이벤트",
    more: "더보기",
    appTitle: "iM뱅크 소상공인 APP",
    marketAnalysisTitle: "AI 상권 분석",
    marketDistrict: "행정구",
    marketIndustry: "업종",
    marketScore: "AI 상권 점수",
    marketTraffic: "주 유동인구",
    marketDaeguPay: "대구로페이 결제 빈도",
    marketReportGenerate: "이 위치 AI 분석 보고서 생성",
    marketScoreValue: "88점 (상위 12%)",
    marketTrafficValue: "2030 여성 (퇴근 시간대 18시~21시 피크)",
    marketDaeguPayValue: "높음 (월 평균 결제 1,420건)",
  },
  EN: {
    heroTitle: "Start making better commercial area choices.",
    heroSub: "AI-customized commercial analysis, subsidies, and iM Bank financial solutions for Daegu small business owners.",
    heroGreeting: "Welcome, President Kim (Daegu Jung-gu Cafe)!",
    heroWelcomeSubtitle: "The right support policies for your store are waiting for you.",
    navGuide: "Guide",
    login: "Login",
    loginProcessing: "Logging in...",
    socialLogin: "Continue with social login",
    aiConsult: "Talk to AI consultant",
    performance: "Monthly performance",
    live: "Live",
    summaryLabel: "AI market analysis",
    cardSales: "Cumulative Sales",
    cardRate: "Preferential Rate",
    quick1: "Market Analysis",
    quick2: "Subsidies",
    quick3: "iM Benefits",
    quick4: "AI Plan Generator",
    quick5: "AI Marketing",
    sectionTitle: "Subsidies & Cards for Selected Conditions",
    region: "Region",
    industry: "Industry",
    revenue: "Revenue",
    home: "Home",
    guideTitle: "iM Small Business Platform Guide",
    guideSubtitle: "From subsidy applications to iM Bank financial benefits, get started in 3 easy steps.",
    guideStep1: "🎯 Find tailored support policies",
    guideStep2: "📄 AI plan in 3 minutes",
    guideStep3: "💳 Apply Daegu Pay & finance benefits",
    guideCTA: "🚀 Find the right subsidy for my store",
    dashboardTitle: "Daegu Pay x iM Bank Integrated Sales and Finance Dashboard",
    dashboardSubtitle: "A quick view of this month's settlement and financial benefits for President Kim.",
    dashboardHome: "Home",
    dashboardGenerate: "📄 Create AI documents / business plan",
    generatorTitle: "AI creates your small business grant plan in 3 minutes.",
    generatorCta: "🤖 Generate AI business plan",
    languageName: "English",
    faqTitle: "FAQs",
    notice: "News",
    event: "Events",
    more: "More",
    appTitle: "iM Bank Small Business APP",
    marketAnalysisTitle: "AI Market Analysis",
    marketDistrict: "District",
    marketIndustry: "Industry",
    marketScore: "AI Market Score",
    marketTraffic: "Main Foot Traffic",
    marketDaeguPay: "Daegu Pay Usage",
    marketReportGenerate: "Generate AI analysis report here",
    marketScoreValue: "88 points (top 12%)",
    marketTrafficValue: "Women in their 20s–30s (peak 6PM–9PM)",
    marketDaeguPayValue: "High (avg. 1,420 payments/month)",
  },
  JP: {
    heroTitle: "より良い商圏選択を始めましょう。",
    heroSub: "大邱市の小規模事業者と創業者のためのAIカスタマイズ商圏分析および助成金・iMバンク金融特典ソリューション",
    heroGreeting: "金社長様（大邱中区カフェ）、お世話になっております！",
    heroWelcomeSubtitle: "ご店舗にぴったりの支援策が3件待機しています。",
    navGuide: "ご利用案内",
    login: "ログイン",
    loginProcessing: "ログイン中...",
    socialLogin: "SNSで始める",
    aiConsult: "AI相談を開始",
    performance: "今月の実績",
    live: "ライブ",
    summaryLabel: "AI商圏分析",
    cardSales: "累積売上",
    cardRate: "優遇金利",
    quick1: "商圏分析",
    quick2: "助成金照会",
    quick3: "iM優遇金利",
    quick4: "AI事業計画書",
    quick5: "AIマーケティング",
    sectionTitle: "選択条件に合った助成金およびカード",
    region: "地域",
    industry: "業種",
    revenue: "売上",
    home: "ホーム",
    guideTitle: "iM中小企業向けプラットフォームご利用案内",
    guideSubtitle: "大邱市のオーナー様向けに、助成金申請からiMバンク金融特典まで3ステップで簡単に始められます。",
    guideStep1: "🎯 対応支援策を検索",
    guideStep2: "📄 AI事業計画書を3分で作成",
    guideStep3: "💳 大邱ローペイと金融特典を活用",
    guideCTA: "🚀 お店に合った助成金を今すぐ探す",
    dashboardTitle: "大邱ローペイ x iMバンク 統合売上・金融精算ダッシュボード",
    dashboardSubtitle: "金社長様（大邱中区カフェ）の今月の精算状況と金融特典を一目で確認できます。",
    dashboardHome: "ホーム",
    dashboardGenerate: "📄 AI書類/事業計画書を作成",
    generatorTitle: "大邱市の中小企業支援金申請をAIが3分で作成します。",
    generatorCta: "🤖 AI事業計画書を作成",
    languageName: "日本語",
    faqTitle: "よくある質問",
    notice: "新消息",
    event: "イベント",
    more: "もっと見る",
    appTitle: "iM銀行 小規模事業者 APP",
    marketAnalysisTitle: "AI商圏分析",
    marketDistrict: "行政区",
    marketIndustry: "業種",
    marketScore: "AI商圏スコア",
    marketTraffic: "主要流動人口",
    marketDaeguPay: "大邱ローペイ利用頻度",
    marketReportGenerate: "この場所でAI分析レポートを作成",
    marketScoreValue: "88点（上位12％）",
    marketTrafficValue: "20代〜30代女性（18時〜21時ピーク）",
    marketDaeguPayValue: "高い（月平均1,420件）",
  },
  ZH: {
    heroTitle: "开始选择更好的商圈。",
    heroSub: "为大邱市小微企业和创业者提供AI定制商圈分析、补贴及iM Bank金融优惠解决方案",
    heroGreeting: "欢迎您，金社长（大邱中区咖啡店）！",
    heroWelcomeSubtitle: "适合您门店的支持政策正在等您。",
    navGuide: "使用指南",
    login: "登录",
    loginProcessing: "登录中...",
    socialLogin: "使用社交账号登录",
    aiConsult: "开始AI咨询",
    performance: "本月业绩",
    live: "实时",
    summaryLabel: "AI商圈分析",
    cardSales: "累计销售额",
    cardRate: "优惠利率",
    quick1: "商圈分析",
    quick2: "补贴查询",
    quick3: "iM 优惠利率",
    quick4: "AI 商业计划书",
    quick5: "AI 营销",
    sectionTitle: "符合条件的补贴和卡片",
    region: "地区",
    industry: "行业",
    revenue: "营业额",
    home: "首页",
    guideTitle: "iM小微企业平台使用指南",
    guideSubtitle: "从补贴申请到iM Bank金融优惠，3步轻松开始。",
    guideStep1: "🎯 查找定制支持政策",
    guideStep2: "📄 3分钟生成AI商业计划书",
    guideStep3: "💳 应用大邱RoPay和金融优惠",
    guideCTA: "🚀 立即找到适合我的门店补贴",
    dashboardTitle: "大邱RoPay x iM Bank 统一销售与金融结算仪表板",
    dashboardSubtitle: "快速查看金社长门店本月的结算与金融优惠情况。",
    dashboardHome: "首页",
    dashboardGenerate: "📄 生成AI文档/商业计划书",
    generatorTitle: "AI可在3分钟内为您生成大邱市小微企业补贴申请计划书。",
    generatorCta: "🤖 生成AI商业计划书",
    languageName: "中文",
    faqTitle: "常见问题",
    notice: "最新消息",
    event: "活动",
    more: "更多",
    appTitle: "iM银行 小微商户 APP",
    marketAnalysisTitle: "AI 商圈分析",
    marketDistrict: "行政区",
    marketIndustry: "行业",
    marketScore: "AI 商圈评分",
    marketTraffic: "主要客流",
    marketDaeguPay: "大邱Pay 使用频率",
    marketReportGenerate: "在此生成 AI 分析报告",
    marketScoreValue: "88分（前12%）",
    marketTrafficValue: "20–30岁女性（18:00–21:00高峰）",
    marketDaeguPayValue: "高（月均1,420笔）",
  },
};

type LanguageContextValue = {
  lang: Language;
  setLang: (next: Language) => void;
  t: TranslationDict;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("KO");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved && saved in dictionary) {
      setLangState(saved);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === "KO" ? "ko" : lang === "EN" ? "en" : lang === "JP" ? "ja" : "zh";
  }, [lang]);

  const value = useMemo<LanguageContextValue>(() => ({
    lang,
    setLang: (next: Language) => setLangState(next),
    t: dictionary[lang],
  }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
