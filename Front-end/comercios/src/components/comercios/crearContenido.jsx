// src/pages/comercios/crearContenido.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../navBar/navBar";

const CrearContenido = () => {
  const router = useRouter();
  const [contenido, setContenido] = useState({
    ciudad: "",
    actividad: "",
    titulo: "",
    resumen: "",
  });
  const [newText, setNewText] = useState("");
  const [textos, setTextos] = useState([]);
  const [newFoto, setNewFoto] = useState("");
  const [fotos, setFotos] = useState([]);

  const handleChange = (e) => {
    setContenido({
      ...contenido,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddText = () => {
    setTextos([...textos, newText]);
    setNewText("");
  };

  const handleDeleteText = (index) => {
    setTextos(textos.filter((_, i) => i !== index));
  };

  const handleAddFoto = () => {
    setFotos([...fotos, newFoto]);
    setNewFoto("");
  };

  const handleDeleteFoto = (index) => {
    setFotos(fotos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("comercioToken");
    try {
      const response = await fetch("http://localhost:3000/api/comercios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ...contenido, text: textos, fotos }),
      });
      if (response.ok) {
        router.push("/comercios/dashboard");
      } else {
        console.error("Error creating content:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating content:", error);
    }
  };

  return (
    <> 
      <Navbar />
    <div className="container mx-auto px-4 mt-20">
      <h1 className="text-2xl font-bold my-4">Crear Contenido</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Ciudad</label>
          <input
            type="text"
            name="ciudad"
            value={contenido.ciudad}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Actividad</label>
          <input
            type="text"
            name="actividad"
            value={contenido.actividad}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Título</label>
          <input
            type="text"
            name="titulo"
            value={contenido.titulo}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Resumen</label>
          <textarea
            name="resumen"
            value={contenido.resumen}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Textos</label>
          <ul>
            {textos.map((texto, index) => (
              <li key={index} className="flex justify-between items-center">
                {texto}
                <button
                  type="button"
                  onClick={() => handleDeleteText(index)}
                  className="ml-2 text-red-500 bg-transparent"
                >
                  <img src="/images/papelera.png" alt="Eliminar" className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Nuevo texto"
              className="border border-gray-300 p-2 rounded"
            />
            <button
              type="button"
              onClick={handleAddText}
              className="ml-2 bg-green-500 text-white px-4 py-2 rounded"
            >
              Añadir Texto
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Fotos</label>
          <ul>
            {fotos.map((foto, index) => (
              <li key={index} className="flex justify-between items-center">
                {foto}
                <button
                  type="button"
                  onClick={() => handleDeleteFoto(index)}
                  className="ml-2 text-red-500 bg-transparent"
                >
                  <img src="/images/papelera.png" alt="Eliminar" className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <input
              type="text"
              value={newFoto}
              onChange={(e) => setNewFoto(e.target.value)}
              placeholder="Nueva foto"
              className="border border-gray-300 p-2 rounded"
            />
            <button
              type="button"
              onClick={handleAddFoto}
              className="ml-2 bg-green-500 text-white px-4 py-2 rounded"
            >
              Añadir Foto
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Crear Contenido
        </button>
      </form>
    </div>
    </>
  );
};

export default CrearContenido;
