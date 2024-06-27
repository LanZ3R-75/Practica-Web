"use client";
// src/components/comercio/LoginComercio.jsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import Navbar from "../navBar/navBar";

const LoginComercio = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [cif, setCif] = useState("");

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
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: errorData.message || 'Error al iniciar sesión',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: 'Error al iniciar sesión',
      });
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative h-screen w-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/fondo.png')" }}
        >
          <div className="absolute inset-0 backdrop-filter backdrop-blur-lg"></div>
        </div>
        <div className="relative z-10 flex justify-center items-center h-full w-full">
          <div className="w-full max-w-xs">
            <form
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 "
              onSubmit={handleLogin}
            >
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="cif"
                >
                  CIF
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id="cif"
                  type="text"
                  placeholder="CIF"
                  value={cif}
                  onChange={(e) => setCif(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Iniciar Sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginComercio;
