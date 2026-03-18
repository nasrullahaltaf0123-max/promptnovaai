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
  if (/crime|murder|killer|mafia|drug|cartel|gang|prison|অপরাধ|খুন|মাফিয়া/.test(t)) return "crime";
  if (/motivat|success|inspire|dream|goal|winner|champion|hustle|grind|অনুপ্রেরণা|সাফল্য|স্বপ্ন/.test(t)) return "motivation";
  if (/war|battle|histor|ancient|empire|kingdom|soldier|invasion|colonial|freedom|independence|মুক্তিযুদ্ধ|যুদ্ধ|ইতিহাস|সাম্রাজ্য/.test(t)) return "history";
  if (/money|econom|poverty|rich|poor|gdp|inflation|failure|bankrupt|crisis|recession|billion|million|wealth|টাকা|দারিদ্র্য|অর্থনীতি|ব্যর্থ|কোটিপতি/.test(t)) return "money";
  if (/tech|ai|robot|cyber|digital|future|software|code|computer|program|প্রযুক্তি|কৃত্রিম বুদ্ধিমত্তা/.test(t)) return "technology";
  if (/educat|school|university|knowledge|learn|study|book|library|teacher|শিক্ষা|বিদ্যালয়|জ্ঞান|পড়াশোনা/.test(t)) return "education";
  if (/politic|leader|election|govern|minister|parliament|vote|president|রাজনীতি|নেতা|নির্বাচন|সরকার/.test(t)) return "politics";
  if (/space|planet|universe|galaxy|nasa|star|moon|mars|মহাকাশ|গ্রহ|নক্ষত্র/.test(t)) return "space";
  if (/sport|football|cricket|game|player|champion|tournament|খেলা|ক্রিকেট|ফুটবল/.test(t)) return "sports";
  if (/horror|ghost|scary|dark|mystery|haunted|ভয়|ভূত|রহস্য/.test(t)) return "horror";
  if (/health|disease|doctor|hospital|medicine|virus|cancer|diet|fitness|স্বাস্থ্য|রোগ|চিকিৎসা/.test(t)) return "health";
  return "general";
}

function getCategoryScene(category: string): { scene: string; tone: string; elements: string } {
  const scenes: Record<string, { scene: string; tone: string; elements: string }> = {
    history: {
      scene: "SPLIT STORYTELLING: Left side shows ancient battlefield ruins with smoke, burning villages, soldiers in silhouette. Right side transitions to modern peaceful cityscape with monuments. Time-travel contrast composition",
      tone: "Left: desaturated sepia with red/orange fire glow. Right: warm golden hour modern tones. Strong light divide in center",
      elements: "Volumetric smoke, floating embers, cracked stone, ancient weapons on ground, dust particles in dramatic light shafts, distant flames reflecting on wet ground",
    },
    money: {
      scene: "WEALTH CONTRAST: Massive pile of gold coins and cash bundles in foreground, stock market growth chart with glowing green arrows shooting upward, luxury vs poverty split. Left shows struggle (empty pockets, cracked floor), right shows abundance (gold, skyscrapers, luxury)",
      tone: "Left: dark cold blue desaturated. Right: rich golden warm with green money glow accents",
      elements: "Floating dollar bills, gold particles, upward arrows, bar charts, scattered coins catching light, money rain effect, reflective gold surfaces",
    },
    crime: {
      scene: "Dark urban alley with police sirens reflecting red and blue on wet pavement, crime scene tape, shadowy figure silhouette, noir detective atmosphere. City skyline in foggy background",
      tone: "Very dark with harsh red and blue police light contrast, noir color grade, deep shadows with selective color",
      elements: "Rain reflections on pavement, police light streaks, crime tape, cigarette smoke, broken glass, evidence markers, wet surfaces reflecting lights",
    },
    motivation: {
      scene: "TRANSFORMATION JOURNEY: Left shows person at rock bottom (dark, rain, fallen). Right shows summit of mountain with sunrise, victory pose silhouette. Path of progress connecting both sides",
      tone: "Left: dark stormy blue-grey. Right: epic golden sunrise with warm orange rays. Dramatic transition from dark to light",
      elements: "Mountain peak, sunrise god rays, stepping stones path, storm clouds clearing, golden light breakthrough, victory stance shadow",
    },
    technology: {
      scene: "Futuristic AI command center with massive holographic displays showing neural networks, a glowing AI brain visualization floating in center, cyberpunk cityscape visible through panoramic window",
      tone: "Deep midnight blue with electric cyan and purple neon accents, dark environment with bright holographic elements",
      elements: "Holographic UI panels, circuit board patterns, glowing data streams, floating code fragments, neural network visualization, lens flares, digital particles, matrix-style data rain",
    },
    education: {
      scene: "KNOWLEDGE TRANSFORMATION: Left shows struggling student in dim candlelight with books. Right shows graduate on stage with spotlight, diploma, successful career. Library transforms into modern university",
      tone: "Left: warm amber candlelight. Right: bright stage spotlight white with golden graduation warmth",
      elements: "Towering bookshelves, floating knowledge particles, graduation cap in air, trophy, scholarship documents, light of wisdom breaking through",
    },
    politics: {
      scene: "Dramatic parliament building with stormy sky, massive crowd gathering with raised fists, leader podium silhouette against spotlight, flags waving in dramatic wind, tension-filled political rally atmosphere",
      tone: "High contrast: deep navy blue sky with dramatic red and white spotlight beams, storm clouds with lightning",
      elements: "Waving flags, crowd silhouettes, microphone podium, dramatic storm clouds, spotlight beams cutting through darkness, rain, tension atmosphere",
    },
    space: {
      scene: "Astronaut helmet close-up reflecting a massive nebula and distant Earth, deep space station window view showing cosmic phenomena, epic scale of universe",
      tone: "Deep space blacks with vibrant nebula colors: electric purple, cosmic blue, supernova orange, star white",
      elements: "Star fields, nebula gas clouds, planet rings, space station interior, helmet reflection, asteroid debris, cosmic dust, distant galaxy spiral",
    },
    sports: {
      scene: "Stadium final moment: massive crowd in dramatic lighting, spotlight cutting through smoke/pyrotechnics, victory celebration freeze-frame, confetti explosion",
      tone: "High contrast stadium lighting: bright white spots against deep dark crowd, vivid green field, golden trophy glow",
      elements: "Spotlight beams through smoke, confetti explosion, crowd wave, motion blur energy trails, trophy gleam, pyrotechnic sparks",
    },
    horror: {
      scene: "Abandoned asylum corridor with single flickering red emergency light, long shadows stretching toward viewer, fog creeping along cracked floor, something lurking in distant darkness",
      tone: "Near-black with sickly green-grey undertones, single harsh red or cold blue light source, maximum shadow",
      elements: "Flickering light strobes, thick floor fog, cracked peeling walls, distorted shadows, floating dust, cobwebs, eerie silhouette in far doorway",
    },
    health: {
      scene: "Medical drama composition: hospital corridor with dramatic overhead surgical light, DNA helix visualization, microscopic virus particles enlarged to dramatic scale, life-saving moment tension",
      tone: "Clinical blue-white with warm human skin tones, sterile environment with emotional warmth, selective red for urgency",
      elements: "DNA helix, microscopic cells enlarged, surgical light halo, heartbeat monitor line, medical equipment silhouettes, dramatic lens flare from surgical lamp",
    },
    general: {
      scene: "Epic cinematic landscape with dramatic cloud formation, volumetric god rays breaking through storm clouds onto a lone figure, sweeping vista with strong foreground-background depth",
      tone: "Hollywood-grade teal and orange complementary color split, high dynamic range, moody atmospheric grade",
      elements: "Volumetric god rays, atmospheric haze, dramatic clouds, bokeh lights, lens flare, layered depth with foreground silhouettes, particle dust in light beams",
    },
  };
  return scenes[category] || scenes.general;
}

function getEmotionForCategory(category: string): string {
  const emotions: Record<string, string> = {
    history: "serious, intense, battle-hardened expression, looking into the distance with determination",
    economy: "shocked, frustrated expression, wide eyes showing disbelief, furrowed brows",
    technology: "awe-struck, fascinated expression, eyes reflecting holographic light, slight wonder",
    education: "thoughtful, wise expression, contemplative gaze, intellectual confidence",
    politics: "stern, authoritative expression, commanding presence, sharp focused eyes",
    space: "awestruck, mouth slightly open, eyes wide reflecting starlight, wonder and amazement",
    sports: "fierce determination, sweat on face, victory scream, raw competitive energy",
    horror: "terrified, eyes wide with fear, pale face, mouth open in silent scream",
    general: "dramatic intense expression, strong eye contact with camera, cinematic presence",
  };
  return emotions[category] || emotions.general;
}

function buildThumbnailPrompt(prompt: string, style: string, colorScheme: string): string {
  const category = detectTopicCategory(prompt);
  const { scene, tone, elements } = getCategoryScene(category);
  const emotion = getEmotionForCategory(category);

  return `Generate a HIGH-CTR CINEMATIC YOUTUBE THUMBNAIL IMAGE for the topic: "${prompt}".

MANDATORY SUBJECT (RIGHT SIDE):
- A photorealistic human figure positioned on the RIGHT 40% of the frame
- Expression: ${emotion}
- Shot from chest up, slightly angled, looking toward camera or slightly off-camera
- RED GLOW OUTLINE around the subject (subtle neon red edge lighting / rim light)
- Strong backlight creating dramatic silhouette edge
- Face must be sharp, detailed, and emotionally expressive
- Subject should feel like a real documentary host or storyteller

BACKGROUND (FULL FRAME, BEHIND SUBJECT):
- ${scene}
- COLOR TONE: ${tone}
- DETAIL ELEMENTS: ${elements}
- Background should be slightly BLURRED (depth of field, f/1.8 bokeh effect)
- Dramatic cinematic lighting: strong key light from one side, fill light opposite

COMPOSITION RULES:
- LEFT 55% of frame: keep relatively clear for text overlay (darker, more atmospheric)
- RIGHT 45% of frame: subject with dramatic lighting
- Storytelling split if applicable: left = problem/past (darker), right = solution/future (brighter)
- Layered depth: foreground particles/smoke, mid-ground subject sharp, background atmospheric blur
- ${style} visual style, ${colorScheme} color emphasis

COLOR GRADING:
- High contrast cinematic grade (like movie color correction)
- Teal shadows + orange highlights (complementary color split)
- Deep blacks, rich midtones, controlled highlights
- Dramatic vignette darkening edges

CINEMATIC EFFECTS:
- Volumetric light rays or god rays from behind/above subject
- Atmospheric haze or particles (smoke, dust, embers based on topic)
- Lens flare from strong light source
- Red/orange rim light on subject edges creating glow outline effect

CRITICAL RULES:
- ABSOLUTELY NO TEXT, LETTERS, WORDS, OR TYPOGRAPHY in the image
- No watermarks, no logos, no written content
- Must look like a viral YouTube documentary thumbnail (MrBeast/Veritasium quality)
- NOT generic AI art — must feel like a real cinematic movie still
- High detail, photorealistic textures, 8K quality
- Every thumbnail must tell a visual story`;
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
    const today = new Date().toISOString().split("T")[0];
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
