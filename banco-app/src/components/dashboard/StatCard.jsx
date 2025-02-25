export default function StatCard({ title, value, icon }) {
    return (
      <div className="bg-card p-6 rounded-lg shadow-md border border-borderColor flex items-center gap-4">
        <div className="text-primary">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    );
  }
  