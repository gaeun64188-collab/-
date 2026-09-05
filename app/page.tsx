"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AIConsultant from "./components/ai-consultant";
import GrantMatcher from './components/grant-matcher';

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

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState("대구 중구");
  const [selectedIndustry, setSelectedIndustry] = useState("카페");
  const [selectedRevenue, setSelectedRevenue] = useState("3천만~5천만 원");
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginLoadingProvider, setLoginLoadingProvider] = useState<string | null>(null);

  const currentData = useMemo(() => {
    const regionData = marketData[selectedRegion] ?? marketData["대구 중구"];
    const industryData = regionData[selectedIndustry] ?? regionData.카페;
    return industryData[selectedRevenue] ?? industryData["3천만~5천만 원"] ?? defaultStats;
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

  const openExternalLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const quickActions = [
    { label: "📍 상권 분석", key: "market" },
    { label: "💰 지원금 조회", key: "grant" },
    { label: "🏦 iM 우대금리", key: "finance" },
    { label: "📄 AI 사업계획서", key: "generator" },
    { label: "📣 AI 마케팅", key: "ai" },
  ];
  const languageOptions = ["KO", "EN", "JP", "ZH"] as const;
  type Language = (typeof languageOptions)[number];

  const translation: Record<Language, {
    heroTitle: string;
    heroSub: string;
    nav1: string;
    nav2: string;
    nav3: string;
    nav4: string;
    nav5: string;
    login: string;
  }> = {
    KO: {
      heroTitle: "더 나은 상권 선택을 시작하세요.",
      heroSub: "대구시 소상공인과 예비 창업자를 위한 AI 맞춤 상권 분석 및 지원금·iM뱅크 금융 혜택 솔루션",
      nav1: "지자체 지원금",
      nav2: "iM뱅크 금융우대",
      nav3: "대구로페이/상권",
      nav4: "AI 컨설팅",
      nav5: "이용안내/가이드",
      login: "로그인",
    },
    EN: {
      heroTitle: "Start making better commercial area choices.",
      heroSub: "AI-customized commercial analysis, subsidies, and iM Bank financial solutions for Daegu small business owners.",
      nav1: "Local Subsidies",
      nav2: "iM Bank Benefits",
      nav3: "Daegu Ro Pay/Market",
      nav4: "AI Consulting",
      nav5: "User Guide",
      login: "Login",
    },
    JP: {
      heroTitle: "より 좋은 商圏選択を始めましょう。",
      heroSub: "大邱市の小規模事業者と創業者のためのAIカスタマイズ商圏分析および助成金・iMバンク金融特典ソリューション",
      nav1: "自治体助成金",
      nav2: "iMバンク優遇金融",
      nav3: "大邱ローペイ/商圏",
      nav4: "AIコンサルティング",
      nav5: "ご利用 안내",
      login: "ログイン",
    },
    ZH: {
      heroTitle: "开始选择更好的商圈。",
      heroSub: "为大邱市小微企业和创业者提供AI定制商圈分析、补贴及iM Bank金融优惠解决方案",
      nav1: "地方政府补贴",
      nav2: "iM Bank 金融优惠",
      nav3: "大邱Ro Pay/商圈",
      nav4: "AI 咨询",
      nav5: "指南/说明",
      login: "登录",
    },
  };

  const [language, setLanguage] = useState<Language>("KO");
  const safeLanguage = languageOptions.includes(language) ? language : "KO";
  const t = translation[safeLanguage];

  const languageLabelMap: Record<Language, string> = {
    KO: "한국어",
    EN: "English",
    JP: "日本語",
    ZH: "中文",
  };

  const heroTitle = isLoggedIn
    ? "김사장님(대구 중구 카페), 반갑습니다!"
    : t.heroTitle;

  const heroSubtitle = isLoggedIn
    ? "사장님 매장에 딱 맞는 지원 정책 3건이 기다리고 있습니다."
    : t.heroSub;

  const guideLabel = t.nav5;

  const nextLanguage = () => {
    const currentIndex = languageOptions.indexOf(safeLanguage);
    const nextIndex = (currentIndex + 1) % languageOptions.length;
    setLanguage(languageOptions[nextIndex]);
  };

  return (
    <main className="min-h-screen bg-[#f0fdf4] text-slate-800">
      <header className="bg-emerald-600 text-white shadow-[0_16px_32px_rgba(5,150,105,0.18)]">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
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
                {languageLabelMap[safeLanguage]} ▾
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
                <div className="hidden shrink-0 items-center gap-3 rounded-full border border-white/20 bg-white/10 px-2 py-1 sm:flex">
                  <span className="rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-bold text-white">K</span>
                  <span className="text-sm font-medium text-white">김사장님</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <section className="rounded-[32px] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700 ring-1 ring-emerald-100">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                AI 맞춤 상권 분석
              </div>

              <h1 className="mt-4 max-w-xl text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
                {heroTitle}
              </h1>

              <p className="mt-3 max-w-2xl text-base text-slate-600 md:text-lg">
                {heroSubtitle}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-600">지역</span>
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
                  <span className="mb-2 block text-sm font-semibold text-slate-600">업종</span>
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
                  <span className="mb-2 block text-sm font-semibold text-slate-600">매출</span>
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
                  AI 상담사와 대화하기
                </button>
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100"
                >
                  소셜 로그인 / 회원가입
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-5 shadow-[0_18px_40px_rgba(16,185,129,0.08)]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-emerald-800">이달 실적</p>
                <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                  Live
                </span>
              </div>

              <div className="mt-5 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>대구로페이 결제 비중</span>
                  <span className="font-bold text-emerald-700">28%</span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-emerald-100">
                  <div className="h-full w-[28%] rounded-full bg-gradient-to-r from-emerald-500 to-green-400" />
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                  <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">누적 매출</div>
                  <div className="mt-2 text-2xl font-extrabold text-emerald-950">1,420만</div>
                  <div className="mt-1 text-sm font-medium text-emerald-700">+8.5% 전월 대비</div>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                  <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">우대금리</div>
                  <div className="mt-2 text-2xl font-extrabold text-emerald-950">0.5%p</div>
                  <div className="mt-1 text-sm font-medium text-emerald-700">월 12.5만 절감</div>
                </div>
              </div>

              <div className="mt-4 rounded-[22px] bg-emerald-600 p-4 text-white shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-[0.12em] text-emerald-100">예상 적합도</span>
                  <span className="text-lg font-bold">{currentData.score}</span>
                </div>
                <div className="mt-3 text-sm text-emerald-50">
                  {selectedRegion} · {selectedIndustry} 업종에 가장 적합한 금융/지원 조건을 선별 중입니다.
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {quickActions.map((action) => (
            <button
              key={action.key}
              type="button"
              onClick={() => {
                if (action.key === "generator") {
                  window.location.href = "/generator";
                  return;
                }
                if (action.key === "ai") {
                  setIsAiOpen(true);
                  return;
                }
                if (action.key === "market") {
                  window.scrollTo({ top: document.body.scrollHeight * 0.2, behavior: "smooth" });
                  return;
                }
                setIsAiOpen(true);
              }}
              className="rounded-[22px] border border-emerald-200 bg-white px-4 py-4 text-left shadow-[0_10px_28px_rgba(16,185,129,0.06)] transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[0_14px_28px_rgba(16,185,129,0.12)]"
            >
              <div className="text-lg">{action.label.split(" ")[0]}</div>
              <div className="mt-2 text-sm font-semibold text-slate-700">{action.label.replace(/^\S+\s/, "")}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl p-4">
        <GrantMatcher
          initialRegion="대구 중구"
          initialBusinessType="음식점업"
          selectedRegion={selectedRegion}
          selectedBusinessType={selectedIndustry}
        />
      </div>

      <section className="mx-auto mt-8 max-w-6xl rounded-[28px] border border-emerald-200 bg-white/80 p-6 shadow-[0_18px_40px_rgba(16,185,129,0.06)] backdrop-blur-sm">
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
              <button
                type="button"
                disabled={!!loginLoadingProvider}
                onClick={() => handleSocialLogin('kakao')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] py-3 text-base font-semibold text-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span>💬</span>
                {loginLoadingProvider === 'kakao' ? '로그인 중...' : '카카오로 시작하기'}
              </button>

              <button
                type="button"
                disabled={!!loginLoadingProvider}
                onClick={() => handleSocialLogin('google')}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-3 text-base font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span>🔵</span>
                {loginLoadingProvider === 'google' ? '로그인 중...' : '구글로 시작하기'}
              </button>

              <button
                type="button"
                disabled={!!loginLoadingProvider}
                onClick={() => handleSocialLogin('apple')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-base font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span></span>
                {loginLoadingProvider === 'apple' ? '로그인 중...' : 'Apple로 시작하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      <AIConsultant open={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </main>
  );
}
