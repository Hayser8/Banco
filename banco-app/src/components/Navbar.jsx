import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-card shadow-md px-6 py-4 flex justify-between items-center rounded-lg">
      <h1 className="text-xl font-semibold text-white">BancoApp</h1>
      <div className="space-x-4">
        <Link href="/dashboard" className="text-textSecondary hover:text-white">Dashboard</Link>
        <Link href="/perfil" className="text-textSecondary hover:text-white">Perfil</Link>
        <Link href="/historial" className="text-textSecondary hover:text-white">Historial</Link>
        <Link href="/transaccion" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Transacción
        </Link>
      </div>
    </nav>
  );
}
