"use client";

import { useRouter } from "next/navigation";

import { Button } from "@repo/ui/components/button";
import { useToast } from "@repo/ui/hooks/use-toast";
import { useSession, signOut } from "next-auth/react";

export default function SignUp() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    if (!session?.user?.id) {
      toast.error("User session not found");
      return;
    }

    // 削除前の確認
    const confirmed = window.confirm(
      "本当にアカウントを削除しますか？この操作は取り消せません。"
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch("http://localhost:3001/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: session.user.id,
      }),
    });

    if (!response.ok) {
      toast.error("Failed to delete user");
      console.log(response);
      return;
    }

    const data = await response.json();
    toast.success("Account deleted successfully", {
      description: "Your account has been permanently deleted",
    });

    // セッションを無効化してログインページにリダイレクト
    await signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <form onSubmit={handleDelete}>
      <Button type="button" onClick={handleDelete}>
        退会する
      </Button>
    </form>
  );
}
