"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { Progress } from "components/progress";
import { Alert, AlertDescription } from "@repo/ui/components/alert";
import { Upload, Camera, X, Check, Loader2, AlertCircle } from "lucide-react";

export function ImageUploadArea() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recognizedIngredients, setRecognizedIngredients] = useState<string[]>(
    []
  );
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // デモ用の認識結果
  const demoIngredients = [
    "トマト",
    "玉ねぎ",
    "人参",
    "じゃがいも",
    "ピーマン",
    "なす",
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      analyzeImage();
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setRecognizedIngredients([]);
    setSelectedIngredients([]);

    // デモ用の進捗シミュレーション
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsAnalyzing(false);
          setRecognizedIngredients(demoIngredients);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const toggleIngredientSelection = (ingredient: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const addSelectedIngredients = () => {
    // ここで実際の追加ロジックを呼び出す
    console.log("追加する食材:", selectedIngredients);

    // リセット
    setUploadedImage(null);
    setRecognizedIngredients([]);
    setSelectedIngredients([]);
    setAnalysisProgress(0);
  };

  const resetUpload = () => {
    setUploadedImage(null);
    setRecognizedIngredients([]);
    setSelectedIngredients([]);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
  };

  return (
    <div className="space-y-4">
      {!uploadedImage ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-orange-500 bg-orange-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-gray-100 rounded-full">
                <Upload className="h-8 w-8 text-gray-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">食材の画像をアップロード</h3>
              <p className="text-sm text-gray-500">
                ドラッグ&ドロップまたはクリックして画像を選択してください
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                variant="outline"
                onClick={() => document.getElementById("file-upload")?.click()}
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                ファイルを選択
              </Button>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-400">
              JPG, PNG, GIF形式に対応（最大10MB）
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* アップロードした画像のプレビュー */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="アップロードした食材画像"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetUpload}
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-white shadow-md hover:bg-gray-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="font-medium">画像を解析中...</h4>
                  {isAnalyzing ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-gray-600">
                          AIが食材を認識しています...
                        </span>
                      </div>
                      <Progress value={analysisProgress} className="w-full" />
                    </div>
                  ) : recognizedIngredients.length > 0 ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="h-4 w-4" />
                      <span className="text-sm">
                        {recognizedIngredients.length}個の食材を認識しました
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 認識された食材の選択 */}
          {recognizedIngredients.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    認識された食材を選択してください
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {recognizedIngredients.map((ingredient, index) => (
                      <Badge
                        key={index}
                        variant={
                          selectedIngredients.includes(ingredient)
                            ? "default"
                            : "outline"
                        }
                        className={`cursor-pointer transition-colors ${
                          selectedIngredients.includes(ingredient)
                            ? "bg-orange-600 hover:bg-orange-700"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => toggleIngredientSelection(ingredient)}
                      >
                        {selectedIngredients.includes(ingredient) && (
                          <Check className="h-3 w-3 mr-1" />
                        )}
                        {ingredient}
                      </Badge>
                    ))}
                  </div>

                  {selectedIngredients.length > 0 && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {selectedIngredients.length}個の食材が選択されています
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={addSelectedIngredients}
                      disabled={selectedIngredients.length === 0}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      選択した食材を追加 ({selectedIngredients.length})
                    </Button>
                    <Button variant="outline" onClick={resetUpload}>
                      キャンセル
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
