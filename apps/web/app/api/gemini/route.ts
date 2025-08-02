import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { ingredients } = await req.json();

    if (!ingredients || !Array.isArray(ingredients)) {
      return NextResponse.json(
        { error: "ingredientsは配列で指定してください" },
        { status: 400 }
      );
    }

    const prompt = `以下の材料を使って、日本語で家庭向けの料理を1つ提案してください。料理名、簡単な手順、所要時間を含めてください。\n材料: ${ingredients.join(", ")}`;

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.NEXT_PUBLIC_GEMINI_API_KEY!, // APIキーはHeaderでも送信可能
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await res.json();
    const result =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "レシピを生成できませんでした";

    return NextResponse.json({ recipe: result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
