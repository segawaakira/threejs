import React from "react";

import HelloWorld from "@/components/hello-world";

export default async function Home() {
  return (
    // <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 md:p-8">
    <div className="min-h-screen bg-background p-4 md:p-8">
      <HelloWorld />
    </div>
  );
}
