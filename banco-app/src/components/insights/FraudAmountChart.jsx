import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

// Datos de fraudes por monto (simulado)
const data = [
  { monto: "< $500", fraudes: 10 },
  { monto: "$500 - $1000", fraudes: 25 },
  { monto: "$1000 - $5000", fraudes: 40 },
  { monto: "$5000+", fraudes: 15 },
];

export default function FraudAmountChart() {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-borderColor">
      <h3 className="text-xl font-semibold mb-4">Fraudes Detectados por Monto</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monto" stroke="#94A3B8" />
          <YAxis stroke="#94A3B8" />
          <Tooltip />
          <Bar dataKey="fraudes" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
