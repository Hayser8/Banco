import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

// Datos de riesgo por usuario (simulado)
const data = [
  { usuario: "User A", riesgo: 90 },
  { usuario: "User B", riesgo: 75 },
  { usuario: "User C", riesgo: 60 },
  { usuario: "User D", riesgo: 40 },
  { usuario: "User E", riesgo: 20 },
];

export default function RiskChart() {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-borderColor">
      <h3 className="text-xl font-semibold mb-4">Riesgo Acumulado por Usuario</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="usuario" stroke="#94A3B8" />
          <YAxis stroke="#94A3B8" />
          <Tooltip />
          <Line type="monotone" dataKey="riesgo" stroke="#EF4444" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
