"use client"

import InicioRegistrado from "@/components/usuariosRegistrados/inicioRegistrado";
import { useSearchParams } from "next/navigation";

export default function InicioUsuariosRegistrado() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <InicioRegistrado/>
    </main>
  );
}