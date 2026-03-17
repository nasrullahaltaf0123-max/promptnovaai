import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";
const IMAGE_MODEL = "google/gemini-2.5-flash-image";

const FREE_DAILY_CREDITS = 5;
const PRO_DAILY_CREDITS = 999;

function isBangla(text: string): boolean {
  return /[\u0980-\u09FF]/.test(text);
}

function buildImagePrompt(prompt: string, style: string): string {
  const base = `Ultra high quality, 4K, cinematic lighting, highly detailed, sharp focus, realistic textures, depth of field, professional photography, trending on artstation`;
  return `Generate a ${style} image of: ${prompt}. ${base}`;
}

function buildThumbnailPrompt(prompt: string, style: string, colorScheme: string): string {
  const base = `YouTube thumbnail, high CTR, bold composition, vibrant colors, high contrast, dramatic lighting, expressive subject, clickbait style, 16:9 ratio, ${style} style, ${colorScheme} color scheme`;
  const bangla = isBangla(prompt);
  const typographyRules = bangla
    ? `Bold Bangla headline text prominently displayed (large and centered), clean Bangla font style like Hind Siliguri or Noto Sans Bengali, thick strokes for readability, high contrast background, glow and shadow and outline effects for visibility`
    : `Bold English headline typography prominently displayed, clean modern sans-serif font like Montserrat or Bebas Neue style, large readable text, glow and shadow and stroke effects`;
  const effects = `Neon glow effect, drop shadow for depth, stroke outline for readability, slight blur background for focus on subject, gradient overlays, light particles and tech glow where relevant`;
  return `Create a thumbnail: ${prompt}. ${base}. Typography rules: ${typographyRules}. Add BIG headline text (2-4 words max), add emotion (shock, money, success, warning), use contrast (light text on dark bg or vice versa). Effects: ${effects}`;
}

function buildLogoPrompt(prompt: string, industry: string, style: string): string {
  const base = `Minimal modern logo, vector style, clean lines, scalable, professional SaaS branding, ${industry} industry, ${style} style`;
  const bangla = isBangla(prompt);
  const typographyRules = bangla
    ? `Bold Bangla lettering (clear and readable), minimal but strong shape, tech-inspired style, balanced typography and icon`
    : `Clean lettermark or wordmark, balanced spacing, subtle gradient (blue/purple), flat and modern design`;
  const effects = `Subtle glow (not heavy), sharp edges, transparent or no background, icon and text balanced`;
  return `Design a logo for brand "${prompt}". ${base}. Typography: ${typographyRules}. Effects: ${effects}`;
}

const systemPrompts: Record<string, string> = {
  chat: "You are PromptNova AI, a helpful, friendly, and knowledgeable AI assistant. Provide clear, well-structured answers using markdown formatting when appropriate. Be concise but thorough.",
  blog: "You are PromptNova AI Blog Writer. Write a well-structured, engaging blog article. Use markdown with proper headings (##), bullet points, and paragraphs. Make it SEO-friendly and reader-engaging.",
  script: "You are PromptNova AI Script Generator. Write a professional video script with clear sections: [HOOK], [INTRO], [BODY], [CTA], [OUTRO]. Use engaging language appropriate for the requested tone.",
  prompt: "You are PromptNova AI Prompt Generator. Create a detailed, highly effective AI prompt based on the user's idea. The prompt should be clear, specific, and designed to get the best possible output from an AI model.",
  image: "You are an AI image generator. Generate the image the user describes. Do not describe images in text — actually generate visual images.",
  thumbnail: "You are an AI thumbnail designer. Generate a visually striking thumbnail image. Do not describe — actually generate the image.",
  logo: "You are an AI logo designer. Generate a professional logo image. Do not describe — actually generate the image.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Auth: validate JWT ──
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Invalid or expired session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub as string;

    // ── Credit check ──
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, bonus_credits")
      .eq("id", userId)
      .single();

    const plan = (profile as any)?.plan || "free";
    const bonusCredits = (profile as any)?.bonus_credits || 0;
    const dailyLimit = plan === "pro" ? PRO_DAILY_CREDITS : FREE_DAILY_CREDITS;

    // Count today's total usage
    const today = new Date().toISOString().split("T")[0];
    const { data: usageRows } = await supabase
      .from("usage_tracking")
      .select("count")
      .eq("user_id", userId)
      .eq("used_at", today);

    const totalUsedToday = (usageRows as any[] || []).reduce((sum: number, r: any) => sum + (r.count || 0), 0);
    const effectiveLimit = dailyLimit + bonusCredits;

    if (totalUsedToday >= effectiveLimit) {
      return new Response(
        JSON.stringify({
          error: "Daily credit limit reached. Upgrade to Pro for more credits!",
          credits_used: totalUsedToday,
          credits_limit: effectiveLimit,
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Build request ──
    const { type, messages, prompt, options } = await req.json();
    const toolType = type || "chat";
    const systemPrompt = systemPrompts[toolType] || systemPrompts.chat;

    const chatMessages: any[] = [{ role: "system", content: systemPrompt }];
    const isImageGen = toolType === "image" || toolType === "thumbnail" || toolType === "logo";

    if (toolType === "chat" && messages) {
      chatMessages.push(...messages);
    } else {
      let userPrompt = prompt || "";
      if (toolType === "blog" && options) {
        userPrompt = `Write a ${options.wordCount || 500}-word ${options.tone || "Professional"} blog article about: ${prompt}`;
      } else if (toolType === "script" && options) {
        userPrompt = `Write a ${options.length || "1 minute"} video script in a ${options.tone || "Professional"} tone about: ${prompt}`;
      } else if (toolType === "prompt" && options) {
        userPrompt = `Generate a ${options.complexity || "Detailed"} AI prompt for the category "${options.category || "General"}" about: ${prompt}`;
      } else if (toolType === "image" && options) {
        userPrompt = buildImagePrompt(prompt, options.style || "photorealistic");
      } else if (toolType === "thumbnail" && options) {
        userPrompt = buildThumbnailPrompt(prompt, options.style || "YouTube", options.colorScheme || "Vibrant");
      } else if (toolType === "logo" && options) {
        userPrompt = buildLogoPrompt(prompt, options.industry || "Technology", options.style || "Minimal");
      }
      chatMessages.push({ role: "user", content: userPrompt });
    }

    const stream = toolType === "chat";
    const requestBody: any = {
      model: isImageGen ? IMAGE_MODEL : MODEL,
      messages: chatMessages,
      stream,
      max_tokens: toolType === "blog" ? 4096 : 2048,
      temperature: toolType === "chat" ? 0.7 : 0.8,
    };

    if (isImageGen) {
      requestBody.modalities = ["image", "text"];
      requestBody.stream = false;
    }

    const gatewayResponse = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!gatewayResponse.ok) {
      const errorText = await gatewayResponse.text();
      console.error("AI Gateway error:", gatewayResponse.status, errorText);

      if (gatewayResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (gatewayResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Record usage (server-side) ──
    const { data: existingUsage } = await supabase
      .from("usage_tracking")
      .select("id, count")
      .eq("user_id", userId)
      .eq("tool_type", toolType)
      .eq("used_at", today)
      .maybeSingle();

    if (existingUsage) {
      await supabase
        .from("usage_tracking")
        .update({ count: (existingUsage as any).count + 1 })
        .eq("id", (existingUsage as any).id);
    } else {
      await supabase
        .from("usage_tracking")
        .insert({ user_id: userId, tool_type: toolType, used_at: today, count: 1 });
    }

    // ── Return response ──
    if (stream) {
      return new Response(gatewayResponse.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    } else if (isImageGen) {
      const data = await gatewayResponse.json();
      const message = data.choices?.[0]?.message;
      const images = message?.images?.map((img: any) => img?.image_url?.url) || [];
      const text = message?.content || "";
      return new Response(JSON.stringify({ result: text, images }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      const data = await gatewayResponse.json();
      const text = data.choices?.[0]?.message?.content || "No content generated.";
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
