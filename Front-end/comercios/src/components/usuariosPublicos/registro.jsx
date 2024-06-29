"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import Navbar from "../navBar/navBar";

const RegisterUsuario = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    password: "",
    confirmPassword: "",
    email: "",
    edad: "",
    ciudad: "",
    intereses: "",
    ofertas: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el registro',
        text: 'Las contraseñas no coinciden',
      });
      return;
    }

    // Convert interests string to array
    const interesesArray = formData.intereses.split(',').map(item => item.trim());

    try {
      const response = await fetch("http://localhost:3000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, intereses: interesesArray }),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Ahora puedes iniciar sesión',
        });
        router.push("/usuariosRegistrados/login");
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Error al registrarse',
          text: errorData.message || 'Error al registrarse',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al registrarse',
        text: 'Error al registrarse',
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
        <div className="relative z-10 flex justify-center items-center  w-full mt-20 overflow-y-auto">
          <div className="w-full max-w-xs">
            <form
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
              onSubmit={handleRegister}
            >
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="nombre"
                >
                  Nombre
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
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
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Contraseña
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirmar Contraseña
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirmar Contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="edad"
                >
                  Edad
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="edad"
                  name="edad"
                  type="number"
                  placeholder="Edad"
                  value={formData.edad}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="ciudad"
                >
                  Ciudad
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="ciudad"
                  name="ciudad"
                  type="text"
                  placeholder="Ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Intereses
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="intereses"
                  name="intereses"
                  type="text"
                  placeholder="Intereses (separados por comas)"
                  value={formData.intereses}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  <input
                    type="checkbox"
                    name="ofertas"
                    checked={formData.ofertas}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  <span className="ml-2">Recibir ofertas</span>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Registrarse
                </button>
              </div>
            </form>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterUsuario;
