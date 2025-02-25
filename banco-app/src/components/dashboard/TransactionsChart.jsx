import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const data = [
  { name: "Lun", transacciones: 120 },
  { name: "Mar", transacciones: 150 },
  { name: "Mié", transacciones: 180 },
  { name: "Jue", transacciones: 220 },
  { name: "Vie", transacciones: 210 },
  { name: "Sáb", transacciones: 90 },
  { name: "Dom", transacciones: 250 },
];

export default function TransactionsChart() {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-borderColor">
      <h3 className="text-xl font-semibold mb-4">Cantidad de Transacciones por Día</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#94A3B8" />
          <YAxis stroke="#94A3B8" />
          <Tooltip />
          <Bar dataKey="transacciones" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
