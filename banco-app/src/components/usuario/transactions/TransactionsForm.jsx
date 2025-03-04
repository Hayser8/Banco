"use client";

import { useState } from "react";
import { FiUser, FiDollarSign, FiMessageSquare, FiSend, FiGlobe, FiTag, FiCreditCard, FiHash } from "react-icons/fi";

export default function TransactionsForm({ setTransactionStatus, saldoDisponible, setSaldoDisponible }) {
  const [formData, setFormData] = useState({
    destinatario: "",
    numeroCuenta: "",
    alias: "",
    tipoCuenta: "corriente",
    moneda: "USD",
    monto: "",
    concepto: "",
    pais: "GT",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const monto = parseFloat(formData.monto);

    if (!formData.destinatario || !formData.numeroCuenta || isNaN(monto) || monto <= 0) {
      setTransactionStatus("error");
      return;
    }

    if (monto > saldoDisponible) {
      setTransactionStatus("insufficient-funds");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setSaldoDisponible((prevSaldo) => prevSaldo - monto);
      setTransactionStatus("success");
    } catch (error) {
      console.error("Error en la transacción:", error);
      setTransactionStatus("error");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-white text-center">Realizar Pago 💸</h3>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField icon={<FiUser />} name="destinatario" value={formData.destinatario} onChange={handleChange} placeholder="Cuenta o Correo" required />
          <InputField icon={<FiHash />} name="numeroCuenta" value={formData.numeroCuenta} onChange={handleChange} placeholder="Número de Cuenta" required />
        </div>

        <InputField icon={<FiTag />} name="alias" value={formData.alias} onChange={handleChange} placeholder="Alias del destinatario (Opcional)" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField icon={<FiCreditCard />} name="tipoCuenta" value={formData.tipoCuenta} onChange={handleChange} options={{ corriente: "Cuenta Corriente", ahorro: "Cuenta de Ahorros" }} />
          <SelectField icon={<FiGlobe />} name="pais" value={formData.pais} onChange={handleChange} options={{ GT: "Guatemala", MX: "México", US: "Estados Unidos", ES: "España" }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField icon={<FiDollarSign />} name="moneda" value={formData.moneda} onChange={handleChange} options={{ USD: "USD - Dólar", EUR: "EUR - Euro", GTQ: "GTQ - Quetzal" }} />
          <InputField icon={<FiDollarSign />} name="monto" value={formData.monto} onChange={handleChange} placeholder="Monto a enviar" required type="number" />
        </div>

        <InputField icon={<FiMessageSquare />} name="concepto" value={formData.concepto} onChange={handleChange} placeholder="Concepto (Opcional)" />

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md flex items-center justify-center gap-2 mt-4">
          <FiSend size={20} />
          Enviar Dinero
        </button>
      </form>
    </div>
  );
}

function InputField({ icon, name, value, onChange, placeholder, required = false, type = "text" }) {
  return (
    <div className="flex items-center border border-gray-600 rounded-md p-3 bg-gray-900">
      {icon}
      <input type={type} name={name} value={value} onChange={onChange} className="w-full bg-transparent focus:outline-none text-white" placeholder={placeholder} required={required} />
    </div>
  );
}

function SelectField({ icon, name, value, onChange, options }) {
  return (
    <div className="flex items-center border border-gray-600 rounded-md p-3 bg-gray-900">
      {icon}
      <select name={name} value={value} onChange={onChange} className="w-full bg-transparent focus:outline-none text-white">
        {Object.entries(options).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
