"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../navBar/navBar";

const EditComercio = ({ id }) => {
  const router = useRouter();
  const [comercio, setComercio] = useState({
    nombre: "",
    CIF: "",
    direccion: "",
    email: "",
    telefono: "",
  });

  useEffect(() => {
    const fetchComercio = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/admin/comercios/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setComercio(data);
      } catch (error) {
        console.error("Error fetching comercio:", error);
      }
    };

    if (id) {
      fetchComercio();
    }
  }, [id]);

  const handleChange = (e) => {
    setComercio({
      ...comercio,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/admin/comercios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(comercio),
      });
      if (response.ok) {
        router.push("/admin/adminDashboard");
      } else {
        console.error("Error updating comercio");
      }
    } catch (error) {
      console.error("Error updating comercio:", error);
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
            <h1 className="text-2xl font-bold my-4">Editar Comercio</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={comercio.nombre}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">CIF</label>
                <input
                  type="text"
                  name="CIF"
                  value={comercio.CIF}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={comercio.direccion}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={comercio.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={comercio.telefono}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                Actualizar
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditComercio;
