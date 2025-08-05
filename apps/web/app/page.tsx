"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { Separator } from "@repo/ui/components/separator";
import { Trash2, Plus, ChefHat, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";

import { User, LogOut, UserX, Heart } from "lucide-react";
import { Camera, Type } from "lucide-react";
import { ImageUploadArea } from "components/image-upload-area";
import { signOut, useSession } from "next-auth/react";
import { useToast } from "@repo/ui/hooks/use-toast";

export default function RecipeApp() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [isFetchedIngredients, setIsFetchedIngredients] = useState(false);

  const [recipe, setRecipe] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showIngredientDeleteConfirm, setShowIngredientDeleteConfirm] =
    useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState<string>("");

  useEffect(() => {
    if (!session?.user?.id) return;
    const fetchIngredients = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ingredient-sets?userId=${session?.user?.id}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          setIngredients(data[0].ingredients);
        }
      } catch (error) {
        console.error("Failed to fetch ingredients:", error);
      } finally {
        setIsFetchedIngredients(true);
      }
    };

    fetchIngredients();
  }, [session?.user?.id]);

  useEffect(() => {
    if (!session?.user?.id || !isFetchedIngredients) return;
    const updateIngredients = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ingredient-sets/${session?.user?.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              // userId: 6,
              ingredients: ingredients,
            }),
          }
        );
      } catch (error) {
        console.error("Failed to fetch ingredients:", error);
      }
    };

    updateIngredients();
  }, [ingredients, session?.user?.id, isFetchedIngredients]);

  const addIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  const generateRecipe = async () => {
    if (ingredients.length === 0) return;

    setIsGenerating(true);
    setRecipe("");
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: ingredients,
        }),
      });

      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      setRecipe(
        "レシピの生成中にエラーが発生しました。もう一度お試しください。"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const saveRecipe = () => {
    if (recipe && !savedRecipes.includes(recipe)) {
      setSavedRecipes([...savedRecipes, recipe]);
    }
  };

  const handleLogout = () => {
    setSavedRecipes([]);
    signOut();
  };

  const handleDeleteAccount = async () => {
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

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
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

      await response.json();
      toast.success("Account deleted successfully", {
        description: "Your account has been permanently deleted",
      });

      // セッションを無効化してログインページにリダイレクト
      await signOut({ callbackUrl: "/auth/signin" });
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error("Network error occurred");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addIngredient();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-orange-600" />
            <h1 className="text-xl font-bold text-gray-900">
              AIレシピ提案アプリ
            </h1>
          </div>

          {session?.user?.id ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-3"
                >
                  <User className="h-8 w-8 text-orange-600" />
                  {/* <span className="hidden sm:inline">{user.name}</span> */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <p className="text-xs text-gray-500 p-4 break-all">
                  {session?.user?.email}
                </p>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem>
                  <BookOpen className="h-4 w-4 mr-2" />
                  保存したレシピ ({savedRecipes.length})
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={handleLogout} className="">
                  <LogOut className="h-4 w-4 mr-2" />
                  ログアウト
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteConfirm(true)}
                  className=""
                >
                  <UserX className="h-4 w-4 mr-2" />
                  退会する
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <a href="/auth/signin">ログイン</a>
              </Button>
              <Button asChild>
                <a href="/auth/signup">新規登録</a>
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {!session?.user?.id && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <User className="h-12 w-12 mx-auto text-blue-600" />
                  <h3 className="font-semibold text-blue-900">
                    ログインしてレシピを保存
                  </h3>
                  <p className="text-blue-700 text-sm">
                    アカウントを作成すると、お気に入りのレシピを保存できます
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" asChild>
                      <a href="/auth/signin">ログイン</a>
                    </Button>
                    <Button asChild>
                      <a href="/auth/signup">新規登録</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <ChefHat className="h-8 w-8 text-orange-600" />
                AIレシピ提案アプリ
              </h1>
              <p className="text-gray-600">
                所有している食材からAIがおすすめレシピを提案します
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 食材管理セクション */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    食材管理
                  </CardTitle>
                  <CardDescription>
                    テキスト入力または画像から食材を追加できます
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 食材追加方法の切り替え */}
                  <div className="space-y-4">
                    {/* 既存のテキスト入力 */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="食材名を入力..."
                        value={newIngredient}
                        onChange={(e) => setNewIngredient(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button
                        onClick={addIngredient}
                        disabled={!newIngredient.trim()}
                      >
                        追加
                      </Button>
                    </div>
                  </div>

                  {/* 食材一覧は既存のまま */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-gray-700">
                      所有食材 ({ingredients.length}個)
                    </h3>
                    {ingredients.length === 0 ? (
                      <p className="text-gray-500 text-sm py-4 text-center">
                        食材を追加してください
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {ingredients.map((ingredient, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1 px-3 py-1"
                          >
                            {ingredient}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-red-100"
                              onClick={() => {
                                setIngredientToDelete(ingredient);
                                setShowIngredientDeleteConfirm(true);
                              }}
                            >
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* レシピ生成ボタンは既存のまま */}
                  <Button
                    onClick={generateRecipe}
                    disabled={ingredients.length === 0 || isGenerating}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        レシピを生成中...
                      </>
                    ) : (
                      <>
                        <ChefHat className="h-4 w-4 mr-2" />
                        AIレシピを作成
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* レシピ表示セクション */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChefHat className="h-5 w-5" />
                    おすすめレシピ
                  </CardTitle>
                  <CardDescription>
                    AIが提案するレシピが表示されます
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recipe ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{recipe}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <ChefHat className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>「AIレシピを作成」ボタンを押して</p>
                      <p>おすすめレシピを生成してください</p>
                    </div>
                  )}
                  {/* {recipe && session?.user?.id && (
                    <div className="mt-4 pt-4 border-t">
                      <Button
                        onClick={saveRecipe}
                        variant="outline"
                        className="w-full bg-transparent"
                        disabled={savedRecipes.includes(recipe)}
                      >
                        <Heart
                          className={`h-4 w-4 mr-2 ${savedRecipes.includes(recipe) ? "fill-red-500 text-red-500" : ""}`}
                        />
                        {savedRecipes.includes(recipe)
                          ? "保存済み"
                          : "レシピを保存"}
                      </Button>
                    </div>
                  )} */}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* アカウント削除確認ダイアログ */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              アカウント削除の確認
            </DialogTitle>
            <DialogDescription>
              本当にアカウントを削除しますか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                キャンセル
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleDeleteAccount();
                  setShowDeleteConfirm(false);
                }}
              >
                削除する
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 食材削除確認ダイアログ */}
      <Dialog
        open={showIngredientDeleteConfirm}
        onOpenChange={setShowIngredientDeleteConfirm}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">食材削除の確認</DialogTitle>
            <DialogDescription>
              本当に「{ingredientToDelete}」を削除しますか？
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowIngredientDeleteConfirm(false);
                  setIngredientToDelete("");
                }}
              >
                キャンセル
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setIngredients(
                    ingredients.filter((i) => i !== ingredientToDelete)
                  );
                  setShowIngredientDeleteConfirm(false);
                  setIngredientToDelete("");
                }}
              >
                削除する
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
