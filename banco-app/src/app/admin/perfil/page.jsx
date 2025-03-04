"use client";

import { useState } from "react";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileInfo from "@/components/profile/ProfileInfo";
import SecuritySettings from "@/components/profile/SecuritySettings";
import Preferences from "@/components/profile/Preferences";


export default function PerfilAdmin() {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Perfil del Administrador 🛠️</h1>
      <p className="text-textSecondary mb-6">
        Administra tu información, seguridad y preferencias.
      </p>

      {/* Tarjeta de Perfil */}
      <ProfileCard />

      {/* Tabs de navegación */}
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Contenido según la pestaña activa */}
      <div className="mt-6">
        {activeTab === "info" && <ProfileInfo />}
      </div>
    </div>
  );
}
