export default function PeriodSelector({ selectedPeriod, setSelectedPeriod }) {
    return (
      <select
        className="bg-card text-textPrimary p-2 rounded-md"
        value={selectedPeriod}
        onChange={(e) => setSelectedPeriod(e.target.value)}
      >
        <option>Últimos 7 días</option>
        <option>Últimos 30 días</option>
        <option>Últimos 6 meses</option>
      </select>
    );
  }
  