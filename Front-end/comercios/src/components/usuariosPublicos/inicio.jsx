"use client";
import { useEffect, useState } from "react";
import ComercioCard from '../usuariosPublicos/tarjetaComercio';
import Navbar from '../navBar/navBar';

const HomePage = () => {
  const [comercios, setComercios] = useState([]);

  useEffect(() => {
    fetchComercios();
  }, []);

  const fetchComercios = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/user/comercios/contenido');
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
            <h1 className="text-4xl text-orange-500 font-bold my-8 text-center">Comercios Registrados</h1>
            <div className="flex flex-wrap justify-center">
              {comercios.map(comercio => (
                <ComercioCard key={comercio._id} comercio={comercio} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
