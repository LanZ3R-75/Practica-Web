"use client";
import { useEffect, useState } from "react";
import ComercioCard from '../usuariosPublicos/tarjetaComercio';
import Navbar from '../navBar/navBar';

const HomePage = () => {
  const [comercios, setComercios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [activityFilter, setActivityFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchComercios(sortOrder);
  }, [sortOrder]);

  const fetchComercios = async (order = 'asc') => {
    try {
      console.log(`Fetching comercios with order: ${order}`);
      const response = await fetch(`http://localhost:3000/api/user/comercios/contenido?ordenar=${order}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Datos recibidos:', data); // Log para verificar los datos recibidos
        setComercios(data);
      } else {
        console.error('Error fetching comercios:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching comercios:', error);
    }
  };

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

  useEffect(() => {
    console.log('Filtered comercios:', filteredComercios);
  }, [filteredComercios]);

  return (
    <>
      <Navbar />
      <div
        className="relative h-screen w-full overflow-hidden"
        style={{ backgroundImage: "url('/images/fondo.png')" }}
      >
        <div className="absolute inset-0 bg-cover bg-center backdrop-filter backdrop-blur-md"></div>
        <div className="absolute inset-0 overflow-y-auto px-4 pt-20">
          <div className="container mx-auto px-4 bg-transparent rounded-lg  p-6">
            <h1 className="text-4xl text-black text-outline font-bold my-8 text-center">Comercios Registrados</h1>
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
            <div className="flex flex-wrap justify-center">
              {filteredComercios.length > 0 ? (
                filteredComercios.map(comercio => (
                  <ComercioCard key={comercio._id} comercio={comercio} />
                ))
              ) : (
                <p className="text-center text-black">No se encontraron comercios.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
