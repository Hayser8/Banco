"use client";

export default function ProfileTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex gap-4 border-b border-borderColor mt-6">
      <TabButton label="Información" value="info" activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

function TabButton({ label, value, activeTab, setActiveTab }) {
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`py-2 px-4 ${
        activeTab === value ? "text-primary border-b-2 border-primary" : "text-textSecondary"
      } hover:text-white transition`}
    >
      {label}
    </button>
  );
}
