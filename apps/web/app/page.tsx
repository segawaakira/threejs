import React from "react";

import { redirect } from "next/navigation";
import HelloWorld from "@/components/hello-world";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    // <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 md:p-8">
    <div className="min-h-screen bg-background p-4 md:p-8">
      <HelloWorld />
    </div>
  );
}
