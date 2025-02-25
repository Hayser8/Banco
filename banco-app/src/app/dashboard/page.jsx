"use client";

import { useState } from "react";
import PeriodSelector from "../../components/dashboard/PeriodSelector.jsx";
import GeneralMetrics from "../../components/dashboard/GeneralMetrics.jsx";
import FraudMetrics from "../../components/dashboard/FraudMetrics.jsx";
import FraudChart from "../../components/dashboard/FraudChart.jsx";
import TransactionsChart from "../../components/dashboard/TransactionsChart.jsx";

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("Últimos 7 días");

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard 📊</h1>
        <PeriodSelector selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} />
      </div>

      {/* Métricas Generales */}
      <GeneralMetrics />

      {/* Métricas de Fraude */}
      <FraudMetrics />

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <FraudChart />
        <TransactionsChart />
      </div>
    </div>
  );
}
