import { ZhipuAI } from "zhipuai";

/**
 * 指定运行时环境为 Node.js
 * 因为智谱AI SDK 需要 Node.js 环境支持
 */
export const runtime = "nodejs";

/**
 * 初始化智谱AI客户端
 * 使用环境变量中的 API 密钥
 * process.env.ZHIPU_API_KEY 需要在 Vercel 环境变量中配置
 */
const client = new ZhipuAI({
  apiKey: process.env.ZHIPU_API_KEY!,
});

/**
 * 处理聊天完成请求的 POST 方法
 * 
 * @param req - Next.js API 路由请求对象，包含消息列表
 * @returns 返回一个流式响应，包含 AI 生成的文本
 * 
 * 请求体格式：
 * {
 *   messages: [
 *     { role: "user", content: "用户消息" },
 *     { role: "assistant", content: "AI回复" }
 *   ]
 * }
 * 
 * 响应格式：
 * - 成功：返回文本流，每块包含 AI 生成的文本片段
 * - 失败：返回状态码 500 和错误信息
 * 
 * 流式响应示例：
 * 客户端可以通过 ReadableStream 逐块接收 AI 生成的文本，
 * 实现打字机效果的实时输出
 */
export async function POST(req: Request) {
  try {
    // 1. 解析请求体，获取消息列表
    const { messages } = await req.json();

    // 2. 调用智谱AI API 创建流式聊天完成
    // 使用 glm-4-flash 模型，支持流式输出
    const response = await client.chat.completions.create({
      model: "glm-4-flash",      // 使用快速响应模型
      messages,                    // 对话历史消息
      stream: true,               // 启用流式输出
    });

    // 3. 创建文本编码器，用于将字符串转换为 Uint8Array
    const encoder = new TextEncoder();

    // 4. 创建可读流，逐块处理 AI 返回的数据
    const stream = new ReadableStream({
      async start(controller) {
        // 遍历 AI 返回的每个数据块
        for await (const chunk of response) {
          // 从数据块中提取生成的文本内容
          const text = chunk.choices?.[0]?.delta?.content;
          
          // 如果有文本内容，将其编码并推送到流中
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        // 所有数据块处理完毕，关闭流
        controller.close();
      },
    });

    // 5. 返回流式响应
    return new Response(stream);

  } catch (err) {
    // 错误处理：记录错误并返回 500 状态码
    console.error("AI Chat API Error:", err);
    return new Response("AI service error, please try again later", { 
      status: 500 
    });
  }
}