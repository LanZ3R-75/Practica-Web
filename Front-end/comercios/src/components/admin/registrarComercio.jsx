"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../navBar/navBar';

const RegisterComercio = () => {
  // Variables de estado y router
  const [form, setForm] = useState({
    nombre: '',
    CIF: '',
    direccion: '',
    email: '',
    telefono: ''
  });
  const [error, setError] = useState(null);
  const router = useRouter();

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/admin/comercios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error('Error al registrar el comercio');
      }

      const data = await response.json();
      router.push('/admin/adminDashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="relative h-screen w-full overflow-hidden"
        style={{ backgroundImage: "url('/images/fondo.png')" }}
      >
        <div className="absolute inset-0 bg-cover bg-center backdrop-filter backdrop-blur-md"></div>
        <div className="absolute inset-0 overflow-y-auto px-4 pt-20 mt-20">
          <div className="container mx-auto px-4 bg-white bg-opacity-90 rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold my-4">Registrar Comercio</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">CIF</label>
                <input
                  type="text"
                  name="CIF"
                  value={form.CIF}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Registrar Comercio
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterComercio;
