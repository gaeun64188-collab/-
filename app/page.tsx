'use client';

import React from 'react';
// app/components 안에 위치하므로 './components/...' 로 불러옵니다!
import dynamic from 'next/dynamic';

import Link from "next/link";

import { useRouter } from "next/navigation";
import { AnimatePresence, animate, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import AIConsultant from "./components/ai-consultant";
import GrantMatcher from './components/grant-matcher';
import DataSummary from "./components/data-summary";
import FloatingChat from "./components/floating-chat";
import Testimonials from "./components/testimonials";
import GlobalSupportModal from "./components/global-support-modal";
import { useLanguage } from "./context/LanguageContext";

 






type MarketStats = {
  traffic: string;
  trafficLabel: string;
  sales: string;
  salesLabel: string;
  change: string;
  insight: string;
  score: string;
  district: string;
};

type MarketMap = Record<string, Record<string, Record<string, MarketStats>>>;





const districts = ["대구 중구", "대구 북구", "대구 수성구", "대구 달서구", "대구 동구"];
const industries = ["카페", "패션", "식당", "뷰티", "교육"];
const revenueRanges = ["1천만 원 이하", "1천만~3천만 원", "3천만~5천만 원", "5천만 원 이상"];

const dataSourceCards = [
  {
    icon: "🌐",
    title: "공공 데이터 포털",
    description: "전국 소상공인 상권 DB 및 공공 정책자금 데이터 연동",
    url: "https://www.data.go.kr/",
  },
  {
    icon: "☁️",
    title: "대구 D-데이터허브",
    description: "대구로페이 가맹점/결제 현황 및 구·군별 유동인구 데이터 연동",
    url: "https://data.daegu.go/",
  },
  {
    icon: "🖥️",
    title: "DIP 빅데이터활용센터",
    description: "대구 융복합 상권 분석 및 AI 매출 예측 모델 반영",
    url: "https://www.bigdata.go.kr/",
  },
];

const marketData: MarketMap = {
  "대구 중구": {
    카페: {
      "1천만 원 이하": { traffic: "9.2K", trafficLabel: "보통", sales: "1.8천", salesLabel: "보통", change: "전월 대비 5% 상승", insight: "중심 상권은 접근성과 유동인구가 좋아 초기 진입에도 유리합니다.", score: "72%", district: "중구" },
      "1천만~3천만 원": { traffic: "13.4K", trafficLabel: "높음", sales: "2.9천", salesLabel: "좋음", change: "전월 대비 8% 상승", insight: "중심 상권 소비층이 안정적으로 형성돼 있습니다.", score: "80%", district: "중구" },
      "3천만~5천만 원": { traffic: "16.7K", trafficLabel: "매우 높음", sales: "4.6천", salesLabel: "우수", change: "전월 대비 11% 상승", insight: "동선이 길고 유동성이 커서 매출 확장이 잘됩니다.", score: "88%", district: "중구" },
      "5천만 원 이상": { traffic: "12.5K", trafficLabel: "보통", sales: "6.8천", salesLabel: "강력", change: "전월 대비 13% 상승", insight: "프리미엄 카페 진출이 가능한 핵심 번화가입니다.", score: "90%", district: "중구" },
    },
    패션: {
      "1천만 원 이하": { traffic: "7.8K", trafficLabel: "낮음", sales: "1.4천", salesLabel: "보통", change: "전월 대비 3% 상승", insight: "중심 상권은 경쟁이 있지만 유동인구 밀도는 높습니다.", score: "60%", district: "중구" },
      "1천만~3천만 원": { traffic: "11.2K", trafficLabel: "보통", sales: "2.5천", salesLabel: "좋음", change: "전월 대비 7% 상승", insight: "캐주얼과 트렌드 소비가 함께 잘 형성돼 있습니다.", score: "74%", district: "중구" },
      "3천만~5천만 원": { traffic: "15.1K", trafficLabel: "높음", sales: "4.8천", salesLabel: "우수", change: "전월 대비 10% 상승", insight: "쇼핑 소비가 활발해 고급 브랜드와도 잘 맞습니다.", score: "84%", district: "중구" },
      "5천만 원 이상": { traffic: "13.4K", trafficLabel: "보통", sales: "6.9천", salesLabel: "강력", change: "전월 대비 12% 상승", insight: "프리미엄 패션 소비층이 집중돼 고수익 구조가 기대됩니다.", score: "87%", district: "중구" },
    },
    식당: {
      "1천만 원 이하": { traffic: "10.1K", trafficLabel: "보통", sales: "2.0천", salesLabel: "보통", change: "전월 대비 4% 상승", insight: "점심과 저녁 수요가 꾸준하게 이어지는 상권입니다.", score: "66%", district: "중구" },
      "1천만~3천만 원": { traffic: "15.8K", trafficLabel: "매우 높음", sales: "3.5천", salesLabel: "좋음", change: "전월 대비 10% 상승", insight: "식도락 소비와 근무 인구가 동시에 밀집돼 있습니다.", score: "81%", district: "중구" },
      "3천만~5천만 원": { traffic: "18.9K", trafficLabel: "매우 높음", sales: "5.2천", salesLabel: "우수", change: "전월 대비 13% 상승", insight: "중심 상권은 신선한 메뉴와 체인점을 동시에 뒷받침합니다.", score: "90%", district: "중구" },
      "5천만 원 이상": { traffic: "14.7K", trafficLabel: "높음", sales: "7.5천", salesLabel: "강력", change: "전월 대비 15% 상승", insight: "고급 식당 지향 고객이 많아 고마진 구조가 가능합니다.", score: "92%", district: "중구" },
    },
    뷰티: {
      "1천만 원 이하": { traffic: "8.2K", trafficLabel: "낮음", sales: "1.5천", salesLabel: "보통", change: "전월 대비 2% 상승", insight: "유입력이 있지만 브랜드 인지도 확대가 필요한 지역입니다.", score: "58%", district: "중구" },
      "1천만~3천만 원": { traffic: "12.0K", trafficLabel: "보통", sales: "2.6천", salesLabel: "좋음", change: "전월 대비 7% 상승", insight: "리뷰 기반 소비와 반복 방문이 잘 나타납니다.", score: "73%", district: "중구" },
      "3천만~5천만 원": { traffic: "14.8K", trafficLabel: "높음", sales: "4.8천", salesLabel: "우수", change: "전월 대비 9% 상승", insight: "고객이 많아 프리미엄 뷰티브랜드 진입에 유리합니다.", score: "82%", district: "중구" },
      "5천만 원 이상": { traffic: "12.2K", trafficLabel: "보통", sales: "6.6천", salesLabel: "강력", change: "전월 대비 11% 상승", insight: "고가 서비스 선호가 분명하게 나타나는 상권입니다.", score: "86%", district: "중구" },
    },
    교육: {
      "1천만 원 이하": { traffic: "7.4K", trafficLabel: "낮음", sales: "1.3천", salesLabel: "보통", change: "전월 대비 2% 상승", insight: "입지와 접근성이 좋지만 브랜드 인지도가 더 필요합니다.", score: "56%", district: "중구" },
      "1천만~3천만 원": { traffic: "10.9K", trafficLabel: "보통", sales: "2.4천", salesLabel: "좋음", change: "전월 대비 7% 상승", insight: "학원과 학습공간 수요가 안정적입니다.", score: "71%", district: "중구" },
      "3천만~5천만 원": { traffic: "14.4K", trafficLabel: "높음", sales: "4.9천", salesLabel: "우수", change: "전월 대비 10% 상승", insight: "교육 프로그램에 대한 수용성이 높은 중심지입니다.", score: "83%", district: "중구" },
      "5천만 원 이상": { traffic: "11.8K", trafficLabel: "보통", sales: "6.7천", salesLabel: "강력", change: "전월 대비 12% 상승", insight: "프리미엄 교육 시장으로 확장 가능성이 큽니다.", score: "87%", district: "중구" },
    },
  },
  "대구 북구": {
    카페: {
      "1천만 원 이하": { traffic: "8.1K", trafficLabel: "낮음", sales: "1.5천", salesLabel: "보통", change: "전월 대비 4% 상승", insight: "주거지와 유통망이 조합되어 초기 진입 성과가 안정적입니다.", score: "64%", district: "북구" },
      "1천만~3천만 원": { traffic: "12.2K", trafficLabel: "보통", sales: "2.6천", salesLabel: "좋음", change: "전월 대비 7% 상승", insight: "생활권 소비가 넓어서 꾸준한 방문객이 형성됩니다.", score: "75%", district: "북구" },
      "3천만~5천만 원": { traffic: "15.0K", trafficLabel: "높음", sales: "4.4천", salesLabel: "우수", change: "전월 대비 10% 상승", insight: "거리 상권의 회복력이 좋아 광고효과와 인지도 모두 양호합니다.", score: "84%", district: "북구" },
      "5천만 원 이상": { traffic: "11.3K", trafficLabel: "보통", sales: "6.1천", salesLabel: "강력", change: "전월 대비 12% 상승", insight: "프리미엄 감성 카페가 잘 어울리는 생활권입니다.", score: "86%", district: "북구" },
    },
    패션: {
      "1천만 원 이하": { traffic: "7.4K", trafficLabel: "낮음", sales: "1.2천", salesLabel: "보통", change: "전월 대비 2% 상승", insight: "생활형 소비가 많아 경쟁은 있지만 접근성은 좋습니다.", score: "58%", district: "북구" },
      "1천만~3천만 원": { traffic: "10.4K", trafficLabel: "보통", sales: "2.2천", salesLabel: "좋음", change: "전월 대비 6% 상승", insight: "대형 쇼핑성 점포와 일상 소비가 균형을 이룹니다.", score: "70%", district: "북구" },
      "3천만~5천만 원": { traffic: "13.7K", trafficLabel: "높음", sales: "4.5천", salesLabel: "우수", change: "전월 대비 9% 상승", insight: "브랜드와 로컬 점포 모두 수요가 계속 증가합니다.", score: "81%", district: "북구" },
      "5천만 원 이상": { traffic: "12.0K", trafficLabel: "보통", sales: "6.3천", salesLabel: "강력", change: "전월 대비 10% 상승", insight: "중고가 패션 수요가 활용 가능한 지역입니다.", score: "84%", district: "북구" },
    },
    식당: {
      "1천만 원 이하": { traffic: "9.5K", trafficLabel: "보통", sales: "1.9천", salesLabel: "보통", change: "전월 대비 4% 상승", insight: "주거지역 중심으로 꾸준한 식사 수요가 보입니다.", score: "65%", district: "북구" },
      "1천만~3천만 원": { traffic: "13.6K", trafficLabel: "높음", sales: "3.0천", salesLabel: "좋음", change: "전월 대비 8% 상승", insight: "점심 소비와 자기계발 수요가 함께 늘고 있습니다.", score: "77%", district: "북구" },
      "3천만~5천만 원": { traffic: "16.2K", trafficLabel: "매우 높음", sales: "4.9천", salesLabel: "우수", change: "전월 대비 11% 상승", insight: "고객 밀도가 높아 지역 대표 먹거리 상권으로 보입니다.", score: "88%", district: "북구" },
      "5천만 원 이상": { traffic: "12.8K", trafficLabel: "보통", sales: "7.0천", salesLabel: "강력", change: "전월 대비 13% 상승", insight: "고급의 식당 쪽 수요가 점점 증가하는 구역입니다.", score: "89%", district: "북구" },
    },
    뷰티: {
      "1천만 원 이하": { traffic: "7.2K", trafficLabel: "낮음", sales: "1.4천", salesLabel: "보통", change: "전월 대비 2% 상승", insight: "유지 비용 대비 고객 확보가 다소 느린 편입니다.", score: "57%", district: "북구" },
      "1천만~3천만 원": { traffic: "10.9K", trafficLabel: "보통", sales: "2.3천", salesLabel: "좋음", change: "전월 대비 6% 상승", insight: "반복 방문이 많고 평판형 소비가 강합니다.", score: "71%", district: "북구" },
      "3천만~5천만 원": { traffic: "13.3K", trafficLabel: "높음", sales: "4.3천", salesLabel: "우수", change: "전월 대비 9% 상승", insight: "브랜드 인지도와 리뷰 수요가 같이 늘어나는 중입니다.", score: "80%", district: "북구" },
      "5천만 원 이상": { traffic: "11.2K", trafficLabel: "보통", sales: "6.1천", salesLabel: "강력", change: "전월 대비 10% 상승", insight: "프리미엄 뷰티플랫폼 확장 가능성이 큽니다.", score: "83%", district: "북구" },
    },
    교육: {
      "1천만 원 이하": { traffic: "7.0K", trafficLabel: "낮음", sales: "1.2천", salesLabel: "보통", change: "전월 대비 1% 상승", insight: "초기 유입은 느리지만 장기 수업 성과는 기대됩니다.", score: "54%", district: "북구" },
      "1천만~3천만 원": { traffic: "10.6K", trafficLabel: "보통", sales: "2.2천", salesLabel: "좋음", change: "전월 대비 6% 상승", insight: "학부모와 학생 수요가 지속적으로 늘고 있습니다.", score: "69%", district: "북구" },
      "3천만~5천만 원": { traffic: "13.8K", trafficLabel: "높음", sales: "4.6천", salesLabel: "우수", change: "전월 대비 9% 상승", insight: "차별화된 교육 프로그램으로 고정 고객 확보가 가능합니다.", score: "81%", district: "북구" },
      "5천만 원 이상": { traffic: "11.5K", trafficLabel: "보통", sales: "6.2천", salesLabel: "강력", change: "전월 대비 11% 상승", insight: "프리미엄 교육에 대한 신규 수요가 점점 커지고 있습니다.", score: "84%", district: "북구" },
    },
  },
  "대구 수성구": {
    카페: {
      "1천만 원 이하": { traffic: "8.7K", trafficLabel: "보통", sales: "1.6천", salesLabel: "보통", change: "전월 대비 4% 상승", insight: "주거와 생활 편의가 함께 형성된 유망한 생활권입니다.", score: "68%", district: "수성구" },
      "1천만~3천만 원": { traffic: "13.5K", trafficLabel: "높음", sales: "2.8천", salesLabel: "좋음", change: "전월 대비 8% 상승", insight: "가족 단위 소비가 많아 장기 운영이 가능한 편입니다.", score: "78%", district: "수성구" },
      "3천만~5천만 원": { traffic: "16.4K", trafficLabel: "매우 높음", sales: "4.7천", salesLabel: "우수", change: "전월 대비 11% 상승", insight: "감성형 카페와 브랜딩이 잘 맞는 상권입니다.", score: "87%", district: "수성구" },
      "5천만 원 이상": { traffic: "12.3K", trafficLabel: "보통", sales: "6.4천", salesLabel: "강력", change: "전월 대비 13% 상승", insight: "프리미엄 소비층이 두드러져 고매출 가능성이 큽니다.", score: "89%", district: "수성구" },
    },
    패션: {
      "1천만 원 이하": { traffic: "7.9K", trafficLabel: "낮음", sales: "1.4천", salesLabel: "보통", change: "전월 대비 3% 상승", insight: "중간 가격대 소비가 많아 생활형 패션이 유리합니다.", score: "61%", district: "수성구" },
      "1천만~3천만 원": { traffic: "11.4K", trafficLabel: "보통", sales: "2.4천", salesLabel: "좋음", change: "전월 대비 7% 상승", insight: "브랜드 소비와 캐주얼 소비가 함께 형성됩니다.", score: "73%", district: "수성구" },
      "3천만~5천만 원": { traffic: "15.3K", trafficLabel: "높음", sales: "4.9천", salesLabel: "우수", change: "전월 대비 10% 상승", insight: "트렌드형 패션 수요와 생활권 밀도가 모두 높습니다.", score: "84%", district: "수성구" },
      "5천만 원 이상": { traffic: "13.1K", trafficLabel: "보통", sales: "7.1천", salesLabel: "강력", change: "전월 대비 12% 상승", insight: "프리미엄 소비층이 집중되는 대표 생활권입니다.", score: "88%", district: "수성구" },
    },
    식당: {
      "1천만 원 이하": { traffic: "9.8K", trafficLabel: "보통", sales: "1.9천", salesLabel: "보통", change: "전월 대비 4% 상승", insight: "가족 단위 소비가 많아 안정적인 방문 고객이 있습니다.", score: "67%", district: "수성구" },
      "1천만~3천만 원": { traffic: "14.1K", trafficLabel: "높음", sales: "3.4천", salesLabel: "좋음", change: "전월 대비 9% 상승", insight: "점심과 저녁 모두 수요가 꾸준히 쌓이고 있습니다.", score: "79%", district: "수성구" },
      "3천만~5천만 원": { traffic: "17.8K", trafficLabel: "매우 높음", sales: "5.3천", salesLabel: "우수", change: "전월 대비 12% 상승", insight: "동선이 길고 항시 소비층이 꾸준히 형성됩니다.", score: "90%", district: "수성구" },
      "5천만 원 이상": { traffic: "13.8K", trafficLabel: "보통", sales: "7.6천", salesLabel: "강력", change: "전월 대비 14% 상승", insight: "프리미엄 식당 수요가 뚜렷하게 늘고 있습니다.", score: "92%", district: "수성구" },
    },
    뷰티: {
      "1천만 원 이하": { traffic: "8.0K", trafficLabel: "낮음", sales: "1.4천", salesLabel: "보통", change: "전월 대비 2% 상승", insight: "고객층이 안정적이지만 인지도를 더 키워야 합니다.", score: "59%", district: "수성구" },
      "1천만~3천만 원": { traffic: "10.8K", trafficLabel: "보통", sales: "2.4천", salesLabel: "좋음", change: "전월 대비 6% 상승", insight: "월별 재방문율이 높아 장기 운영이 유리합니다.", score: "72%", district: "수성구" },
      "3천만~5천만 원": { traffic: "14.6K", trafficLabel: "높음", sales: "4.6천", salesLabel: "우수", change: "전월 대비 9% 상승", insight: "브랜드와 프리미엄 뷰티 수요가 동시에 강합니다.", score: "82%", district: "수성구" },
      "5천만 원 이상": { traffic: "12.1K", trafficLabel: "보통", sales: "6.9천", salesLabel: "강력", change: "전월 대비 11% 상승", insight: "고가 서비스 시장이 우수한 지역으로 보입니다.", score: "86%", district: "수성구" },
    },
    교육: {
      "1천만 원 이하": { traffic: "7.6K", trafficLabel: "낮음", sales: "1.2천", salesLabel: "보통", change: "전월 대비 1% 상승", insight: "유입은 느리지만 장기적 잠재력은 큽니다.", score: "55%", district: "수성구" },
      "1천만~3천만 원": { traffic: "11.0K", trafficLabel: "보통", sales: "2.5천", salesLabel: "좋음", change: "전월 대비 7% 상승", insight: "생활권 교육 수요가 꾸준히 증가 중입니다.", score: "73%", district: "수성구" },
      "3천만~5천만 원": { traffic: "14.9K", trafficLabel: "높음", sales: "4.9천", salesLabel: "우수", change: "전월 대비 10% 상승", insight: "학부모 유입과 정기 수강 수가 높은 편입니다.", score: "84%", district: "수성구" },
      "5천만 원 이상": { traffic: "12.4K", trafficLabel: "보통", sales: "6.8천", salesLabel: "강력", change: "전월 대비 12% 상승", insight: "프리미엄 교육 시장 확장 가능성이 가장 높습니다.", score: "88%", district: "수성구" },
    },
  },
  "대구 달서구": {
    카페: {
      "1천만 원 이하": { traffic: "8.3K", trafficLabel: "보통", sales: "1.6천", salesLabel: "보통", change: "전월 대비 4% 상승", insight: "가정과 직장인이 함께 밀집된 생활권입니다.", score: "65%", district: "달서구" },
      "1천만~3천만 원": { traffic: "12.6K", trafficLabel: "보통", sales: "2.7천", salesLabel: "좋음", change: "전월 대비 7% 상승", insight: "매일 방문이 가능한 편의형 상권입니다.", score: "76%", district: "달서구" },
      "3천만~5천만 원": { traffic: "15.1K", trafficLabel: "높음", sales: "4.3천", salesLabel: "우수", change: "전월 대비 10% 상승", insight: "생활필수 소비와 브랜딩이 모두 잘 맞습니다.", score: "84%", district: "달서구" },
      "5천만 원 이상": { traffic: "11.7K", trafficLabel: "보통", sales: "6.0천", salesLabel: "강력", change: "전월 대비 12% 상승", insight: "고급 카페 진출에도 적합한 생활권입니다.", score: "85%", district: "달서구" },
    },
    패션: {
      "1천만 원 이하": { traffic: "7.3K", trafficLabel: "낮음", sales: "1.3천", salesLabel: "보통", change: "전월 대비 2% 상승", insight: "생활형 소비와 저가 매장이 대부분입니다.", score: "57%", district: "달서구" },
      "1천만~3천만 원": { traffic: "10.2K", trafficLabel: "보통", sales: "2.1천", salesLabel: "좋음", change: "전월 대비 6% 상승", insight: "캐주얼 패션 수요가 안정적으로 유지됩니다.", score: "70%", district: "달서구" },
      "3천만~5천만 원": { traffic: "13.5K", trafficLabel: "높음", sales: "4.3천", salesLabel: "우수", change: "전월 대비 8% 상승", insight: "거주 밀집도가 높아 장기적으로도 성장 가능성이 큽니다.", score: "79%", district: "달서구" },
      "5천만 원 이상": { traffic: "11.4K", trafficLabel: "보통", sales: "6.1천", salesLabel: "강력", change: "전월 대비 9% 상승", insight: "중가형 패션은 수요가 꾸준히 나오는 지역입니다.", score: "82%", district: "달서구" },
    },
    식당: {
      "1천만 원 이하": { traffic: "9.2K", trafficLabel: "보통", sales: "1.8천", salesLabel: "보통", change: "전월 대비 4% 상승", insight: "주거지 밀집 지역이라 단골 수요가 강합니다.", score: "64%", district: "달서구" },
      "1천만~3천만 원": { traffic: "13.0K", trafficLabel: "높음", sales: "3.1천", salesLabel: "좋음", change: "전월 대비 8% 상승", insight: "식사와 간식 수요가 꾸준히 이어집니다.", score: "76%", district: "달서구" },
      "3천만~5천만 원": { traffic: "15.7K", trafficLabel: "매우 높음", sales: "4.8천", salesLabel: "우수", change: "전월 대비 11% 상승", insight: "주민 거주밀도와 접근성이 모두 좋은 상권입니다.", score: "87%", district: "달서구" },
      "5천만 원 이상": { traffic: "12.4K", trafficLabel: "보통", sales: "6.9천", salesLabel: "강력", change: "전월 대비 13% 상승", insight: "프리미엄 한식과 정통 요리를 선호하는 분위기가 있습니다.", score: "88%", district: "달서구" },
    },
    뷰티: {
      "1천만 원 이하": { traffic: "7.0K", trafficLabel: "낮음", sales: "1.3천", salesLabel: "보통", change: "전월 대비 2% 상승", insight: "소규모 매장 중심으로 안정적이지만 인지도가 낮습니다.", score: "56%", district: "달서구" },
      "1천만~3천만 원": { traffic: "10.2K", trafficLabel: "보통", sales: "2.1천", salesLabel: "좋음", change: "전월 대비 6% 상승", insight: "생활 밀착형 뷰티 업종 성장이 꾸준합니다.", score: "70%", district: "달서구" },
      "3천만~5천만 원": { traffic: "13.1K", trafficLabel: "높음", sales: "4.2천", salesLabel: "우수", change: "전월 대비 8% 상승", insight: "주민 재방문율이 높아 리뷰형 소비가 꾸준합니다.", score: "79%", district: "달서구" },
      "5천만 원 이상": { traffic: "10.9K", trafficLabel: "보통", sales: "5.9천", salesLabel: "강력", change: "전월 대비 10% 상승", insight: "고급 뷰티 시장 확장 잠재력이 있습니다.", score: "82%", district: "달서구" },
    },
    교육: {
      "1천만 원 이하": { traffic: "6.8K", trafficLabel: "낮음", sales: "1.1천", salesLabel: "보통", change: "전월 대비 1% 상승", insight: "지역별 입지 정체성이 약해 진입 전략이 중요합니다.", score: "54%", district: "달서구" },
      "1천만~3천만 원": { traffic: "10.0K", trafficLabel: "보통", sales: "2.2천", salesLabel: "좋음", change: "전월 대비 6% 상승", insight: "학습 공간과 보습 수요가 꾸준히 늘고 있습니다.", score: "68%", district: "달서구" },
      "3천만~5천만 원": { traffic: "13.2K", trafficLabel: "높음", sales: "4.4천", salesLabel: "우수", change: "전월 대비 8% 상승", insight: "교육 프로그램에 대한 만족도가 높습니다.", score: "80%", district: "달서구" },
      "5천만 원 이상": { traffic: "10.8K", trafficLabel: "보통", sales: "6.1천", salesLabel: "강력", change: "전월 대비 10% 상승", insight: "프리미엄 교육 및 보습 수요가 크게 늘고 있습니다.", score: "83%", district: "달서구" },
    },
  },
  "대구 동구": {
    카페: {
      "1천만 원 이하": { traffic: "7.8K", trafficLabel: "낮음", sales: "1.4천", salesLabel: "보통", change: "전월 대비 3% 상승", insight: "주거와 사무구역이 함께 있어 꾸준한 편의 소비가 있습니다.", score: "61%", district: "동구" },
      "1천만~3천만 원": { traffic: "11.4K", trafficLabel: "보통", sales: "2.3천", salesLabel: "좋음", change: "전월 대비 7% 상승", insight: "중심에서 멀지 않아 접근성이 좋은 편입니다.", score: "72%", district: "동구" },
      "3천만~5천만 원": { traffic: "14.0K", trafficLabel: "높음", sales: "4.0천", salesLabel: "우수", change: "전월 대비 9% 상승", insight: "감성형 감성 카페가 경쟁력을 가지는 지역입니다.", score: "81%", district: "동구" },
      "5천만 원 이상": { traffic: "10.7K", trafficLabel: "보통", sales: "5.8천", salesLabel: "강력", change: "전월 대비 11% 상승", insight: "프리미엄 소비층 유입이 빠르게 늘고 있습니다.", score: "84%", district: "동구" },
    },
    패션: {
      "1천만 원 이하": { traffic: "6.9K", trafficLabel: "낮음", sales: "1.2천", salesLabel: "보통", change: "전월 대비 2% 상승", insight: "생활권형 점포가 많아 진입 난이도는 낮습니다.", score: "55%", district: "동구" },
      "1천만~3천만 원": { traffic: "9.8K", trafficLabel: "보통", sales: "2.0천", salesLabel: "좋음", change: "전월 대비 5% 상승", insight: "캐주얼 패션이 안정적으로 판매되는 편입니다.", score: "68%", district: "동구" },
      "3천만~5천만 원": { traffic: "12.8K", trafficLabel: "높음", sales: "4.1천", salesLabel: "우수", change: "전월 대비 8% 상승", insight: "생활형 소비층이 많아 브랜드 확장이 쉽습니다.", score: "77%", district: "동구" },
      "5천만 원 이상": { traffic: "10.5K", trafficLabel: "보통", sales: "5.7천", salesLabel: "강력", change: "전월 대비 9% 상승", insight: "프리미엄 가격대의 수요는 꾸준히 늘고 있는 중입니다.", score: "80%", district: "동구" },
    },
    식당: {
      "1천만 원 이하": { traffic: "8.4K", trafficLabel: "보통", sales: "1.7천", salesLabel: "보통", change: "전월 대비 3% 상승", insight: "주간 근무 인구와 주민 수요가 균형을 이루고 있습니다.", score: "62%", district: "동구" },
      "1천만~3천만 원": { traffic: "12.3K", trafficLabel: "보통", sales: "3.0천", salesLabel: "좋음", change: "전월 대비 7% 상승", insight: "식사와 간식 수요가 반복적으로 유지됩니다.", score: "74%", district: "동구" },
      "3천만~5천만 원": { traffic: "14.7K", trafficLabel: "높음", sales: "4.7천", salesLabel: "우수", change: "전월 대비 10% 상승", insight: "먹거리 수요가 합리적 수준으로 꾸준히 유지됩니다.", score: "84%", district: "동구" },
      "5천만 원 이상": { traffic: "11.9K", trafficLabel: "보통", sales: "6.4천", salesLabel: "강력", change: "전월 대비 12% 상승", insight: "프리미엄 다이닝과 한식 시장 확장 가능성이 높습니다.", score: "86%", district: "동구" },
    },
    뷰티: {
      "1천만 원 이하": { traffic: "6.7K", trafficLabel: "낮음", sales: "1.2천", salesLabel: "보통", change: "전월 대비 1% 상승", insight: "브랜드 노출이 낮아 입지 전략이 중요합니다.", score: "53%", district: "동구" },
      "1천만~3천만 원": { traffic: "9.3K", trafficLabel: "보통", sales: "2.0천", salesLabel: "좋음", change: "전월 대비 5% 상승", insight: "생활 편의형 뷰티 매장이 익숙한 분위기입니다.", score: "68%", district: "동구" },
      "3천만~5천만 원": { traffic: "12.6K", trafficLabel: "높음", sales: "4.0천", salesLabel: "우수", change: "전월 대비 8% 상승", insight: "다시 찾는 고객이 많아 리뷰 기반 소비가 활발합니다.", score: "77%", district: "동구" },
      "5천만 원 이상": { traffic: "10.4K", trafficLabel: "보통", sales: "5.6천", salesLabel: "강력", change: "전월 대비 10% 상승", insight: "고급 뷰티 시장의 이동이 빠르게 늘고 있습니다.", score: "81%", district: "동구" },
    },
    교육: {
      "1천만 원 이하": { traffic: "6.3K", trafficLabel: "낮음", sales: "1.1천", salesLabel: "보통", change: "전월 대비 1% 상승", insight: "기본 교육 수요는 있으나 인지도가 필요합니다.", score: "52%", district: "동구" },
      "1천만~3천만 원": { traffic: "9.5K", trafficLabel: "보통", sales: "2.1천", salesLabel: "좋음", change: "전월 대비 6% 상승", insight: "학생과 학부모 수요가 밸런스 있게 형성됩니다.", score: "69%", district: "동구" },
      "3천만~5천만 원": { traffic: "12.9K", trafficLabel: "높음", sales: "4.2천", salesLabel: "우수", change: "전월 대비 8% 상승", insight: "교육성향이 높은 생활권으로 보입니다.", score: "79%", district: "동구" },
      "5천만 원 이상": { traffic: "10.6K", trafficLabel: "보통", sales: "5.9천", salesLabel: "강력", change: "전월 대비 10% 상승", insight: "프리미엄 교육 프로그램 진입 가능성이 있습니다.", score: "82%", district: "동구" },
    },
  },
};

const defaultStats: MarketStats = {
  traffic: "11.0K",
  trafficLabel: "보통",
  sales: "3.0천",
  salesLabel: "좋음",
  change: "전월 대비 8% 상승",
  insight: "기본 상권 데이터로 안정적인 성장이 기대됩니다.",
  score: "75%",
  district: "핵심 상권",
};

const noticeItems = {
  notice: [
    { title: "2026년 대구광역시 소상공인 경영안정자금 3차 접수 안내", date: "2026.09.05" },
    { title: "iM뱅크 대구로페이 가맹점 우대 금리 혜택 개정 안내", date: "2026.09.02" },
    { title: "소상공인 AI 사업계획서 자동 생성 서비스 오픈", date: "2026.09.01" },
    { title: "대구 중구·수성구 골목상권 활성화 지원사업 공모", date: "2026.08.28" },
  ],
  event: [
    { title: "iM뱅크 대구로페이 9월 특별 이벤트 오픈", date: "2026.09.06" },
    { title: "소상공인 금융 리모델링 무료 컨설팅 세미나", date: "2026.09.03" },
    { title: "AI 사업계획서 체험 이벤트 참여자 모집", date: "2026.08.30" },
    { title: "대구 전통시장 디지털 전환 페스티벌", date: "2026.08.24" },
  ],
} as const;

const appLinks = [
  {
    name: "iM뱅크",
    label: "iM뱅크",
    accent: "bg-emerald-500",
    icon: "iM",
    url: "https://www.imbank.co.kr/",
  },
  {
    name: "iM샵",
    label: "iM샵 (대구로페이)",
    accent: "bg-lime-400",
    icon: "#",
    url: "https://www.daegu.go/",
  },
  {
    name: "iM뱅크 기업",
    label: "iM뱅크 기업",
    accent: "bg-slate-800",
    icon: "iM",
    url: "https://www.imbank.co.kr/",
  },
] as const;

function AnimatedNumber({
  value,
  suffix = "",
  decimals = 0,
  duration = 1.2,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 90, damping: 22 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: "easeOut" as const,
      onUpdate: (latest) => setDisplayValue(Number(latest.toFixed(decimals))),
    });

    return () => controls.stop();
  }, [decimals, duration, motionValue, value]);

  const formattedValue = `${displayValue.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`;

  return <motion.span style={{ opacity: springValue ? 1 : 1 }}>{formattedValue}</motion.span>;
}
export default function Home()
{
  const [selectedRegion, setSelectedRegion] = useState("대구 중구");
  const [selectedIndustry, setSelectedIndustry] = useState("카페");
  const [selectedRevenue, setSelectedRevenue] = useState("3천만~5천만 원");
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isGlobalOpen, setIsGlobalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginLoadingProvider, setLoginLoadingProvider] = useState<string | null>(null);
  const [activeNoticeTab, setActiveNoticeTab] = useState<"notice" | "event">("notice");
  const [isMarketAnalysisOpen, setIsMarketAnalysisOpen] = useState(false);
  const [isMarketingModalOpen, setIsMarketingModalOpen] = useState(false);
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [isStartupMatchingOpen, setIsStartupMatchingOpen] = useState(false);
  const [startupStep, setStartupStep] = useState<1 | 2 | 3>(1);
  const [startupAge, setStartupAge] = useState("20-29세");
  const [startupRegion, setStartupRegion] = useState("중구");
  const [startupSeed, setStartupSeed] = useState("3천만 원");
  const [startupResult, setStartupResult] = useState("");
  const [marketingIndustry, setMarketingIndustry] = useState("카페");
  const [marketingEvent, setMarketingEvent] = useState("신메뉴 10% 할인");
  const [marketingTarget, setMarketingTarget] = useState("2030 대학생");
  const [marketingMode, setMarketingMode] = useState<"instagram" | "local" | "sms">("instagram");
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const [mapDistrict, setMapDistrict] = useState("대구 중구");
  const [mapIndustry, setMapIndustry] = useState("카페");
  const [mapMarker, setMapMarker] = useState<{ lat: number; lng: number; label: string }>({
    lat: 35.8714,
    lng: 128.6014,
    label: "대구시청",
  });
  const [reportLocationName, setReportLocationName] = useState("대구 중구 동인동");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);



  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const mapMarkerLayerRef = useRef<any | null>(null);
  const mapCircleLayerRef = useRef<any | null>(null);
  const isMapModalOpen = isMarketAnalysisOpen;
  const setIsMapModalOpen = setIsMarketAnalysisOpen;

  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 200);
    }
  }, [isMarketAnalysisOpen]);

  const mapIndustryOptions = ["카페", "음식점", "의류", "뷰티", "교육"];
  const mapDistrictOptions = ["대구 중구", "대구 북구", "대구 수성구", "대구 달서구", "대구 동구"];

  const districtCenterMap: Record<string, { lat: number; lng: number; dong: string }> = {
    "대구 중구": { lat: 35.8684, lng: 128.5945, dong: "동인동" },
    "대구 북구": { lat: 35.8855, lng: 128.5886, dong: "칠성동" },
    "대구 수성구": { lat: 35.8367, lng: 128.6617, dong: "범어동" },
    "대구 달서구": { lat: 35.8298, lng: 128.5322, dong: "두류동" },
    "대구 동구": { lat: 35.8866, lng: 128.6358, dong: "신암동" },
  };

  const districtAiMetrics: Record<string, { score: string; traffic: string; pay: string; insight: string }> = {
    "대구 중구": {
      score: "88점 (상위 12%)",
      traffic: "연령대 20대~40대, 점심·저녁시간대 집중",
      pay: "높음 (월평균 1,420건)",
      insight: "도심 접근성과 근무인구가 높아 카페·식당형 업종이 유리합니다.",
    },
    "대구 북구": {
      score: "84점 (상위 18%)",
      traffic: "가족·주거 밀집 지역, 주말 방문객 증가",
      pay: "중상 (월평균 1,120건)",
      insight: "생활밀착형 업종과 프랜차이즈 확장에 우수한 입지입니다.",
    },
    "대구 수성구": {
      score: "91점 (상위 9%)",
      traffic: "직장인·가족 수요가 안정적, 저녁 유동인구 높음",
      pay: "매우 높음 (월평균 1,680건)",
      insight: "프리미엄 소비층이 강해 서비스형 업종 성장이 기대됩니다.",
    },
    "대구 달서구": {
      score: "86점 (상위 15%)",
      traffic: "주거 지구 중심, 평일 점심·야간 피크",
      pay: "높음 (월평균 1,340건)",
      insight: "주민 밀집도가 높아 편의형·브랜딩형 매장에 적합합니다.",
    },
    "대구 동구": {
      score: "82점 (상위 20%)",
      traffic: "주간 직장인 유동 증가, 저녁 식사 수요 유지",
      pay: "중상 (월평균 1,090건)",
      insight: "접근성은 좋지만 추가 브랜드 인지가 필요한 지역입니다.",
    },
  };

  const currentMapMetrics = districtAiMetrics[mapDistrict] ?? districtAiMetrics["대구 중구"];

  const { districtPercentsComputed, regionalPayRate } = useMemo(() => {
    const payments: Record<string, number> = {};
    let total = 0;
    Object.entries(districtAiMetrics).forEach(([k, v]) => {
      const payText = v.pay || ""; // e.g. "높음 (월평균 1,420건)"
      const m = payText.match(/(\d{1,3}(?:,\d{3})*)/);
      const num = m ? Number(m[1].replace(/,/g, "")) : 0;
      payments[k] = num;
      total += num;
    });

    const districtPercentsComputed = Object.keys(payments).map((k) => ({
      name: k.replace(/^대구\s*/, ""),
      pct: total > 0 ? Math.round((payments[k] / total) * 100) : 0,
    }));

    const regionPay = payments[selectedRegion] ?? 0;
    const regionalPayRate = total > 0 ? Math.round((regionPay / total) * 100) : 0;

    return { districtPercentsComputed, regionalPayRate };
  }, [districtAiMetrics, selectedRegion]);

  const getDongNameFromCoordinates = (lat: number, lng: number) => {
    if (lat > 35.82 && lat < 35.86 && lng > 128.49 && lng < 128.57) return "대구 달서구 두류동";
    if (lat > 35.83 && lat < 35.88 && lng > 128.61 && lng < 128.68) return "대구 수성구 범어동";
    if (lat > 35.87 && lat < 35.91 && lng > 128.58 && lng < 128.64) return "대구 중구 동인동";
    if (lat > 35.88 && lat < 35.93 && lng > 128.56 && lng < 128.60) return "대구 북구 칠성동";
    if (lat > 35.86 && lat < 35.90 && lng > 128.62 && lng < 128.66) return "대구 동구 신암동";
    return "대구시청 인근";
  };

  const resolveDistrictFromCoordinates = (lat: number, lng: number) => {
    if (lat > 35.82 && lat < 35.87 && lng > 128.49 && lng < 128.58) return "대구 달서구";
    if (lat > 35.82 && lat < 35.89 && lng > 128.60 && lng < 128.69) return "대구 수성구";
    if (lat > 35.86 && lat < 35.90 && lng > 128.58 && lng < 128.64) return "대구 중구";
    if (lat > 35.88 && lat < 35.93 && lng > 128.56 && lng < 128.61) return "대구 북구";
    if (lat > 35.87 && lat < 35.90 && lng > 128.62 && lng < 128.67) return "대구 동구";
    return "대구 중구";
  };

  const currentData = useMemo(() => {
    const regionData = marketData[selectedRegion] ?? marketData["대구 중구"];
    const industryData = regionData[selectedIndustry] ?? regionData.카페;
    const baseEntry = industryData[selectedRevenue] ?? industryData["3천만~5천만 원"] ?? defaultStats;

    const rawScore = Number.parseInt((baseEntry.score ?? "75").replace("%", ""), 10) || 75;
    const regionAdjustment: Record<string, number> = {
      "대구 중구": 8,
      "대구 북구": 2,
      "대구 수성구": 12,
      "대구 달서구": 4,
      "대구 동구": -2,
    };
    const industryAdjustment: Record<string, number> = {
      카페: 6,
      패션: -4,
      식당: 12,
      뷰티: -8,
      교육: -10,
    };
    const revenueAdjustment: Record<string, number> = {
      "1천만 원 이하": -12,
      "1천만~3천만 원": -2,
      "3천만~5천만 원": 8,
      "5천만 원 이상": 15,
    };

    const adjustedScore = Math.min(
      96,
      Math.max(42, rawScore + (regionAdjustment[selectedRegion] ?? 0) + (industryAdjustment[selectedIndustry] ?? 0) + (revenueAdjustment[selectedRevenue] ?? 0)),
    );

    return {
      ...baseEntry,
      score: `${adjustedScore}%`,
    };
  }, [selectedRegion, selectedIndustry, selectedRevenue]);

  const handleSocialLogin = async (provider: string) => {
    setLoginLoadingProvider(provider);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    setSelectedRegion("대구 중구");
    setSelectedIndustry("카페");
    setSelectedRevenue("3천만~5천만 원");
    setLoginLoadingProvider(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const openExternalLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const updateMapPin = (lat: number, lng: number, label: string, districtName: string) => {
    setMapDistrict(districtName);
    setMapMarker({ lat, lng, label });
    setReportLocationName(getDongNameFromCoordinates(lat, lng));

    if (typeof window === "undefined" || !(window as any).L || !mapInstanceRef.current) {
      return;
    }

    const L = (window as any).L;
    if (mapMarkerLayerRef.current) {
      mapInstanceRef.current.removeLayer(mapMarkerLayerRef.current);
    }
    if (mapCircleLayerRef.current) {
      mapInstanceRef.current.removeLayer(mapCircleLayerRef.current);
    }

    const pinIcon = L.divIcon({
      className: "",
      html: `
        <div style="display:flex; align-items:center; justify-content:center; width:32px; height:32px; border-radius:9999px; border:2px solid rgba(255,255,255,0.95); background:rgba(16,185,129,0.18); box-shadow:0 10px 20px rgba(16,185,129,0.32); font-size:22px; line-height:1;">📍</div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    mapMarkerLayerRef.current = L.marker([lat, lng], { icon: pinIcon }).addTo(mapInstanceRef.current);
    mapCircleLayerRef.current = L.circle([lat, lng], {
      radius: 300,
      color: "#10b981",
      fillColor: "#34d399",
      fillOpacity: 0.2,
      weight: 2,
    }).addTo(mapInstanceRef.current);

    mapInstanceRef.current.flyTo([lat, lng], 12.6, { duration: 0.8 });
  };

  const handleGenerateReport = () => {
    const nextLabel = reportLocationName || getDongNameFromCoordinates(mapMarker.lat, mapMarker.lng);
    setReportLocationName(nextLabel);
    setIsReportModalOpen(true);
  };

  useEffect(() => {
    if (!isMarketAnalysisOpen || typeof window === "undefined") {
      return;
    }

    const initializeLeafletMap = () => {
      const Leaflet = (window as any).L;
      if (!Leaflet || !mapContainerRef.current || mapInstanceRef.current) return;

      if (Leaflet.Icon && Leaflet.Icon.Default) {
        const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
        const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";
        Leaflet.Icon.Default.mergeOptions({
          iconUrl,
          shadowUrl,
          iconRetinaUrl: iconUrl,
        });
      }

      const map = Leaflet.map(mapContainerRef.current, {
        center: [35.8714, 128.6014],
        zoom: 12,
        maxBounds: [
          [35.66, 128.36],
          [36.05, 128.9],
        ],
        maxBoundsViscosity: 1.0,
        zoomControl: true,
        attributionControl: true,
      });

      Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapInstanceRef.current = map;
      const defaultCenter = districtCenterMap[mapDistrict] ?? districtCenterMap["대구 중구"];
      updateMapPin(defaultCenter.lat, defaultCenter.lng, "대구시청", mapDistrict);

      map.on("click", (event: any) => {
        const lat = event.latlng.lat;
        const lng = event.latlng.lng;
        const districtName = resolveDistrictFromCoordinates(lat, lng);
        const nextLabel = getDongNameFromCoordinates(lat, lng);
        updateMapPin(lat, lng, nextLabel, districtName);
      });
    };

    const Leaflet = (window as any).L;
    if (Leaflet) {
      initializeLeafletMap();
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
        mapMarkerLayerRef.current = null;
        mapCircleLayerRef.current = null;
      };
    }

    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    styleLink.dataset.leafletStyle = "true";
    document.head.appendChild(styleLink);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.dataset.leafletScript = "true";
    script.onload = () => {
      initializeLeafletMap();
    };
    document.body.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      mapMarkerLayerRef.current = null;
      mapCircleLayerRef.current = null;
      setTimeout(() => {
        script.remove();
        styleLink.remove();
      }, 0);
    };
  }, [isMarketAnalysisOpen]);

  useEffect(() => {
    if (!isMarketAnalysisOpen || !mapInstanceRef.current || typeof window === "undefined") {
      return;
    }

    const target = districtCenterMap[mapDistrict] ?? districtCenterMap["대구 중구"];
    updateMapPin(target.lat, target.lng, `${mapDistrict} ${target.dong}`, mapDistrict);
  }, [mapDistrict, isMarketAnalysisOpen]);

  const heroBanners = [
    {
      key: "settlement" as const,
      subtitle: "대구 전통시장 사장님을 위한 든든한 AI 파트너",
      title: "전통시장 소상공인 매출·정산·세무 AI 도우미",
      description: "복잡한 세무 신고부터 대구로페이 정산 내역까지 AI가 자동으로 요약하고 분석해 드립니다.",
      cta: "정산 도우미 시작하기 >",
    },
    {
      key: "startup" as const,
      subtitle: "대구 청년 소상공인의 성공적인 첫걸음",
      title: "청년 창업 매칭 및 시드 금융 연결 AI",
      description: "iM뱅크 특례보증 금융과 지자체 창업 지원금을 매칭하여 시드 자금 마련을 도와드립니다.",
      cta: "창업 매칭 받아보기 >",
    },
    {
      key: "market" as const,
      subtitle: "DIP·공공 빅데이터 기반 상권 분석",
      title: "골목상권 데이터 기반 AI 컨설팅",
      description: "대구 구·군별 유동인구와 카드 매출 데이터를 바탕으로 내 매장의 최적 마케팅 전략을 제안합니다.",
      cta: "내 상권 진단하기 >",
    },
  ];

  const [bannerIndex, setBannerIndex] = useState(0);
  const [isBannerPaused, setIsBannerPaused] = useState(false);

  useEffect(() => {
    if (isBannerPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % heroBanners.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isBannerPaused, heroBanners.length]);

  const currentBanner = heroBanners[bannerIndex];

  const handleHeroBannerAction = (key: "settlement" | "startup" | "market") => {
    if (key === "settlement") {
      setIsSettlementModalOpen(true);
      return;
    }

    if (key === "startup") {
      setStartupStep(1);
      setStartupResult("");
      setIsStartupMatchingOpen(true);
      return;
    }

    setIsMapModalOpen(true);
  };

  const handleStartupMatch = () => {
    const regionLabel = startupRegion || "중구";
    const seedLabel = startupSeed || "3천만 원";
    const recommendation = `추천 매칭: ${regionLabel} 내 전통시장 입지형 창업 + iM뱅크 특례보증 1.5억 한도\n- 지자체 창업지원금: ${seedLabel} 범위의 초기 창업 자금 보전\n- 보증지원: 1차 특례보증 우대 금리 적용\n- 추천 조합: 대구시 청년 창업 시드 지원 + iM뱅크 소상공인 대출 연결`;
    setStartupResult(recommendation);
    setStartupStep(3);
  };

  const goToBanner = (offset: number) => {
    setBannerIndex((prev) => (prev + offset + heroBanners.length) % heroBanners.length);
  };

  const entranceVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  const { lang, setLang, t } = useLanguage();
  const quickActions = [
    { label: "📍 " + t.quick1, key: "market" },
    { label: "💰 " + t.quick2, key: "grant" },
    { label: "🏦 " + t.quick3, key: "finance" },
    { label: "📄 " + t.quick4, key: "generator" },
    { label: "📣 " + t.quick5, key: "marketing" },
  ];
  const languageOptions = ["KO", "EN", "JP", "ZH"] as const;
  const languageLabelMap = {
    KO: "한국어",
    EN: "English",
    JP: "日本語",
    ZH: "中文",
  } as const;

  const heroTitle = isLoggedIn ? t.heroGreeting : t.heroTitle;

  const heroSubtitle = isLoggedIn ? t.heroWelcomeSubtitle : t.heroSub;

  const guideLabel = t.navGuide;

  const marketingCopy = useMemo(() => {
    const industry = marketingIndustry || "카페";
    const event = marketingEvent || "신메뉴 10% 할인";
    const target = marketingTarget || "2030 대학생";

    const instagramBase = {
      KO: `✨ ${industry}에서 ${event}!\n\n우리 매장만의 특별한 분위기와 맛으로 한정된 혜택을 준비했어요. ${target}분들께 딱 맞는 공간에서 여유로운 시간 보내세요!\n\n📍 대구 동성로 / 중구 중심 상권\n💬 지금 바로 방문해 주세요\n\n#대구맛집 #${industry} #${target.replace(/\s+/g, "")} #동성로맛집 #대구로페이`,
      EN: `✨ ${industry} is hosting ${event}!\n\nWe prepared a special offer and cozy vibe for our customers. Perfect for ${target} looking for a memorable visit.\n\n📍 Central Daegu area\n💬 Visit us today!\n\n#DaeguFood #${industry} #${target.replace(/\s+/g, "")} #SmallBusinessPromotion`,
      JP: `✨ ${industry}で${event}を開催中！\n\n落ち着いた空間と特別な味で、${target}の皆さまにぴったりの時間を提供しています。\n\n📍 大邱中心商圏\n💬 ぜひお越しください\n\n#大邱グルメ #${industry} #${target.replace(/\s+/g, "")} #おすすめスポット`,
      ZH: `✨ ${industry}正在举办${event}！\n\n我们为${target}准备了独特氛围与优惠体验，欢迎来店感受不一样的消费体验。\n\n📍 大邱核心商圈\n💬 现在就来看看吧\n\n#大邱美食 #${industry} #${target.replace(/\s+/g, "")} #本地好店`,
    } as const;

    const localBase = {
      KO: `동네 주민분들께 ${industry} ${event} 소식을 전해드립니다!\n\n우리 동네에서 부담 없이 즐길 수 있는 혜택과 분위기를 준비했어요. ${target} 고객님께 딱 맞는 기회입니다.\n\n📌 오늘부터 한정 기간\n📍 대구 중구/동성로 인근\n💬 문의는 댓글 또는 문자로 부탁드립니다.`,
      EN: `Hello neighbors! We are running ${event} at ${industry}.\n\nA friendly, value-focused offer for ${target} customers is available for a limited time.\n\n📌 Limited-time event\n📍 Near central Daegu\n💬 Reach out by message for details.`,
      JP: `${industry}で${event}を開催します！\n\n地域の皆さまに親しみやすい価格と雰囲気で、${target}の方におすすめの機会です。\n\n📌 期間限定\n📍 大邱中心部周辺\n💬 気になる方はDMまたは電話でお問い合わせください。`,
      ZH: `各位邻里朋友，${industry}正在举办${event}！\n\n我们为${target}打造了轻松愉快的消费体验，限时优惠，欢迎来到本地店铺。\n\n📌 限时活动\n📍 大邱市中心附近\n💬 详情可留言咨询。`,
    } as const;

    const smsBase = {
      KO: `안녕하세요. ${industry}입니다.\n\n${event} 이벤트를 진행 중이며, ${target} 고객님께 딱 맞는 혜택을 준비했습니다.\n\n📌 기간: 이번 주 한정\n📍 위치: 대구 중심 상권\n💬 방문 전 예약 가능\n\n대구로페이 결제 시 추가 혜택도 함께 받을 수 있습니다.`,
      EN: `Hello, this is ${industry}.\n\nWe are running ${event} and prepared a special offer for ${target} customers.\n\n📌 Limited period\n📍 Central Daegu\n💬 Reservation available\n\nDaegu Pay members can also enjoy extra benefits.`,
      JP: `こんにちは。${industry}です。\n\n${event}を実施中で、${target}の皆さまにぴったりの特典を用意しました。\n\n📌 期間限定\n📍 大邱中心部\n💬 事前予約可能\n\n大邱ローペイ決済でも追加特典があります。`,
      ZH: `您好，这里是${industry}。\n\n我们正在开展${event}活动，专门为${target}客户准备了优惠。\n\n📌 限时活动\n📍 大邱市中心\n💬 可提前预约\n\n使用大邱Pay支付还可享额外优惠。`,
    } as const;

    return {
      instagram: instagramBase[lang],
      local: localBase[lang],
      sms: smsBase[lang],
    };
  }, [lang, marketingEvent, marketingIndustry, marketingTarget]);

  const nextLanguage = () => {
    const currentIndex = languageOptions.indexOf(lang);
    const nextIndex = (currentIndex + 1) % languageOptions.length;
    setLang(languageOptions[nextIndex]);
  };
  

  return (
    <main className="min-h-screen bg-[#edf8ef] text-slate-800">
      <header className="bg-emerald-600 text-white shadow-[0_16px_32px_rgba(5,150,105,0.18)]">
        <div className="mx-auto max-w-[1180px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex max-w-full items-center justify-between gap-2 overflow-x-auto">
            <div className="flex shrink-0 items-center gap-3 md:gap-5">
              <div className="flex shrink-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-base font-extrabold ring-1 ring-white/20">
                  iM
                </div>
                <div className="shrink-0 leading-none">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100">소상공인</div>
                  <div className="mt-0.5 text-lg font-extrabold">플랫폼</div>
                </div>
              </div>
            
              <Link
                href="/guide"
                className="hidden whitespace-nowrap break-keep px-2 py-1 text-xs font-medium text-emerald-50 transition hover:text-white md:inline-flex md:text-sm"
              >
                {guideLabel}
              </Link>
            </div>

            <div className="flex shrink-0 items-center gap-2 md:gap-3">
              <button
                type="button"
                onClick={nextLanguage}
                className="shrink-0 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/15"
              >
                {languageLabelMap[lang]} ▾
              </button>

              <button
                type="button"
                onClick={() => setIsGlobalOpen(true)}
                className="ml-2 hidden rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/15 md:inline-flex"
              >
                🌐 {lang === "KO" ? "글로벌" : lang === "EN" ? "Global" : lang === "JP" ? "グローバル" : "全球"}
              </button>

              {!isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50 sm:inline-flex"
                >
                  {t.login}
                </button>
              ) : (
                <div className="hidden shrink-0 items-center gap-2 sm:flex">
                  <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-2 py-1">
                    <span className="rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-bold text-white">K</span>
                    <span className="text-sm font-medium text-white">김사장님</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="shrink-0 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/15"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <motion.section
            initial="hidden"
            animate="visible"
            variants={entranceVariants}
            className="relative mx-auto my-6 overflow-hidden rounded-[28px] bg-white p-8 shadow-[0_12px_28px_rgba(13,148,136,0.08)] md:p-12 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.10),_transparent_30%)]" />
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45, ease: "easeOut" as const }}
                className="transition-all duration-700 ease-in-out"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  {currentBanner.subtitle}
                </p>
                <h2 className="mt-4 max-w-xl text-2xl font-bold text-gray-900 md:text-3xl">
                  {currentBanner.title}
                </h2>
                <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">
                  {currentBanner.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleHeroBannerAction(currentBanner.key)}
                    className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500"
                  >
                    {currentBanner.cta}
                  </button>
                </div>
                {/* AI 실시간 연동 뱃지 (우측) */}
                <div className="pointer-events-none absolute right-6 top-6 hidden h-32 w-40 transform-gpu items-center justify-center rounded-2xl p-4 text-center md:flex">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-2xl p-4 shadow-md flex flex-col justify-center items-center">
                    <div className="text-sm font-semibold">AI 데이터 실시간 연동 중 ⚡</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative mt-8 flex flex-col gap-4 border-t border-emerald-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              {heroBanners.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setBannerIndex(index)}
                  className={`h-3 w-3 rounded-full transition-all ${
                    index === bannerIndex ? "w-7 bg-emerald-600" : "bg-emerald-200"
                  }`}
                  aria-label={`배너 ${index + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsBannerPaused((prev) => !prev)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-lg text-emerald-700 transition hover:bg-emerald-100"
                aria-label={isBannerPaused ? "재생" : "일시정지"}
              >
                {isBannerPaused ? "▶" : "⏸"}
              </button>
              <button
                type="button"
                onClick={() => goToBanner(-1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-lg text-emerald-700 transition hover:bg-emerald-100"
                aria-label="이전 슬라이드"
              >
                &lt;
              </button>
              <button
                type="button"
                onClick={() => goToBanner(1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-lg text-emerald-700 transition hover:bg-emerald-100"
                aria-label="다음 슬라이드"
              >
                &gt;
              </button>
            </div>
          </div>
        </motion.section>

        <div className="mx-auto my-3 max-w-6xl rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-slate-700">
              <span aria-hidden="true">🚨</span>
              <span className="whitespace-nowrap font-semibold text-emerald-800">[실시간 정책 알림]</span>
              <span className="truncate">"대구 중구 소상공인 경영안정자금 3차 접수 마감까지 D-3!"</span>
            </div>
            <button
              type="button"
              className="shrink-0 text-xs font-bold text-emerald-700 transition hover:text-emerald-800"
            >
              [지금 바로 신청하기 &gt;]
            </button>
          </div>
        </div>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={entranceVariants}
          transition={{ delay: 0.08, duration: 0.5 }}
          className="rounded-[30px] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[1.45fr_0.55fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700 ring-1 ring-emerald-100">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {t.summaryLabel}
              </div>

              <h1 className="mt-4 max-w-xl text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
                {heroTitle}
              </h1>

              <p className="mt-3 max-w-2xl text-base text-slate-600 md:text-lg">
                {heroSubtitle}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-600">{t.region}</span>
                  <select
                    value={selectedRegion}
                    onChange={(event) => setSelectedRegion(event.target.value)}
                    className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-3 text-base text-slate-800 outline-none ring-0 transition focus:border-emerald-300 focus:bg-white"
                  >
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-600">{t.industry}</span>
                  <select
                    value={selectedIndustry}
                    onChange={(event) => setSelectedIndustry(event.target.value)}
                    className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-3 text-base text-slate-800 outline-none ring-0 transition focus:border-emerald-300 focus:bg-white"
                  >
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-600">{t.revenue}</span>
                  <select
                    value={selectedRevenue}
                    onChange={(event) => setSelectedRevenue(event.target.value)}
                    className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-3 text-base text-slate-800 outline-none ring-0 transition focus:border-emerald-300 focus:bg-white"
                  >
                    {revenueRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAiOpen(true)}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500"
                >
                  {t.aiConsult}
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-5 shadow-[0_18px_40px_rgba(16,185,129,0.08)]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-emerald-800">{t.performance}</p>
                <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                  Live
                </span>
              </div>

              <div className="mt-5 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>대구로페이 결제 비중</span>
                  <span className="font-bold text-emerald-700">28%</span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-emerald-100">
                  <div className="h-full w-[28%] rounded-full bg-gradient-to-r from-emerald-500 to-green-400" />
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <motion.div whileHover={{ y: -4, scale: 1.01 }} className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">{t.cardSales}</div>
                  <div className="mt-2 text-2xl font-extrabold text-emerald-950">
                    <AnimatedNumber value={1420} suffix="만" />
                  </div>
                  <div className="mt-1 text-sm font-medium text-emerald-700">+8.5% 전월 대비</div>
                </motion.div>
                <motion.div whileHover={{ y: -4, scale: 1.01 }} className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">{t.cardRate}</div>
                  <div className="mt-2 text-2xl font-extrabold text-emerald-950">
                    <AnimatedNumber value={0.5} suffix="%p" decimals={1} />
                  </div>
                  <div className="mt-1 text-sm font-medium text-emerald-700">월 12.5만 절감</div>
                </motion.div>
              </div>

              <div className="mt-4 rounded-[22px] bg-emerald-600 p-4 text-white shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-[0.12em] text-emerald-100">예상 적합도</span>
                  <span className="text-lg font-bold"><AnimatedNumber value={Number.parseInt(currentData.score, 10) || 88} suffix="%" /></span>
                </div>
                <div className="mt-3 text-sm text-emerald-50">
                  {selectedRegion} · {selectedIndustry} 업종에 가장 적합한 금융/지원 조건을 선별 중입니다.
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <DataSummary region={selectedRegion} districtPercents={districtPercentsComputed} payRate={regionalPayRate} />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          {quickActions.map((action) => (
            <motion.button
              key={action.key}
              type="button"
              variants={entranceVariants}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (action.key === "generator") {
                  window.location.href = "/generator";
                  return;
                }
                if (action.key === "grant") {
                  window.location.href = "/grants";
                  return;
                }
                if (action.key === "ai") {
                  setIsAiOpen(true);
                  return;
                }
                if (action.key === "market") {
                  setIsMarketAnalysisOpen(true);
                  return;
                }
                if (action.key === "finance") {
                  window.location.href = "/im-rate";
                  return;
                }
                if (action.key === "marketing") {
                  setIsMarketingModalOpen(true);
                  return;
                }
                setIsAiOpen(true);
              }}
              className="rounded-[22px] border border-emerald-200 bg-white px-4 py-4 text-left shadow-[0_10px_28px_rgba(16,185,129,0.06)] transition hover:border-emerald-300 hover:shadow-[0_14px_28px_rgba(16,185,129,0.12)]"
            >
              <div className="text-lg">{action.label.split(" ")[0]}</div>
              <div className="mt-2 text-sm font-semibold text-slate-700">{action.label.replace(/^\S+\s/, "")}</div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      <div className="mx-auto my-8 max-w-[1180px] px-4">
        <Testimonials />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={entranceVariants}
            className="lg:col-span-2 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="relative flex items-center gap-4">
                {(["notice", "event"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveNoticeTab(tab)}
                    className={`relative z-10 pb-2 text-sm font-medium transition ${
                      activeNoticeTab === tab ? "text-emerald-600 font-bold" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {tab === "notice" ? t.notice : t.event}
                    {activeNoticeTab === tab && (
                      <motion.span
                        layoutId="notice-tab-underline"
                        className="absolute inset-x-0 -bottom-[11px] h-[2px] rounded-full bg-emerald-600"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <button type="button" className="text-xs text-gray-500 transition hover:text-gray-800">
                {t.more} +
              </button>
            </div>

            <ul className="space-y-3">
              {noticeItems[activeNoticeTab].map((item) => (
                <li key={`${activeNoticeTab}-${item.title}`} className="flex items-center justify-between gap-4">
                  <button type="button" className="truncate text-left text-sm text-gray-700 transition hover:text-emerald-600 cursor-pointer">
                    {item.title}
                  </button>
                  <span className="shrink-0 text-xs text-gray-400">{item.date}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={entranceVariants}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            <h3 className="mb-4 text-base font-bold text-gray-900">{t.appTitle}</h3>
            <div className="flex items-center justify-around gap-4">
              {appLinks.map((app) => (
                <button
                  key={app.name}
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.open(app.url, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-base font-black text-white shadow-sm ${app.accent}`}
                  >
                    {app.icon}
                  </div>
                  <span className="mt-2 text-center text-[11px] font-medium text-gray-700">{app.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>





      <section className="mx-auto mt-8 max-w-[1180px] rounded-[28px] border border-emerald-200 bg-white/80 p-6 shadow-[0_18px_40px_rgba(16,185,129,0.06)] backdrop-blur-sm">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">공공 데이터 활용 및 데이터 출처 안내</p>
          <h3 className="text-2xl font-extrabold tracking-tight text-emerald-950">
            AI 상권 분석은 실시간 공공 데이터와 정책 정보를 기반으로 생성됩니다.
          </h3>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {dataSourceCards.map((card) => (
            <button
              key={card.title}
              type="button"
              onClick={() => openExternalLink(card.url)}
              className="group rounded-[24px] border border-emerald-200 bg-gradient-to-br from-white to-emerald-50 p-5 text-left shadow-sm shadow-emerald-100 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
            >
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-2xl shadow-sm">
                {card.icon}
              </div>
              <p className="text-base font-extrabold text-emerald-950">{card.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-700">
                데이터 보기 →
              </span>
            </button>
          ))}
        </div>
      </section>

      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-emerald-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,118,110,0.25)]">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">대구시 소상공인 맞춤 지원 모바일 플랫폼</p>
              <h3 className="mt-3 text-2xl font-extrabold text-emerald-950">3초 만에 로그인하고</h3>
              <p className="mt-2 text-sm text-slate-600">내 매장 맞춤 지원금과 상권 분석을 받아보세요.</p>
            </div>

            <div className="mt-6 space-y-3">
              <p className="text-center text-sm text-slate-500">
                로그인 기능은 준비 중입니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {isSettlementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-[32px] border border-emerald-200 bg-white shadow-[0_30px_80px_rgba(15,118,110,0.2)]">
            <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-600 px-5 py-4 text-white sm:px-6">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100">전통시장 AI 정산 대시보드</div>
                <h3 className="mt-1 text-xl font-extrabold">대구로페이 정산 요약</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSettlementModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg font-bold transition hover:bg-white/15"
                aria-label="정산 대시보드 닫기"
              >
                ×
              </button>
            </div>

            <div className="grid gap-4 bg-slate-50 p-5 md:grid-cols-3">
              <div className="rounded-[22px] border border-emerald-100 bg-white p-4 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">일별 정산</div>
                <div className="mt-3 text-2xl font-extrabold text-emerald-700">₩ 1,240,800</div>
                <div className="mt-2 text-sm text-slate-600">전일 대비 +8.2%</div>
              </div>
              <div className="rounded-[22px] border border-emerald-100 bg-white p-4 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">주별 정산</div>
                <div className="mt-3 text-2xl font-extrabold text-emerald-700">₩ 7,480,000</div>
                <div className="mt-2 text-sm text-slate-600">이번 주 누적 합계</div>
              </div>
              <div className="rounded-[22px] border border-emerald-100 bg-white p-4 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">세무 체크</div>
                <div className="mt-3 text-2xl font-extrabold text-emerald-700">92점</div>
                <div className="mt-2 text-sm text-slate-600">AI 점검 상태 양호</div>
              </div>
            </div>

            <div className="grid gap-5 p-5 md:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[24px] border border-emerald-100 bg-emerald-50 p-4">
                <div className="text-base font-extrabold text-emerald-900">AI 세무/부가세 체크리스트</div>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  <li>• 전자세금계산서 매칭 상태: 정상</li>
                  <li>• 부가세 신고 누락 항목: 0건</li>
                  <li>• 카드 매출-현금 매출 정합성: 97.2%</li>
                  <li>• 영수증 자동 분류 상태: 5개 미확인 항목 보정 필요</li>
                </ul>
              </div>

              <div className="rounded-[24px] border border-emerald-100 bg-white p-4 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="text-base font-extrabold text-emerald-900">영수증 요약</div>
                <div className="mt-3 space-y-3 text-sm text-slate-700">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <div className="font-semibold text-slate-800">오늘 정산 리포트</div>
                    <div className="mt-1">✅ 23건 매출 반영</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <div className="font-semibold text-slate-800">주간 정산 리포트</div>
                    <div className="mt-1">✅ 세무 서류 자동 정리 완료</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => setIsSettlementModalOpen(false)}
                className="w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500"
              >
                정산 리포트 확인하기
              </button>
            </div>
          </div>
        </div>
      )}

      {isStartupMatchingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-[32px] border border-emerald-200 bg-white shadow-[0_30px_80px_rgba(15,118,110,0.2)]">
            <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-600 px-5 py-4 text-white sm:px-6">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100">청년 창업 시드 금융 매칭</div>
                <h3 className="mt-1 text-xl font-extrabold">Step {startupStep}</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsStartupMatchingOpen(false);
                  setStartupStep(1);
                  setStartupResult("");
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg font-bold transition hover:bg-white/15"
                aria-label="창업 매칭 닫기"
              >
                ×
              </button>
            </div>

            <div className="p-5">
              {startupStep === 1 && (
                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">[1단계: 나이/지역]</p>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-slate-600">나이대</span>
                        <select
                          value={startupAge}
                          onChange={(event) => setStartupAge(event.target.value)}
                          className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-300"
                        >
                          <option value="20-29세">20-29세</option>
                          <option value="30-34세">30-34세</option>
                          <option value="35-39세">35-39세</option>
                        </select>
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-slate-600">희망 지역</span>
                        <select
                          value={startupRegion}
                          onChange={(event) => setStartupRegion(event.target.value)}
                          className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-300"
                        >
                          <option value="중구">중구</option>
                          <option value="북구">북구</option>
                          <option value="수성구">수성구</option>
                          <option value="달서구">달서구</option>
                        </select>
                      </label>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStartupStep(2)}
                    className="w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500"
                  >
                    다음 단계로
                  </button>
                </div>
              )}

              {startupStep === 2 && (
                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">[2단계: 필요한 시드 자금]</p>
                    <label className="mt-3 block">
                      <span className="mb-2 block text-sm font-medium text-slate-600">필요 자금 규모</span>
                      <select
                        value={startupSeed}
                        onChange={(event) => setStartupSeed(event.target.value)}
                        className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-300"
                      >
                        <option value="1천만 원">1천만 원</option>
                        <option value="3천만 원">3천만 원</option>
                        <option value="5천만 원">5천만 원</option>
                        <option value="1억 원">1억 원</option>
                      </select>
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartupMatch}
                    className="w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500"
                  >
                    AI 매칭 결과보기
                  </button>
                </div>
              )}

              {startupStep === 3 && (
                <div className="space-y-5">
                  <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4">
                    <div className="text-sm font-semibold text-emerald-800">AI 매칭 결과</div>
                    <div className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">{startupResult || "추천 결과를 생성할 수 없습니다."}</div>
                  </div>

                  <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    <div className="font-semibold text-slate-800">추천 조건</div>
                    <div className="mt-2">• 나이대: {startupAge}</div>
                    <div>• 지역: {startupRegion}</div>
                    <div>• 신청 자금: {startupSeed}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsStartupMatchingOpen(false);
                      setStartupStep(1);
                      setStartupResult("");
                    }}
                    className="w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500"
                  >
                    완료
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isMarketAnalysisOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[1180px] overflow-hidden rounded-[32px] border border-emerald-200 bg-white shadow-[0_30px_80px_rgba(15,118,110,0.2)]">
            <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-600 px-5 py-4 text-white sm:px-6">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100">Daegu City</div>
                <h3 className="mt-1 text-xl font-extrabold">{t.marketAnalysisTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMarketAnalysisOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg font-bold transition hover:bg-white/15"
                aria-label="닫기"
              >
                ×
              </button>
            </div>

            <div className="flex max-h-[80vh] flex-col overflow-hidden lg:flex-row">
              <div className="relative min-h-[420px] flex-1 bg-[#ecfdf5] p-4 lg:min-h-0">
                <div className="relative h-[500px] w-full overflow-hidden rounded-2xl border border-emerald-200 shadow-inner">
                  <div ref={mapContainerRef} className="h-full w-full overflow-hidden rounded-2xl" />
                </div>
                <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-[11px] font-bold text-emerald-700 shadow-sm backdrop-blur-sm">
                  대구광역시 범위 내 분석
                </div>
              </div>

              <div className="w-full border-t border-emerald-100 bg-slate-50 p-5 lg:w-[360px] lg:border-l lg:border-t-0">
                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-600">{t.marketDistrict}</span>
                    <select
                      value={mapDistrict}
                      onChange={(event) => {
                        const district = event.target.value;
                        const center = districtCenterMap[district] ?? districtCenterMap["대구 중구"];
                        setMapDistrict(district);
                        setMapMarker({
                          lat: center.lat,
                          lng: center.lng,
                          label: `${district} ${center.dong}`,
                        });
                        setReportLocationName(`${district} ${center.dong}`);
                      }}
                      className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-300"
                    >
                      {mapDistrictOptions.map((district) => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-600">{t.marketIndustry}</span>
                    <select
                      value={mapIndustry}
                      onChange={(event) => setMapIndustry(event.target.value)}
                      className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-300"
                    >
                      {mapIndustryOptions.map((industry) => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-5 rounded-[24px] border border-emerald-200 bg-white p-4 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">{t.marketScore}</span>
                    <span className="text-right text-lg font-extrabold text-emerald-700">{currentMapMetrics.score}</span>
                  </div>
                  <div className="mt-3 h-2.5 rounded-full bg-emerald-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400"
                      style={{ width: `${Number.parseInt(currentMapMetrics.score, 10) || 88}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{currentMapMetrics.insight}</p>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-emerald-100 bg-white p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{t.marketTraffic}</p>
                    <p className="mt-2 text-sm font-bold text-slate-800">{currentMapMetrics.traffic}</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-100 bg-white p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{t.marketDaeguPay}</p>
                    <p className="mt-2 text-sm font-bold text-slate-800">{currentMapMetrics.pay}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateReport}
                  className="mt-5 w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500"
                >
                  {t.marketReportGenerate}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isReportModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-emerald-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,118,110,0.2)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">AI 리포트 생성</p>
                <h3 className="mt-2 text-2xl font-extrabold text-emerald-950">{reportLocationName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-lg text-emerald-700 transition hover:bg-emerald-100"
                aria-label="리포트 모달 닫기"
              >
                ×
              </button>
            </div>

            <div className="mt-5 rounded-[22px] border border-emerald-100 bg-emerald-50 p-4">
              <div className="text-sm font-semibold text-emerald-900">상권 분석 요약</div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                <li>• {mapIndustry} 업종 기준, {mapDistrict} 지역의 잠재 고객층이 안정적으로 형성되어 있습니다.</li>
                <li>• {currentMapMetrics.traffic}</li>
                <li>• {currentMapMetrics.pay} 기준으로 결제 확장성이 우수합니다.</li>
              </ul>
            </div>

            <div className="mt-5 rounded-[18px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              <div className="font-semibold text-slate-800">추천 실무 조치</div>
              <p className="mt-2">주간 피크 타임 집중 프로모션, 대구로페이 결제 인센티브, 내점 유도형 SNS 광고를 병행하면 매출 반응을 높일 수 있습니다.</p>
            </div>

            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="mt-6 w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500"
            >
              보고서 저장 및 확인
            </button>
          </div>
        </div>
      )}

      {isMarketingModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-emerald-200 bg-white shadow-[0_30px_80px_rgba(15,118,110,0.2)]">
            <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-600 px-5 py-4 text-white sm:px-6">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100">AI marketing</div>
                <h3 className="mt-1 text-xl font-extrabold">{t.marketingTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMarketingModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg font-bold transition hover:bg-white/15"
                aria-label="닫기"
              >
                ×
              </button>
            </div>

            <div className="grid gap-0 lg:grid-cols-[420px_1fr]">
              <div className="border-b border-emerald-100 bg-emerald-50/60 p-5 lg:border-b-0 lg:border-r">
                <p className="text-sm leading-6 text-slate-600">{t.marketingSubtitle}</p>

                <div className="mt-5 space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">{t.marketingIndustryLabel}</span>
                    <select
                      value={marketingIndustry}
                      onChange={(event) => setMarketingIndustry(event.target.value)}
                      className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-300"
                    >
                      {['카페', '음식점', '뷰티', '패션', '교육'].map((industry) => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">{t.marketingEventLabel}</span>
                    <input
                      type="text"
                      value={marketingEvent}
                      onChange={(event) => setMarketingEvent(event.target.value)}
                      className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-300"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">{t.marketingTargetLabel}</span>
                    <input
                      type="text"
                      value={marketingTarget}
                      onChange={(event) => setMarketingTarget(event.target.value)}
                      className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-300"
                    />
                  </label>
                </div>

                <div className="mt-6 rounded-[22px] border border-emerald-200 bg-white p-4 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">{t.marketingBenefitTitle}</div>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                    <li>• {t.marketingBenefitItem1}</li>
                    <li>• {t.marketingBenefitItem2}</li>
                    <li>• {t.marketingBenefitItem3}</li>
                  </ul>
                  <div className="mt-3 rounded-full bg-emerald-600 px-3 py-2 text-center text-sm font-bold text-white">{t.marketingBenefitTotal}</div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMarketingModalOpen(true)}
                  className="mt-6 w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500"
                >
                  {t.marketingGenerate}
                </button>
              </div>

              <div className="bg-slate-50 p-5">
                <div className="flex flex-wrap gap-2">
                  {([
                    { key: "instagram", label: t.marketingModeInstagram },
                    { key: "local", label: t.marketingModeLocal },
                    { key: "sms", label: t.marketingModeSms },
                  ] as const).map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setMarketingMode(option.key)}
                      className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                        marketingMode === option.key
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "border border-emerald-200 bg-white text-emerald-700 hover:border-emerald-300"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="mt-5 rounded-[24px] border border-emerald-200 bg-white p-4 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <div className="whitespace-pre-line text-sm leading-7 text-slate-700">{marketingCopy[marketingMode]}</div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(marketingCopy[marketingMode]);
                        setCopyToast(t.copySuccess);
                        window.setTimeout(() => setCopyToast(null), 1400);
                      } catch (error) {
                        console.error("clipboard write failed", error);
                        setCopyToast("복사 실패");
                        window.setTimeout(() => setCopyToast(null), 1400);
                      }
                    }}
                    className="flex-1 rounded-full border border-emerald-200 bg-white px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
                  >
                    {copyToast ?? t.marketingCopy}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const shareText = marketingCopy[marketingMode];
                      if (navigator.share) {
                        try {
                          await navigator.share({ title: t.marketingTitle, text: shareText });
                          return;
                        } catch (error) {
                          console.error("share cancelled", error);
                        }
                      }
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
                    }}
                    className="flex-1 rounded-full bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500"
                  >
                    {t.marketingShare}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <GlobalSupportModal open={isGlobalOpen} onClose={() => setIsGlobalOpen(false)} lang={lang} setLang={setLang} />
      <FloatingChat />
      <AIConsultant open={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </main>
  );
}
