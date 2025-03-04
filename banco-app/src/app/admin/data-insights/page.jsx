"use client";

import { useState, useEffect } from "react";
import RiskChart from "../../../components/insights/RiskChart";
import FraudAmountChart from "../../../components/insights/FraudAmountChart";
import FraudTimeChart from "../../../components/insights/FraudTimeChart";
import InsightsSummary from "../../../components/insights/InsightsSummary";

export default function DataInsights() {
  const [data, setData] = useState({
    riskChart: [],
    fraudAmount: [],
    fraudTime: [],
    insightsSummary: {}
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [riskRes, amountRes, timeRes, summaryRes] = await Promise.all([
          fetch("http://localhost:8080/data_insights/risk_chart").then(res => res.json()),
          fetch("http://localhost:8080/data_insights/fraud_amount").then(res => res.json()),
          fetch("http://localhost:8080/data_insights/fraud_day").then(res => res.json()),
          fetch("http://localhost:8080/data_insights/insights_summary").then(res => res.json())
        ]);
        setData({
          riskChart: riskRes.data,
          fraudAmount: amountRes.data,
          fraudTime: timeRes.data,
          insightsSummary: summaryRes
        });
      } catch (error) {
        console.error("Error al obtener datos de insights:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Análisis de Fraudes 📊</h1>
      <p className="text-textSecondary mb-6">
        Explora patrones y riesgos de fraudes detectados en el sistema.
      </p>

      {/* Resumen General */}
      <InsightsSummary data={data.insightsSummary} />

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <RiskChart data={data.riskChart} />
        <FraudAmountChart data={data.fraudAmount} />
        <FraudTimeChart data={data.fraudTime} />
      </div>
    </div>
  );
}
