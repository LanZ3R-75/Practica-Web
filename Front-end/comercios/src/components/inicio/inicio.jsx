"use client"

import React from 'react';

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
        
        <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/fondo.jpg')" }}
        >
        <div className="absolute inset-0 bg-black opacity-20"></div>
    </div>
    
    <div className="absolute inset-0 flex justify-center items-center backdrop-filter backdrop-blur-lg">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Bienvenido a la Aplicación de Comercios</h1>
        <div className="flex flex-col space-y-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition transform hover:scale-105"
            onClick={() => window.location.href='/usuarios'}
          >
            Usuarios
          </button>
          <button
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition transform hover:scale-105"
            onClick={() => window.location.href='/admin'}
          >
            Admin
          </button>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition transform hover:scale-105"
            onClick={() => window.location.href='/comercios'}
          >
            Comercios
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}

