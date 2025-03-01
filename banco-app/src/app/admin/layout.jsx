import AdminSidebar from "../../components/AdminSidebar";
<<<<<<< Updated upstream
import "@/app/styles/globals.css"; 
=======
import "../styles/globals.css"; 
>>>>>>> Stashed changes

export const metadata = {
  title: "BancoApp - Panel de Administración",
  description: "Administra usuarios, transacciones y datos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-background text-textPrimary flex">
        <AdminSidebar />
        <main className="flex-grow p-6 ml-64">{children}</main> 
      </body>
    </html>
  );
}
