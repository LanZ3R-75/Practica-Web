"use client"

import LoginAdmin from "@/components/admin/login";
import { useSearchParams } from "next/navigation";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <LoginAdmin/>
    </main>
  );
}