"use client";

import { useEffect, useState } from "react";
import ComercioCard from '../usuariosPublicos/tarjetaComercio';
import Navbar from '../navBar/navBar';

const InicioRegistrados = () => {
  // Estado para almacenar los comercios, el usuario y los filtros de búsqueda y ordenación
  const [comercios, setComercios] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [activityFilter, setActivityFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); 
  const [sortOrderCiudad, setSortOrderCiudad] = useState('asc'); 
  const [sortOrderIntereses, setSortOrderIntereses] = useState('asc'); 

  // Hook useEffect que se ejecuta al montar el componente y cuando cambia el orden de clasificación
  useEffect(() => {
    fetchUser();
    fetchComercios(sortOrder);
  }, [sortOrder]);

  // Función para obtener los datos del usuario
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:3000/api/user/perfil', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.error('Error fetching user:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // Función para obtener los datos de los comercios
  const fetchComercios = async (order = 'asc') => {
    try {
      const response = await fetch(`http://localhost:3000/api/user/comercios/contenido?ordenar=${order}`);
      if (response.ok) {
        const data = await response.json();
        setComercios(data);
      } else {
        console.error('Error fetching comercios:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching comercios:', error);
    }
  };

   // Filtra y ordena los comercios según los filtros de búsqueda y el orden de clasificación
  const filteredComercios = comercios
    .filter(comercio => {
      const nombreMatch = comercio.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
      const ciudadMatch = comercio.paginaID?.ciudad?.toLowerCase().includes(cityFilter.toLowerCase());
      const actividadMatch = comercio.paginaID?.actividad?.toLowerCase().includes(activityFilter.toLowerCase());
      return nombreMatch && ciudadMatch && actividadMatch;
    })
    .sort((a, b) => {
      const compareA = a.paginaID.scoring;
      const compareB = b.paginaID.scoring;
      if (sortOrder === 'asc') {
        return compareA < compareB ? -1 : compareA > compareB ? 1 : 0;
      } else {
        return compareA > compareB ? -1 : compareA < compareB ? 1 : 0;
      }
    });

  // Filtra y ordena los comercios de la misma ciudad del usuario
  const comerciosCiudad = comercios
    .filter(comercio => comercio.paginaID?.ciudad?.toLowerCase() === user?.ciudad?.toLowerCase() && comercio.paginaID)
    .sort((a, b) => {
      const compareA = a.paginaID.scoring;
      const compareB = b.paginaID.scoring;
      if (sortOrderCiudad === 'asc') {
        return compareA < compareB ? -1 : compareA > compareB ? 1 : 0;
      } else {
        return compareA > compareB ? -1 : compareA < compareB ? 1 : 0;
      }
    });

  // Filtra y ordena los comercios según los intereses del usuario
  const comerciosIntereses = comercios
    .filter(comercio => user?.intereses?.some(interes => comercio.paginaID?.actividad?.toLowerCase() === interes.toLowerCase()) && comercio.paginaID)
    .sort((a, b) => {
      const compareA = a.paginaID.scoring;
      const compareB = b.paginaID.scoring;
      if (sortOrderIntereses === 'asc') {
        return compareA < compareB ? -1 : compareA > compareB ? 1 : 0;
      } else {
        return compareA > compareB ? -1 : compareA < compareB ? 1 : 0;
      }
    });

  return (
    <>
      <Navbar />
      <div
        className="relative h-screen w-full overflow-hidden"
        style={{ backgroundImage: "url('/images/fondo.png')" }}
      >
        <div className="absolute inset-0 bg-cover bg-center backdrop-filter backdrop-blur-md"></div>
        <div className="absolute inset-0 overflow-y-auto px-4 pt-20">
          <div className="container mx-auto px-4 bg-transparent rounded-lg p-6">
            <h1 className="text-4xl text-black text-outline font-bold my-8 text-center">Comercios de tu Ciudad</h1>
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setSortOrderCiudad('asc')}
                className={`border border-gray-300 p-2 rounded mx-2 bg-transparent ${sortOrderCiudad === 'asc' ? 'bg-sky-600' : ''}`}
              >
                Ascendente
              </button>
              <button
                onClick={() => setSortOrderCiudad('desc')}
                className={`border border-gray-300 p-2 rounded mx-2 bg-transparent ${sortOrderCiudad === 'desc' ? 'bg-sky-600' : ''}`}
              >
                Descendente
              </button>
            </div>
            <div className="flex flex-wrap justify-center">
              {comerciosCiudad.map(comercio => (
                <ComercioCard key={comercio._id} comercio={comercio} />
              ))}
            </div>

            <h1 className="text-4xl text-black text-outline font-bold my-8 text-center">Comercios Basados en tus Intereses</h1>
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setSortOrderIntereses('asc')}
                className={`border border-gray-300 p-2 rounded mx-2 bg-transparent ${sortOrderIntereses === 'asc' ? 'bg-sky-600' : ''}`}
              >
                Ascendente
              </button>
              <button
                onClick={() => setSortOrderIntereses('desc')}
                className={`border border-gray-300 p-2 rounded mx-2 bg-transparent ${sortOrderIntereses === 'desc' ? 'bg-sky-600' : ''}`}
              >
                Descendente
              </button>
            </div>
            <div className="flex flex-wrap justify-center">
              {comerciosIntereses.map(comercio => (
                <ComercioCard key={comercio._id} comercio={comercio} />
              ))}
            </div>

            <h1 className="text-4xl text-black text-outline font-bold my-8 text-center">Todos los Comercios</h1>
            <div className="flex justify-center mb-4">
              <input
                type="text"
                placeholder="Buscar por nombre"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 p-2 rounded mx-2"
              />
              <input
                type="text"
                placeholder="Filtrar por ciudad"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="border border-gray-300 p-2 rounded mx-2"
              />
              <input
                type="text"
                placeholder="Filtrar por actividad"
                value={activityFilter}
                onChange={(e) => setActivityFilter(e.target.value)}
                className="border border-gray-300 p-2 rounded mx-2"
              />
              <button
                onClick={() => setSortOrder('asc')}
                className={`border border-gray-300 p-2 rounded mx-2 bg-transparent ${sortOrder === 'asc' ? 'bg-sky-600' : ''}`}
              >
                Ascendente
              </button>
              <button
                onClick={() => setSortOrder('desc')}
                className={`border border-gray-300 p-2 rounded mx-2 bg-transparent ${sortOrder === 'desc' ? 'bg-sky-600' : ''}`}
              >
                Descendente
              </button>
            </div>
            <div className="flex flex-wrap justify-center overflow-y-auto max-h-[70vh]">
              {filteredComercios.map(comercio => (
                <ComercioCard key={comercio._id} comercio={comercio} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InicioRegistrados;
