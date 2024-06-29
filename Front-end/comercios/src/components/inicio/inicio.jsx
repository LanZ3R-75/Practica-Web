"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../navBar/navBar';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <div className="relative h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/fondo.png')" }}
        >
          <div className="absolute inset-0 "></div>
        </div>

        <div className="absolute inset-0 flex justify-center items-center backdrop-filter backdrop-blur-md">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-black text-outline mb-8">Bienvenido a Shogyo</h1>
            <div className="flex flex-col space-y-4">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition transform hover:scale-105"
                onClick={() => router.push('/usuariosPublicos')}
              >
                Continuar sin registrarse
              </button>
              <div className="text-black">
                ¿Eres un usuario registrado? entonces inicia sesión{" "}
                <span
                  className="text-green-500 underline cursor-pointer"
                  onClick={() => router.push('/usuariosRegistrados')}
                >
                  aquí
                </span>
              </div>
              <div className="text-black">
                ¿Eres un comercio dado de alta? entonces inicia sesión{" "}
                <span
                  className="text-orange-500 underline cursor-pointer"
                  onClick={() => router.push('/comercios')}
                >
                  aquí
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
