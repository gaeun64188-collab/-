"use client";

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

  const currentData = useMemo(() => {
    const regionData = marketData[selectedRegion] ?? marketData["대구 중구"];
    const industryData = regionData[selectedIndustry] ?? regionData.카페;
    return industryData[selectedRevenue] ?? industryData["3천만~5천만 원"] ?? defaultStats;
  }, [selectedRegion, selectedIndustry, selectedRevenue]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.22),_transparent_26%),linear-gradient(180deg,_#f0fdf4_0%,_#ecfdf5_38%,_#f6fff9_100%)] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[32px] border border-emerald-200 bg-white/80 shadow-[0_30px_80px_rgba(16,185,129,0.14)] backdrop-blur-sm">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-green-500 p-8 text-white sm:p-10 lg:p-12">
              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute bottom-0 right-10 h-40 w-40 rounded-full bg-emerald-300/30 blur-3xl" />

              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-medium text-emerald-50">
                  <span className="h-2 w-2 rounded-full bg-emerald-200" />
                  지역 기반 상권 분석
                </div>

                <h1 className="max-w-md text-4xl font-bold leading-tight tracking-[-0.04em] sm:text-5xl">
                  더 나은 상권 선택을 시작하세요.
                </h1>

                <p className="mt-4 max-w-lg text-base text-emerald-50/90 sm:text-lg">
                  지역, 업종, 매출 조건을 선택해 적합한 상권 전략을 빠르게 검토할 수 있습니다.
                </p>

                <div className="mt-8 rounded-3xl border border-white/20 bg-white/10 p-5 shadow-lg shadow-emerald-900/10">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-emerald-50/90">지역</span>
                      <select
                        value={selectedRegion}
                        onChange={(event) => setSelectedRegion(event.target.value)}
                        className="w-full rounded-2xl border border-white/20 bg-white/10 px-3 py-3 text-base text-white outline-none ring-0 placeholder:text-emerald-100/80 focus:border-white/40"
                      >
                        {districts.map((district) => (
                          <option key={district} value={district} className="text-slate-800">
                            {district}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-emerald-50/90">업종</span>
                      <select
                        value={selectedIndustry}
                        onChange={(event) => setSelectedIndustry(event.target.value)}
                        className="w-full rounded-2xl border border-white/20 bg-white/10 px-3 py-3 text-base text-white outline-none ring-0 placeholder:text-emerald-100/80 focus:border-white/40"
                      >
                        {industries.map((industry) => (
                          <option key={industry} value={industry} className="text-slate-800">
                            {industry}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-emerald-50/90">매출</span>
                      <select
                        value={selectedRevenue}
                        onChange={(event) => setSelectedRevenue(event.target.value)}
                        className="w-full rounded-2xl border border-white/20 bg-white/10 px-3 py-3 text-base text-white outline-none ring-0 placeholder:text-emerald-100/80 focus:border-white/40"
                      >
                        {revenueRanges.map((range) => (
                          <option key={range} value={range} className="text-slate-800">
                            {range}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setIsAiOpen(true)}
                      className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                    >
                      AI 상담사와 대화하기
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 p-8 sm:p-10 lg:p-12">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.12em] text-emerald-700">
                    Today
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-emerald-950">상권 현황</h2>
                </div>
                <div className="rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-sm font-medium text-emerald-700 shadow-sm shadow-emerald-100">
                  {currentData.trafficLabel}
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="rounded-3xl border border-emerald-100 bg-white/90 p-5 shadow-[0_14px_30px_rgba(16,185,129,0.08)]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-emerald-800/70">유동인구</span>
                    <span className="text-sm font-semibold text-emerald-700">{currentData.trafficLabel}</span>
                  </div>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-3xl font-bold text-emerald-950">{currentData.traffic}</span>
                    <span className="pb-1 text-sm text-emerald-800/70">명/일</span>
                  </div>
                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-emerald-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400"
                      style={{ width: currentData.score }}
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-emerald-100 bg-white/90 p-5 shadow-[0_14px_30px_rgba(16,185,129,0.08)]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-emerald-800/70">평균 매출</span>
                    <span className="text-sm font-semibold text-emerald-700">{currentData.salesLabel}</span>
                  </div>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-3xl font-bold text-emerald-950">{currentData.sales}</span>
                    <span className="pb-1 text-sm text-emerald-800/70">만 원</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-emerald-800/75">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    {currentData.change}
                  </div>
                </div>

                <div className="rounded-3xl bg-gradient-to-br from-emerald-600 via-green-500 to-lime-500 p-5 text-white shadow-[0_18px_40px_rgba(34,197,94,0.24)]">
                  <p className="text-sm text-emerald-50/80">핵심 인사이트</p>
                  <div className="mt-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-2xl font-bold">{selectedRegion}</p>
                      <p className="mt-1 text-sm text-emerald-50/90">{selectedIndustry} 업종 기준 {currentData.insight}</p>
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-right backdrop-blur-sm">
                      <div className="text-xs text-emerald-50/80">예상 점유율</div>
                      <div className="text-xl font-bold">{currentData.score}</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl mt-8 p-4">
        <GrantMatcher initialRegion="대구 중구" initialBusinessType="음식점업" />
      </div>

      <AIConsultant open={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </main>
  );
}
