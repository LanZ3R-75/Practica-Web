"use client"

import RegistrarComercio from "@/components/admin/registrarComercio";
import { useSearchParams } from "next/navigation";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <RegistrarComercio />
    </main>
  );
}