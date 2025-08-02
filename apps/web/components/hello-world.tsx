"use client";

import { Button } from "@repo/ui/components/button";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useSession, signOut } from "next-auth/react";

const HelloWorld = () => {
  const { data: session } = useSession();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<string>("");

  useEffect(() => {
    if (!session?.user?.id) return;
    const fetchIngredients = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/ingredient-sets?userId=${session?.user?.id}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          setIngredients(data[0].ingredients);
        }
      } catch (error) {
        console.error("Failed to fetch ingredients:", error);
      }
    };

    fetchIngredients();
  }, [session?.user?.id]);

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

  const handleCreate = async () => {
    const response = await fetch("http://localhost:3001/ingredient-sets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session?.user?.id,
        ingredients: ingredients,
      }),
    });

    const data = await response.json();
    console.log("✅ 送信結果:", data);
  };

  const handleUpdate = async () => {
    const response = await fetch(
      `http://localhost:3001/ingredient-sets/${session?.user?.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // userId: 6,
          ingredients: ingredients,
        }),
      }
    );

    const data = await response.json();
    console.log("✅ 送信結果:", data);
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
      <Button size="lg" onClick={() => signOut()}>
        Sign Out
      </Button>
      <Button size="lg" onClick={handleCreate}>
        Create
      </Button>
      <Button size="lg" onClick={handleUpdate}>
        Update
      </Button>
      <ReactMarkdown>{recipe}</ReactMarkdown>
    </div>
  );
};

export default HelloWorld;
