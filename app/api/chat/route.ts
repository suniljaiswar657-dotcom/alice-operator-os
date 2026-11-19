import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type Message = { role: "user" | "assistant"; content: string };

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY missing. Add it in your deployment environment variables." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const messages = body.messages as Message[];
    const department = String(body.department || "General");
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Please enter a message." }, { status: 400 });
    }
    if (messages.length > 24 || messages.some((m) => !["user", "assistant"].includes(m.role) || typeof m.content !== "string" || m.content.length > 8000)) {
      return NextResponse.json({ error: "Conversation is too large or invalid." }, { status: 400 });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: `You are Alice, an all-in-one AI operator. Current workspace department: ${department}. Be practical, structured, honest about limitations, and never claim to have performed actions outside this chat. For actions that need external access, explain what access or confirmation is required. Reply in the user's language.`,
        input: messages.map((m) => ({ role: m.role, content: m.content }))
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "The AI provider request failed." },
        { status: response.status }
      );
    }

    const answer = (data.output || [])
      .flatMap((item: { content?: Array<{ type?: string; text?: string }> }) => item.content || [])
      .filter((part: { type?: string }) => part.type === "output_text")
      .map((part: { text?: string }) => part.text || "")
      .join("\n")
      .trim();

    return NextResponse.json({ answer: answer || "I couldn't generate a response. Please try again." });
  } catch {
    return NextResponse.json({ error: "Request could not be processed. Please try again." }, { status: 500 });
  }
}