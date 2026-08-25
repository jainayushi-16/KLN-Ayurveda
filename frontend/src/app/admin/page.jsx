"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/reviews");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F4EC]">
      <div className="text-center">
        <span className="text-4xl animate-bounce">👑</span>
        <p className="mt-2 text-sm font-bold text-[#2F5D34]">Redirecting to Admin Portal Reviews...</p>
      </div>
    </div>
  );
}
