import React from "react";
import { ChairComponent } from "@/components/chair";

export default function Chair() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 md:p-8">
      <ChairComponent />
    </div>
  );
}
