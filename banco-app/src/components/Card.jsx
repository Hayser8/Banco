import Link from "next/link";

export default function Card({ title, description, link }) {
    return (
      <Link href={link} className="block bg-card p-6 rounded-lg shadow-md border border-borderColor hover:bg-opacity-90 transition">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-textSecondary">{description}</p>
      </Link>
    );
  }
  