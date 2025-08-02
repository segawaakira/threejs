"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { useToast } from "@repo/ui/hooks/use-toast";

export default function SignUp() {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    // パスワードのバリデーション
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      toast.error("Password must contain both letters and numbers");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      console.log("Response status:", response.status);
      console.log("Response data:", data);

      if (!response.ok) {
        toast.error("Failed to create user", {
          description: data.message || "Unknown error occurred",
        });
        return;
      }

      toast.success("User created successfully", {
        description: `Email: ${data.email}`,
      });

      // 成功したらサインインページにリダイレクト
      router.push("/auth/signin");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Network error occurred");
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレス"
      />
      <Input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="パスワード"
      />
      <Button type="button" onClick={handleSignup}>
        会員登録
      </Button>
    </form>
  );
}
