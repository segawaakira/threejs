"use client";

import { usePathname } from "next/navigation";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // ローディング中は何もしない
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // 認証されていない場合、authページ以外はリダイレクト
  if (!session && !pathname.includes("/auth")) {
    redirect("/auth/signin");
  }

  // 認証済みでauthページにいる場合はホームにリダイレクト
  if (session && pathname.includes("/auth")) {
    redirect("/");
  }

  return <>{children}</>;
}
