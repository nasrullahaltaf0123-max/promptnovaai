import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GEMINI_MODEL = "gemini-2.0-flash";

const systemPrompts: Record<string, string> = {
  chat: "You are PromptNova AI, a helpful, friendly, and knowledgeable AI assistant. Provide clear, well-structured answers using markdown formatting when appropriate. Be concise but thorough.",
  blog: "You are PromptNova AI Blog Writer. Write a well-structured, engaging blog article. Use markdown with proper headings (##), bullet points, and paragraphs. Make it SEO-friendly and reader-engaging.",
  script: "You are PromptNova AI Script Generator. Write a professional video script with clear sections: [HOOK], [INTRO], [BODY], [CTA], [OUTRO]. Use engaging language appropriate for the requested tone.",
  prompt: "You are PromptNova AI Prompt Generator. Create a detailed, highly effective AI prompt based on the user's idea. The prompt should be clear, specific, and designed to get the best possible output from an AI model.",
  logo: "You are PromptNova AI Logo Designer. Describe 4 unique logo concepts in detail. For each concept, describe: the visual elements, color palette (with hex codes), typography suggestions, and the brand feeling it conveys. Format with markdown.",
  image: "You are PromptNova AI Image Concept Designer. Based on the user's description, create 4 detailed image descriptions that could be used as prompts for image generation. Each description should be vivid, specific, and artistic. Format with markdown.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { type, messages, prompt, options } = await req.json();
    const toolType = type || "chat";
    const systemPrompt = systemPrompts[toolType] || systemPrompts.chat;

    // Build Gemini request contents
    let contents: any[] = [];

    if (toolType === "chat" && messages) {
      // Chat mode: send conversation history
      contents = messages.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));
    } else {
      // Single generation mode: build prompt from options
      let userPrompt = prompt || "";
      if (toolType === "blog" && options) {
        userPrompt = `Write a ${options.wordCount || 500}-word ${options.tone || "Professional"} blog article about: ${prompt}`;
      } else if (toolType === "script" && options) {
        userPrompt = `Write a ${options.length || "1 minute"} video script in a ${options.tone || "Professional"} tone about: ${prompt}`;
      } else if (toolType === "prompt" && options) {
        userPrompt = `Generate a ${options.complexity || "Detailed"} AI prompt for the category "${options.category || "General"}" about: ${prompt}`;
      } else if (toolType === "logo" && options) {
        userPrompt = `Design logo concepts for brand "${prompt}" in the ${options.industry || "Technology"} industry with a ${options.style || "Minimal"} style.`;
      } else if (toolType === "image" && options) {
        userPrompt = `Create image concepts in ${options.style || "Photorealistic"} style at ${options.resolution || "1024x1024"} resolution for: ${prompt}`;
      }
      contents = [{ role: "user", parts: [{ text: userPrompt }] }];
    }

    const stream = toolType === "chat";
    const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}`;
    const url = stream
      ? `${baseUrl}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`
      : `${baseUrl}:generateContent?key=${GEMINI_API_KEY}`;

    const geminiResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: toolType === "chat" ? 0.7 : 0.8,
          maxOutputTokens: toolType === "blog" ? 4096 : 2048,
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", geminiResponse.status, errorText);
      return new Response(JSON.stringify({ error: "AI generation failed", details: errorText }), {
        status: geminiResponse.status === 429 ? 429 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (stream) {
      // Return SSE stream for chat
      return new Response(geminiResponse.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    } else {
      // Return JSON for other tools
      const data = await geminiResponse.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No content generated.";
      return new Response(JSON.stringify({ result: text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (e) {
    console.error("ai-generate error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
