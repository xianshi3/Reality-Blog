import { ZhipuAI } from "zhipuai";

export const runtime = "nodejs";

const client = new ZhipuAI({
  apiKey: process.env.ZHIPU_API_KEY!,
});

const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 2000;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("Messages array is required", { status: 400 });
    }

    if (messages.length > MAX_MESSAGES) {
      return new Response(`Too many messages (max ${MAX_MESSAGES})`, { status: 400 });
    }

    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return new Response("Each message must have role and content", { status: 400 });
      }
      if (typeof msg.content !== 'string' || msg.content.length > MAX_CONTENT_LENGTH) {
        return new Response(`Message content too long (max ${MAX_CONTENT_LENGTH} chars)`, { status: 400 });
      }
    }

    const response = await client.chat.completions.create({
      model: "glm-4-flash",
      messages,
      stream: true,
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const text = chunk.choices?.[0]?.delta?.content;
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(stream);
  } catch (err) {
    console.error("AI Chat API Error:", err);
    return new Response("AI service error, please try again later", {
      status: 500,
    });
  }
}
