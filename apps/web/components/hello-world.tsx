"use client";

import { Button } from "@repo/ui/components/button";
import { useToast } from "@repo/ui/hooks/use-toast";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const HelloWorld = () => {
  const { toast } = useToast();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<string>("");
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
        ingredients: ingredients,
      }),
    });

    const data = await response.json();
    setRecipe(data.recipe);
  };

  return (
    <div>
      <input
        type="text"
        value={ingredients.join(",")}
        onChange={(e) => setIngredients(e.target.value.split(","))}
      />
      <Button size="lg" onClick={handleSubmit}>
        Hello World
      </Button>
      <ReactMarkdown>{recipe}</ReactMarkdown>
    </div>
  );
};

export default HelloWorld;
