"use client";

import { useState } from "react";
import { FiUser, FiDollarSign, FiMessageSquare, FiSend, FiGlobe, FiTag, FiCreditCard } from "react-icons/fi";

export default function TransactionsForm({ setTransactionStatus }) {
  const [formData, setFormData] = useState({
    destinatario: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.destinatario || !formData.monto || isNaN(formData.monto) || formData.monto <= 0) {
      setTransactionStatus("error");
      return;
    }

    setTransactionStatus("success");
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-white text-center">Realizar Pago 💸</h3>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Sección Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Destinatario */}
          <div className="flex items-center border border-gray-600 rounded-md p-3 bg-gray-900">
            <FiUser className="text-gray-400 mr-3" />
            <input
              type="text"
              name="destinatario"
              value={formData.destinatario}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-white"
              placeholder="Cuenta o Correo"
            />
          </div>

          {/* Alias */}
          <div className="flex items-center border border-gray-600 rounded-md p-3 bg-gray-900">
            <FiTag className="text-gray-400 mr-3" />
            <input
              type="text"
              name="alias"
              value={formData.alias}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-white"
              placeholder="Alias del destinatario (Opcional)"
            />
          </div>
        </div>

        {/* Tipo de Cuenta y País */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tipo de Cuenta */}
          <div className="flex items-center border border-gray-600 rounded-md p-3 bg-gray-900">
            <FiCreditCard className="text-gray-400 mr-3" />
            <select
              name="tipoCuenta"
              value={formData.tipoCuenta}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-white"
            >
              <option value="corriente">Cuenta Corriente</option>
              <option value="ahorro">Cuenta de Ahorros</option>
            </select>
          </div>

          {/* País */}
          <div className="flex items-center border border-gray-600 rounded-md p-3 bg-gray-900">
            <FiGlobe className="text-gray-400 mr-3" />
            <select
              name="pais"
              value={formData.pais}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-white"
            >
              <option value="GT">Guatemala</option>
              <option value="MX">México</option>
              <option value="US">Estados Unidos</option>
              <option value="ES">España</option>
            </select>
          </div>
        </div>

        {/* Moneda y Monto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Moneda */}
          <div className="flex items-center border border-gray-600 rounded-md p-3 bg-gray-900">
            <FiDollarSign className="text-gray-400 mr-3" />
            <select
              name="moneda"
              value={formData.moneda}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-white"
            >
              <option value="USD">USD - Dólar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GTQ">GTQ - Quetzal</option>
            </select>
          </div>

          {/* Monto */}
          <div className="flex items-center border border-gray-600 rounded-md p-3 bg-gray-900">
            <FiDollarSign className="text-gray-400 mr-3" />
            <input
              type="number"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-white"
              placeholder="Monto a enviar"
            />
          </div>
        </div>

        {/* Concepto */}
        <div className="flex items-center border border-gray-600 rounded-md p-3 bg-gray-900">
          <FiMessageSquare className="text-gray-400 mr-3" />
          <input
            type="text"
            name="concepto"
            value={formData.concepto}
            onChange={handleChange}
            className="w-full bg-transparent focus:outline-none text-white"
            placeholder="Concepto (Opcional)"
          />
        </div>

        {/* Botón de Enviar */}
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md flex items-center justify-center gap-2 mt-4">
          <FiSend size={20} />
          Enviar Dinero
        </button>
      </form>
    </div>
  );
}
