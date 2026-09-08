"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Testimonials() {
  const { lang } = useLanguage();

  const items = [
    {
      id: 1,
      text: {
        KO: "서문시장 김OO 사장님 - AI 정산으로 매달 20만원 절감!",
        EN: "Mr. Kim (Seomun Market) - Saved $200/month using AI settlement!",
        JP: "西門市場の金さん - AIで毎月2万円節約しました！",
        ZH: "西门市场金先生 - 使用AI结算每月节省200美元！",
      },
    },
    {
      id: 2,
      text: {
        KO: "동성로 박OO 사장님 - AI 마케팅으로 신규고객 증가 18%",
        EN: "Park (Dongseong-ro) - 18% new customer growth with AI marketing",
        JP: "東城路の朴さん - AIマーケで新規顧客18%増",
        ZH: "东城路朴先生 - 通过AI营销新增客户增长18%",
      },
    },
    {
      id: 3,
      text: {
        KO: "수성구 장OO 사장님 - iM 금융연계로 운영자금 부담 완화",
        EN: "Jang (Suseong-gu) - Financing via iM eased working capital pressure",
        JP: "寿城区の張さん - iMの資金連携で運転資金が楽になりました",
        ZH: "寿城区张先生 - 通过iM融资缓解了运营资金压力",
      },
    },
  ];

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-lg font-bold text-slate-800">{lang === "KO" ? "대구 소상공인 후기" : lang === "EN" ? "Local Testimonials" : lang === "JP" ? "お客様の声" : "商家好评"}</h4>
        <div className="text-sm text-slate-500">{lang === "KO" ? "실제 사례" : lang === "EN" ? "Real stories" : lang === "JP" ? "実例" : "真实案例"}</div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3">
        {items.map((it) => (
          <div key={it.id} className="min-w-[260px] shrink-0 rounded-2xl bg-white p-4 shadow-sm border border-emerald-100">
            <div className="text-sm font-medium text-slate-700">{it.text[lang]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
