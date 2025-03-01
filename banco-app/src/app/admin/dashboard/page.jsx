"use client";

import { useState, useEffect } from "react";
import PeriodSelector from "../../../components/dashboard/PeriodSelector.jsx";
import GeneralMetrics from "../../../components/dashboard/GeneralMetrics.jsx";
import FraudMetrics from "../../../components/dashboard/FraudMetrics.jsx";
import FraudChart from "../../../components/dashboard/FraudChart.jsx";
import TransactionsChart from "../../../components/dashboard/TransactionsChart.jsx";

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("Últimos 7 días");
  const [generalMetrics, setGeneralMetrics] = useState(null);
  const [fraudMetrics, setFraudMetrics] = useState(null);
  const [transactionsChartData, setTransactionsChartData] = useState([]);

  useEffect(() => {
    let days;
    if (selectedPeriod === "Últimos 7 días") {
      days = 7;
    } else if (selectedPeriod === "Últimos 30 días") {
      days = 30;
    } else if (selectedPeriod === "Últimos 6 meses") {
      days = 180;
    } else {
      days = 7; 
    }
  

    fetch(`http://localhost:8080/general_metrics?days=${days}`)
      .then((res) => res.json())
      .then((data) => setGeneralMetrics(data))
      .catch((err) => console.error("Error en general_metrics:", err));
  

    fetch(`http://localhost:8080/fraud_metrics?days=${days}`)
      .then((res) => res.json())
      .then((data) => setFraudMetrics(data))
      .catch((err) => console.error("Error en fraud_metrics:", err));
  

    fetch(`http://localhost:8080/transactions_chart?days=${days}`)
      .then((res) => res.json())
      .then((data) => setTransactionsChartData(data.transactions_chart || []))
      .catch((err) => console.error("Error en transactions_chart:", err));
  
  }, [selectedPeriod]);
  

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard 📊</h1>
        <PeriodSelector selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} />
      </div>

      {/* Métricas Generales */}
      <GeneralMetrics data={generalMetrics} />

      {/* Métricas de Fraude */}
      <FraudMetrics data={fraudMetrics} />

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <FraudChart selectedPeriod={selectedPeriod} />
        <TransactionsChart data={transactionsChartData} />
      </div>
    </div>
  );
}
