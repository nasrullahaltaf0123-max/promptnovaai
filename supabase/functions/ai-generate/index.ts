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

function detectTopicCategory(text: string): string {
  const t = text.toLowerCase();
  if (/war|battle|histor|ancient|empire|kingdom|soldier|invasion|colonial|freedom|independence|মুক্তিযুদ্ধ|যুদ্ধ|ইতিহাস|সাম্রাজ্য/.test(t))
    return "history";
  if (/econom|poverty|rich|poor|gdp|inflation|failure|bankrupt|crisis|recession|দারিদ্র্য|অর্থনীতি|ব্যর্থ/.test(t))
    return "economy";
  if (/tech|ai|robot|cyber|digital|future|software|code|computer|program|প্রযুক্তি|কৃত্রিম বুদ্ধিমত্তা/.test(t))
    return "technology";
  if (/educat|school|university|knowledge|learn|study|book|library|teacher|শিক্ষা|বিদ্যালয়|জ্ঞান|পড়াশোনা/.test(t))
    return "education";
  if (/politic|leader|election|govern|minister|parliament|vote|president|রাজনীতি|নেতা|নির্বাচন|সরকার/.test(t))
    return "politics";
  if (/space|planet|universe|galaxy|nasa|star|moon|mars|মহাকাশ|গ্রহ|নক্ষত্র/.test(t))
    return "space";
  if (/sport|football|cricket|game|player|champion|tournament|খেলা|ক্রিকেট|ফুটবল/.test(t))
    return "sports";
  if (/horror|ghost|scary|dark|mystery|haunted|ভয়|ভূত|রহস্য/.test(t))
    return "horror";
  return "general";
}

function getCategoryScene(category: string): { scene: string; tone: string; elements: string } {
  const scenes: Record<string, { scene: string; tone: string; elements: string }> = {
    history: {
      scene: "Ancient ruins with dramatic smoke and fire, historical battlefield aftermath, crumbling fortress walls, soldiers silhouettes against burning sky",
      tone: "Desaturated warm palette with selective red/orange highlights, slight grayscale with sepia undertones",
      elements: "Volumetric smoke, embers floating in air, cracked stone textures, distant flames, dust particles in light beams",
    },
    economy: {
      scene: "Split composition: left side shows broken infrastructure and slums in shadow, right side shows gleaming modern skyscrapers in golden light. Contrast between poverty and wealth",
      tone: "Left dark and desaturated, right bright and vibrant with golden hour warmth",
      elements: "Cracked ground vs polished floors, scattered coins, broken vs pristine buildings, dramatic light divide",
    },
    technology: {
      scene: "Futuristic control room with holographic displays, neon-lit cyberpunk cityscape, advanced AI neural network visualization floating in dark space",
      tone: "Deep blue and electric purple with cyan neon accents, dark environment with bright tech elements",
      elements: "Holographic UI elements, circuit board patterns, glowing data streams, lens flares, digital particles",
    },
    education: {
      scene: "Grand library with towering bookshelves, warm sunlight streaming through large windows onto ancient maps and open books, scholarly atmosphere",
      tone: "Warm amber and golden tones, soft diffused lighting, rich wood textures",
      elements: "Stacked books, globe, quill pen, floating knowledge particles, warm dust motes in light beams",
    },
    politics: {
      scene: "Dramatic government building silhouette against stormy sky, crowd gathering in tension, flags waving in dramatic wind, power and authority atmosphere",
      tone: "High contrast dark blues and deep reds, stormy atmospheric lighting",
      elements: "Flag silhouettes, crowd shadows, dramatic clouds, spotlight beams, architectural pillars",
    },
    space: {
      scene: "Deep space nebula with distant galaxies, planet surface with Earth rising on horizon, astronaut perspective of cosmic vastness",
      tone: "Deep space blacks with vibrant nebula colors: purple, blue, orange, cosmic palette",
      elements: "Star fields, nebula gas clouds, planet rings, asteroid debris, lens flare from distant star",
    },
    sports: {
      scene: "Stadium with dramatic spotlight beams cutting through atmosphere, arena floor with motion blur, victory moment atmosphere",
      tone: "High contrast with vivid stadium lighting, green and golden accents",
      elements: "Spotlight beams, crowd blur, motion trails, confetti particles, dramatic shadows",
    },
    horror: {
      scene: "Abandoned dark corridor with single flickering light, fog creeping along floor, eerie shadows on cracked walls, unsettling atmosphere",
      tone: "Very dark with cold blue-green undertones, minimal harsh lighting, deep shadows",
      elements: "Fog, flickering light, cracks in walls, distorted shadows, dust particles",
    },
    general: {
      scene: "Cinematic wide-angle dramatic landscape or abstract composition with strong visual impact, storytelling mood",
      tone: "High contrast cinematic color grading with complementary color split (teal and orange)",
      elements: "Volumetric light rays, atmospheric haze, bokeh, lens flare, layered depth",
    },
  };
  return scenes[category] || scenes.general;
}

function buildThumbnailPrompt(prompt: string, style: string, colorScheme: string): string {
  const category = detectTopicCategory(prompt);
  const { scene, tone, elements } = getCategoryScene(category);

  return `Generate a CINEMATIC THUMBNAIL BACKGROUND IMAGE for the topic: "${prompt}".

SCENE: ${scene}
COLOR TONE: ${tone}
DETAIL ELEMENTS: ${elements}

COMPOSITION RULES:
- Layered depth: foreground elements slightly blurred, mid-ground sharp, background atmospheric
- Dramatic cinematic lighting with strong contrast between light and shadow
- Movie-poster quality, NOT generic AI art
- Leave clear space on the left side for text overlay
- ${style} visual style, ${colorScheme} color emphasis

CRITICAL RULES:
- ABSOLUTELY NO TEXT, LETTERS, WORDS, OR TYPOGRAPHY in the image
- No watermarks, no logos, no written content
- Pure visual background only
- High detail, photorealistic textures, 4K quality
- Must feel like a movie scene or documentary still frame`;
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

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid or expired session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;

    // ── Credit check ──
    const serviceClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: profile } = await serviceClient
      .from("profiles")
      .select("plan, bonus_credits, role")
      .eq("id", userId)
      .single();

    const plan = (profile as any)?.plan || "free";
    const userRole = (profile as any)?.role || "user";
    const isAdmin = userRole === "admin";

    // Admin users bypass all limits
    if (!isAdmin) {
      const bonusCredits = (profile as any)?.bonus_credits || 0;
      const dailyLimit = plan === "pro" ? PRO_DAILY_CREDITS : FREE_DAILY_CREDITS;

      const today = new Date().toISOString().split("T")[0];
      const { data: usageRows } = await serviceClient
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
