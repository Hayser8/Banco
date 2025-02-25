"use client";

export default function SearchBar({ setSearchQuery }) {
  return (
    <div className="bg-card p-4 rounded-lg shadow-md border border-borderColor mb-6">
      <input
        type="text"
        className="w-full bg-card p-2 rounded-md border border-borderColor text-textPrimary"
        placeholder="Buscar por ID de transacción o nombre..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
