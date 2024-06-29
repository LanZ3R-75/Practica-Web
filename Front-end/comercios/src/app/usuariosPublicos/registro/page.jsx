"use client"

import RegistroUsuarios from "@/components/usuariosPublicos/registro";
import { useSearchParams } from "next/navigation";

export default function RegistroUsuariosPublicos() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <RegistroUsuarios/>
    </main>
  );
}