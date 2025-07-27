"use client";

import { Button } from "@repo/ui/components/button";
import { useToast } from "@repo/ui/hooks/use-toast";

const HelloWorld = () => {
  const { toast } = useToast();

  // Simplicity - Just a simple button to get the hello world message
  const handleClick = async () => {
    const response = await fetch("http://localhost:3001/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      toast.error("Failed to connect to the backend");
      console.log(response);
    }

    const data = await response.json();
    toast.success(data.message);
  };

  const handleSubmit = async () => {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ingredients: ["卵", "トマト", "牛乳"],
      }),
    });

    const data = await response.json();
    console.log("レシピ:", data.recipe);
  };

  return (
    <div>
      <input type="text" />
      <Button size="lg" onClick={handleSubmit}>
        Hello World
      </Button>
    </div>
  );
};

export default HelloWorld;
