"use client"

import LoginUsuarios from "@/components/usuarios/login";
import { useSearchParams } from "next/navigation";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <LoginUsuarios/>
    </main>
  );
}