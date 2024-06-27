// src/components/admin/RegisterComercio.jsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../navBar/navBar';

const RegisterComercio = () => {
  const [form, setForm] = useState({
    nombre: '',
    CIF: '',
    direccion: '',
    email: '',
    telefono: ''
  });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

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
    <Navbar/>
    <div className="container mx-auto px-4 mt-20">
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
    </>
  );
};

export default RegisterComercio;
