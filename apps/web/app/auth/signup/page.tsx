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
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // パスワードのバリデーション
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      toast.error("Password must contain both letters and numbers");
      return;
    }

    setIsLoading(true);

    try {
      // APIエンドポイントを環境変数から取得、デフォルトはローカル
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

      const response = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      // レスポンスが空でないかチェック
      const responseText = await response.text();
      console.log("Response text:", responseText);

      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        toast.error("Invalid response from server");
        return;
      }

      if (!response.ok) {
        toast.error(data.message || "Failed to create user");
        return;
      }

      toast.success("User created successfully");

      // 成功したらサインインページにリダイレクト
      router.push("/auth/signin");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Sign up
          </h2>
        </div>
        <form onSubmit={handleSignup} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレス"
              type="email"
              required
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="パスワード"
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating account..." : "会員登録"}
          </Button>
        </form>
      </div>
    </div>
  );
}
