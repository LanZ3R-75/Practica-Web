// src/components/admin/EditarUsuario.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const EditUser = () => {
  const router = useRouter();
  const { id } = useParams();
  const [user, setUser] = useState({
    nombre: "",
    email: "",
    edad: "",
    ciudad: "",
    intereses: [],
    ofertas: false,
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/admin/user/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        
        // Transform 'intereses' to an array if it is a string
        if (typeof data.intereses === 'string') {
          data.intereses = data.intereses.split(',').map(interest => interest.trim());
        }

        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleInteresesChange = (e) => {
    setUser({
      ...user,
      intereses: e.target.value.split(",").map(interes => interes.trim()),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/admin/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        router.push("/admin/adminDashboard");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Error updating user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setErrorMessage("Error updating user");
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-4">Editar Usuario</h1>
      <form onSubmit={handleSubmit}>
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        <div className="mb-4">
          <label className="block text-gray-700">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={user.nombre}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Edad</label>
          <input
            type="number"
            name="edad"
            value={user.edad}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Ciudad</label>
          <input
            type="text"
            name="ciudad"
            value={user.ciudad}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Intereses</label>
          <input
            type="text"
            name="intereses"
            value={Array.isArray(user.intereses) ? user.intereses.join(", ") : user.intereses}
            onChange={handleInteresesChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Ofertas</label>
          <input
            type="checkbox"
            name="ofertas"
            checked={user.ofertas}
            onChange={(e) => setUser({ ...user, ofertas: e.target.checked })}
            className="mt-1 block"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Actualizar
        </button>
      </form>
    </div>
  );
};

export default EditUser;
