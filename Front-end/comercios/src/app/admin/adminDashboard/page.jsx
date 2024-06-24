"use client"

import AdminDashboard from "@/components/admin/adminDashboard";
import { useSearchParams } from "next/navigation";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <AdminDashboard />
    </main>
  );
}