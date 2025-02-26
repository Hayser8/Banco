"use client";

import RiskChart from "../../../components/insights/RiskChart";
import FraudAmountChart from "../../../components/insights/FraudAmountChart";
import FraudTimeChart from "../../../components/insights/FraudTimeChart";
import InsightsSummary from "../../../components/insights/InsightsSummary";

export default function DataInsights() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Análisis de Fraudes 📊</h1>
      <p className="text-textSecondary mb-6">
        Explora patrones y riesgos de fraudes detectados en el sistema.
      </p>

      {/* Resumen General */}
      <InsightsSummary />

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <RiskChart />
        <FraudAmountChart />
        <FraudTimeChart />
      </div>
    </div>
  );
}
