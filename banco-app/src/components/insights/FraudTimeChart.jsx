import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

// Datos de fraudes por día (simulado)
const data = [
  { dia: "Lun", fraudes: 12 },
  { dia: "Mar", fraudes: 20 },
  { dia: "Mié", fraudes: 18 },
  { dia: "Jue", fraudes: 25 },
  { dia: "Vie", fraudes: 30 },
  { dia: "Sáb", fraudes: 15 },
  { dia: "Dom", fraudes: 10 },
];

export default function FraudTimeChart() {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-borderColor">
      <h3 className="text-xl font-semibold mb-4">Fraudes Detectados por Día de la Semana</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dia" stroke="#94A3B8" />
          <YAxis stroke="#94A3B8" />
          <Tooltip />
          <Bar dataKey="fraudes" fill="#EF4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
