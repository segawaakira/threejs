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

    if (!response.ok) {
      toast.error("Failed to create user");
      console.log(response);
      return;
    }

    const data = await response.json();
    toast.success("User created successfully", {
      description: `Email: ${data.email}`,
    });

    // 成功したらサインインページにリダイレクト
    router.push("/auth/signin");
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
