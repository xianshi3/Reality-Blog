import { ZhipuAI } from "zhipuai";

export const runtime = "nodejs";

const client = new ZhipuAI({
  apiKey: process.env.ZHIPU_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

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
    console.error(err);
    return new Response("AI error", { status: 500 });
  }
}