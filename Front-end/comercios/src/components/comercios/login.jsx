// src/components/comercio/LoginComercio.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginComercio = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [cif, setCif] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/comercios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, cif }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("comercioToken", data.token);
        router.push("/comercios/dashboard");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Error al iniciar sesión");
      }
    } catch (error) {
      setErrorMessage("Error al iniciar sesión");
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-4">Login Comercio</h1>
      <form onSubmit={handleLogin}>
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">CIF</label>
          <input
            type="text"
            name="cif"
            value={cif}
            onChange={(e) => setCif(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default LoginComercio;
