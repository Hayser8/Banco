import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const data = [
  { name: "Lun", fraude: 2 },
  { name: "Mar", fraude: 5 },
  { name: "Mié", fraude: 3 },
  { name: "Jue", fraude: 7 },
  { name: "Vie", fraude: 4 },
  { name: "Sáb", fraude: 1 },
  { name: "Dom", fraude: 6 },
];

export default function FraudChart() {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-borderColor">
      <h3 className="text-xl font-semibold mb-4">Fraudes Detectados por Día</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#94A3B8" />
          <YAxis stroke="#94A3B8" />
          <Tooltip />
          <Line type="monotone" dataKey="fraude" stroke="#EF4444" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
