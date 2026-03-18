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
    history: "serious, intense, battle-hardened expression with deep focused eyes staring into distance, jaw clenched with determination, weathered but strong",
    money: "SHOCKED and EXCITED expression, eyes extremely wide open, mouth slightly open in disbelief, eyebrows raised high, as if seeing incredible wealth for the first time",
    crime: "dark suspicious look, narrowed eyes with intensity, one eyebrow raised, shadowy mysterious expression, noir detective energy",
    motivation: "powerful confident smile, chest out, chin slightly raised, eyes burning with determination, winner's expression, unstoppable energy",
    technology: "awe-struck fascinated expression, eyes wide reflecting holographic blue light, slight wonder and curiosity, futuristic genius look",
    education: "thoughtful intellectual expression, slight knowing smile, wise contemplative gaze, confident scholar energy, glasses optional",
    politics: "stern authoritative commanding expression, sharp piercing eyes, slight frown of power, leader's decisive face",
    space: "pure awestruck wonder, mouth slightly open, eyes wide reflecting starlight and nebula colors, cosmic amazement",
    sports: "fierce battle cry expression, veins visible, intense competitive scream, sweat glistening, raw victory energy",
    horror: "genuine terror, eyes wide with primal fear, pale skin, mouth open in silent scream, looking at something horrifying off-camera",
    health: "concerned empathetic expression, focused doctor's gaze, slight worry mixed with determination to save, medical professional intensity",
    general: "dramatic intense expression with strong eye contact directly at camera, charismatic presence, slightly furrowed brow, commanding attention",
  };
  return emotions[category] || emotions.general;
}

function buildThumbnailPrompt(prompt: string, style: string, colorScheme: string): string {
  const category = detectTopicCategory(prompt);
  const { scene, tone, elements } = getCategoryScene(category);
  const emotion = getEmotionForCategory(category);

  return `Generate a MASTER-LEVEL CINEMATIC YOUTUBE THUMBNAIL for the topic: "${prompt}".

═══ MANDATORY SUBJECT (RIGHT 40% OF FRAME) ═══
- Ultra-photorealistic South Asian male face and upper body, age 25-35
- EMOTION: ${emotion}
- Camera angle: medium close-up, chest to head, slightly angled 15° to the right
- Looking toward camera or dramatically off-camera based on emotion
- Skin texture must be hyper-detailed: visible pores, natural skin imperfections, realistic lighting on skin
- Hair slightly wind-blown or dramatic
- Subject must be SHARP (f/2.8 focus on face) while background is BLURRED

═══ RED GLOW RIM LIGHT (CRITICAL) ═══
- Strong RED/CRIMSON neon rim light outlining the subject's head, shoulders, and body edge
- The red glow should be visible as a bright edge light separating subject from background
- Additional warm backlight creating a halo/glow effect behind the subject's head
- This red outline is the KEY visual signature — make it prominent and cinematic

═══ STORYTELLING BACKGROUND (FULL FRAME) ═══
${scene}
COLOR GRADING: ${tone}
ATMOSPHERIC DETAILS: ${elements}
- Background MUST tell a story — NEVER use plain, flat, or generic backgrounds
- Apply gaussian depth blur (f/1.4 bokeh) to background — subject stays sharp
- Background should have 3 layers: far background (very blurry), mid-ground (slightly blurry), foreground elements (particles/smoke)

═══ CINEMATIC COMPOSITION LAYOUT ═══
- LEFT 55%: Dark atmospheric zone with subtle scene elements, reserved for text overlay
  → Apply dark gradient overlay (black 60% opacity fading to transparent)
  → Some scene elements visible but not cluttered
- RIGHT 45%: Subject dominates with dramatic lighting
  → Subject's face is the focal point
  → Red rim light creates separation from background
- VIGNETTE: Strong dark vignette on all edges, especially corners (cinema-style framing)

═══ LIGHTING SYSTEM (5-POINT) ═══
1. KEY LIGHT: Strong warm light from upper-right, illuminating subject's face dramatically
2. RIM LIGHT: Intense RED/CRIMSON edge light from behind-left, creating the signature glow outline
3. FILL LIGHT: Subtle cool blue/teal ambient from left side (barely visible, prevents pure black)
4. BACKGROUND LIGHT: Dramatic volumetric god rays or spotlight in the story background
5. HAIR LIGHT: Subtle top-down light catching hair edges for separation

═══ COLOR GRADING (HOLLYWOOD-GRADE) ═══
- Teal shadows + orange/warm highlights (complementary split-toning)
- Left side of frame: cooler, more desaturated, moodier
- Right side (subject area): warmer, more vibrant, skin tones pop
- Crushed blacks (deep rich shadows, not grey)
- Controlled highlights with slight bloom on bright areas
- Overall: dark, moody, high-contrast cinematic look

═══ CTR-BOOSTING EFFECTS ═══
- Volumetric light rays (god rays) from behind or above subject
- Atmospheric particles: smoke wisps, dust motes, embers, or topic-relevant particles floating in light beams
- Subtle lens flare from the strongest light source
- Motion energy: slight directional blur on background elements suggesting dynamism
- Depth layers creating parallax-like 3D feel

═══ ABSOLUTE RULES ═══
- ZERO text, letters, words, numbers, typography, watermarks, or logos in the image
- Must rival MrBeast / Veritasium / Johnny Harris thumbnail quality
- NOT generic AI art — must feel like a real Hollywood movie still or Netflix documentary frame
- Photorealistic textures, 8K detail, cinematic depth of field
- Every pixel must serve the story — no empty or wasted space
- The thumbnail must make viewers STOP SCROLLING and CLICK`;
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
