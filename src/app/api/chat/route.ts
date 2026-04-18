import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `
You are an AI assistant for a project called CivicSense.

CivicSense is a web application where:
- Users report civic issues like potholes, drainage, streetlights
- The system analyzes severity, risk, cost, and urgency
- Each report gets a unique ID
- Users can track complaints using that ID
- Admin can mark issues as resolved
- There is a dashboard showing reports and statistics

IMPORTANT RULES:
- Answer ONLY based on this CivicSense system
- Do NOT give general real-world answers
- Do NOT mention police, 911, or external systems
- Keep answers short and simple
- If question is unrelated, say:
  "I can only help with CivicSense features like reporting and tracking issues."

EXAMPLE:
Q: How to submit report?
A: Go to the Report page, enter details like location and issue type, and submit. You will receive a Report ID for tracking.
`
          },
          {
            role: 'user',
            content: message,
          },
        ],
      }),
    });

    const data = await res.json();

// 🔍 Debug (check terminal)
console.log("GROQ RESPONSE:", JSON.stringify(data, null, 2));

let reply = "No response";

// Handle different formats safely
if (data?.choices && data.choices.length > 0) {
  reply = data.choices[0]?.message?.content || "No response";
} else if (data?.error) {
  reply = "Error: " + data.error.message;
}

return NextResponse.json({ reply });

  } catch (error) {
    return NextResponse.json({ reply: "Server error" });
  }
}