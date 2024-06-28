"use client"

import InicioUsuarios from "@/components/usuariosPublicos/inicio";
import { useSearchParams } from "next/navigation";

export default function InicioUsuariosPublicos() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <InicioUsuarios/>
    </main>
  );
}