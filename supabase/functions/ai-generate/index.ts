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
async function generateStrategy(prompt: string, LOVABLE_API_KEY: string) {
  const systemPrompt = `
You are a YouTube Thumbnail Strategist AI.

Your job is to analyze a topic and return a STRATEGY JSON.

RULES:
- Choose ONE category only
- Choose ONE strategy only
- Create ONE clear visual idea
- Idea must be simple and instantly understandable
- No abstract ideas

CATEGORIES:
history, economy, survival, politics, crime, tech, education, general

STRATEGIES:
contrast (A vs B)
transformation (before vs after)
scale (tiny vs massive)
direct_subject (face emotion focused)
mystery (hidden truth / unknown)

OUTPUT FORMAT (STRICT JSON):
{
  "category": "...",
  "strategy": "...",
  "idea": "...",
  "confidence": "high | medium | low"
}
`;

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.7
    }),
  });

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "{}";

  try {
    return JSON.parse(text);
  } catch {
    return {
      category: "general",
      strategy: "direct_subject",
      idea: prompt,
      confidence: "low"
    };
  }
}
function validateStrategy(strategy: any) {
  // Reject weak / bad ideas
  if (!strategy.idea || strategy.idea.length > 60) {
    return false;
  }

  // Reject abstract / AI garbage
  const badWords = ["future", "ai brain", "hologram", "cyber", "digital"];
  const ideaLower = strategy.idea.toLowerCase();

  for (const word of badWords) {
    if (ideaLower.includes(word)) return false;
  }

  return true;
}
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
  if (/motivat|success|inspire|dream|goal|winner|champion|hustle|grind|অনুপ্রেরণা|সাফল্য|স্বপ্ন/.test(t))
    return "motivation";
  if (
    /war|battle|histor|ancient|empire|kingdom|soldier|invasion|colonial|freedom|independence|মুক্তিযুদ্ধ|যুদ্ধ|ইতিহাস|সাম্রাজ্য/.test(
      t,
    )
  )
    return "history";
  if (
    /money|econom|poverty|rich|poor|gdp|inflation|failure|bankrupt|crisis|recession|billion|million|wealth|টাকা|দারিদ্র্য|অর্থনীতি|ব্যর্থ|কোটিপতি/.test(
      t,
    )
  )
    return "money";
  if (/tech|ai|robot|cyber|digital|future|software|code|computer|program|প্রযুক্তি|কৃত্রিম বুদ্ধিমত্তা/.test(t))
    return "technology";
  if (/educat|school|university|knowledge|learn|study|book|library|teacher|শিক্ষা|বিদ্যালয়|জ্ঞান|পড়াশোনা/.test(t))
    return "education";
  if (/politic|leader|election|govern|minister|parliament|vote|president|রাজনীতি|নেতা|নির্বাচন|সরকার/.test(t))
    return "politics";
  if (/space|planet|universe|galaxy|nasa|star|moon|mars|মহাকাশ|গ্রহ|নক্ষত্র/.test(t)) return "space";
  if (/sport|football|cricket|game|player|champion|tournament|খেলা|ক্রিকেট|ফুটবল/.test(t)) return "sports";
  if (/horror|ghost|scary|dark|mystery|haunted|ভয়|ভূত|রহস্য/.test(t)) return "horror";
  if (/health|disease|doctor|hospital|medicine|virus|cancer|diet|fitness|স্বাস্থ্য|রোগ|চিকিৎসা/.test(t))
    return "health";
  return "general";
}

function getCategoryScene(category: string): { scene: string; tone: string; elements: string; visualClues: string } {
  const scenes: Record<string, { scene: string; tone: string; elements: string; visualClues: string }> = {
    history: {
      scene:
        "SPLIT STORYTELLING: Left 50% shows ancient battlefield — burning village, soldiers charging through smoke, fallen fortress walls crumbling. Right 50% transitions sharply to modern peaceful city with glass buildings and monuments. A clear TIME DIVIDE line separates the two eras",
      tone: "Left: heavy sepia desaturation with orange fire glow and ash. Right: warm golden hour with clean modern tones. Hard light divide creates visual storytelling",
      elements:
        "Volumetric battle smoke, floating embers and ash, cracked stone walls, ancient swords/shields on ground, dust particles in dramatic god rays, distant flames reflecting on muddy/wet terrain",
      visualClues:
        "VISIBLE OBJECTS that tell the story instantly: broken sword stuck in ground, burning flag, crumbling brick wall, old vs new buildings side by side, timeline arrow visual, ancient map fragment",
    },
    money: {
      scene:
        "WEALTH STORY: Foreground has massive gold coin pile and bundled cash with green glow. A giant glowing stock chart with GREEN ARROWS pointing sharply UP dominates mid-ground. Left side shows cracked empty wallet on broken floor (poverty). Right side shows luxury penthouse view with gold everywhere (wealth)",
      tone: "Left: cold dark blue poverty mood. Right: rich warm golden luxury glow with green money accents. Sharp contrast divide",
      elements:
        "Floating dollar/taka bills, gold particles raining down, upward green arrows, rising bar charts, scattered coins catching spotlight, diamond sparkles, luxury car silhouette in distance",
      visualClues:
        "INSTANT STORY OBJECTS: giant upward arrow, money stack, growth chart line, broken piggy bank vs full vault, empty pocket vs overflowing wallet, '0 to 1M' visual journey",
    },
    crime: {
      scene:
        "NOIR CRIME SCENE: Dark rain-soaked urban alley, red and blue police sirens reflecting on wet pavement, yellow CRIME SCENE tape stretched across frame, shadowy suspect silhouette against brick wall, detective noir atmosphere with city fog",
      tone: "Near-black with harsh alternating red/blue police strobe contrast, noir desaturated grade, selective color only on warning elements",
      elements:
        "Rain streaks and puddle reflections, police light sweep patterns, crime tape, cigarette smoke trails, broken glass on ground, evidence markers, wet neon sign reflections on pavement",
      visualClues:
        "INSTANT STORY: handcuffs, blood splatter, police badge, mystery question mark shadow, wanted poster silhouette, jail bars shadow pattern on wall, broken window",
    },
    motivation: {
      scene:
        "TRANSFORMATION JOURNEY: Left shows person collapsed on knees in pouring rain on dark muddy ground (rock bottom). Right shows same figure standing victorious on mountain peak with epic golden sunrise behind them, arms raised in triumph. A glowing path of stepping stones connects the two",
      tone: "Left: dark stormy blue-grey despair. Right: explosive golden sunrise with warm orange god rays. The transition from dark to light IS the story",
      elements:
        "Mountain summit, sunrise god rays bursting through clouds, stepping stone path glowing, storm clouds dramatically parting, golden light breakthrough moment, trophy/medal gleam",
      visualClues:
        "INSTANT STORY: broken chain links, rising phoenix silhouette, 'before/after' visual split, ladder climbing up, dark valley to bright peak journey, lion/eagle power symbol",
    },
    technology: {
      scene:
        "AI COMMAND CENTER: Massive holographic brain visualization floating in center of dark room, multiple floating holographic screens showing code/neural networks, cyberpunk cityscape with neon lights visible through panoramic window, digital data streams flowing",
      tone: "Deep midnight blue-black with electric cyan and purple neon accents, dark environment lit only by holographic tech elements",
      elements:
        "Holographic floating UI panels, circuit board floor patterns, glowing blue data streams, neural network web visualization, floating code fragments, matrix data rain, lens flares from holographic sources",
      visualClues:
        "INSTANT STORY: robot hand reaching toward human hand, AI brain with glowing nodes, before/after of manual vs automated, old computer vs holographic display, binary code rain",
    },
    education: {
      scene:
        "KNOWLEDGE TRANSFORMATION: Left shows struggling student studying by dim candlelight surrounded by messy books (struggle). Right shows same person as graduate on brightly lit stage receiving diploma with audience applauding (success). Grand library transforms into modern university",
      tone: "Left: warm dim amber candlelight struggle. Right: brilliant white stage spotlight with golden celebration warmth",
      elements:
        "Towering bookshelves fading into modern campus, floating knowledge particles like fireflies, graduation cap tossed in air, trophy gleaming, scholarship scroll, light beams representing wisdom",
      visualClues:
        "INSTANT STORY: open book with light emanating, F grade paper vs A+ certificate, small desk vs grand university, candle vs stadium lights, diploma scroll, graduation cap in air",
    },
    politics: {
      scene:
        "POWER DRAMA: Grand parliament/government building with stormy dramatic sky and lightning, massive crowd of thousands with raised fists and flags, leader silhouette at podium against blinding spotlight, national flags waving in powerful wind, electric political tension atmosphere",
      tone: "High contrast: deep navy-black stormy sky with dramatic red-white spotlight columns, lightning flashes, power colors",
      elements:
        "Hundreds of waving national flags, dense crowd silhouettes with raised fists, microphone podium center-stage, dramatic storm clouds with lightning cracks, spotlight pillars cutting through rain, tension atmosphere",
      visualClues:
        "INSTANT STORY: ballot box, voting hand, broken vs fixed bridge (metaphor), chess pieces (strategy), podium microphone, crowd sea of people, scales of justice",
    },
    space: {
      scene:
        "COSMIC REVELATION: Astronaut in detailed spacesuit, helmet visor reflecting a massive colorful nebula and tiny distant Earth, standing on alien planet surface with strange rock formations, epic galaxy spiral visible in sky",
      tone: "Deep space blacks with vibrant nebula palette: electric purple clouds, cosmic blue wisps, supernova orange bursts, brilliant star whites",
      elements:
        "Dense star fields, swirling nebula gas clouds, Saturn-like planet rings, space station structure, helmet visor reflections, asteroid belt debris, cosmic dust particles, distant spiral galaxy",
      visualClues:
        "INSTANT STORY: Earth from space (tiny and fragile), rocket launch trail, astronaut footprint, alien landscape, black hole visualization, satellite dish",
    },
    sports: {
      scene:
        "VICTORY MOMENT: Packed stadium (100K+) with dramatic spotlight beams cutting through smoke and pyrotechnics, freeze-frame of championship winning moment, golden confetti explosion, trophy raised high, crowd going absolutely wild",
      tone: "High contrast stadium lighting: brilliant white spotlights against deep dark crowd mass, vivid green field, golden trophy gleam, pyrotechnic orange bursts",
      elements:
        "Multiple spotlight beams through smoke/haze, golden confetti explosion mid-air, crowd wave motion blur, energy trails behind motion, giant trophy gleaming, pyrotechnic spark showers, camera flash dots",
      visualClues:
        "INSTANT STORY: trophy/cup, medal around neck, scoreboard showing win, fans crying with joy, championship banner, raised fist victory, jersey number",
    },
    horror: {
      scene:
        "NIGHTMARE CORRIDOR: Abandoned asylum with peeling walls, single flickering blood-red emergency light creating strobing shadows, thick fog creeping along cracked floor, something horrifying barely visible in the far darkness, long distorted shadows reaching toward viewer",
      tone: "Near-total darkness with sickly yellow-green undertones, single harsh red strobe, maximum shadow contrast, unsettling cold color temperature",
      elements:
        "Flickering strobe light effect, thick floor-level fog, peeling paint and cracked plaster, extremely distorted elongated shadows, floating dust in red light, cobwebs, barely visible dark figure silhouette in far doorway",
      visualClues:
        "INSTANT STORY: creepy doll, bloody handprint on wall, broken mirror with reflection, old photograph with scratched out faces, mysterious door ajar with light, clock stopped at midnight",
    },
    health: {
      scene:
        "MEDICAL DRAMA: Hospital corridor with dramatic overhead surgical lamp creating halo, giant DNA double helix visualization glowing in center, microscopic virus/cell structures enlarged to dramatic cinematic scale, life-or-death surgical moment tension",
      tone: "Clinical blue-white sterile environment with warm human skin tones, selective urgent red for critical elements, emotional medical drama grade",
      elements:
        "Rotating DNA helix with glowing nodes, enlarged colorful cell structures, surgical lamp creating god-ray halo, heartbeat ECG line across frame, medical equipment silhouettes, dramatic lens flare from surgical light",
      visualClues:
        "INSTANT STORY: heartbeat line (flat to beating), pill vs natural remedy, virus particle enlarged, stethoscope, before/after health transformation, medical cross symbol glowing",
    },
    general: {
      scene:
        "EPIC CINEMATIC VISTA: Dramatic cloud formation with volumetric god rays breaking through storm onto a lone powerful figure, sweeping landscape with extreme foreground-background depth separation, movie poster composition",
      tone: "Hollywood teal-and-orange complementary color split, ultra high dynamic range, moody atmospheric blockbuster grade",
      elements:
        "Powerful volumetric god rays, atmospheric haze layers, dramatic cumulonimbus clouds, bokeh light orbs, anamorphic lens flare, layered depth with foreground silhouette elements, golden particle dust floating in light beams",
      visualClues:
        "INSTANT STORY: dramatic pointing gesture, question mark visual, before/after split, path leading to unknown, door of opportunity opening, spotlight on discovery",
    },
  };
  return scenes[category] || scenes.general;
}

function getEmotionForCategory(category: string): string {
  const emotions: Record<string, string> = {
    history:
      "serious, intense, battle-hardened expression with deep focused eyes staring into distance, jaw clenched with determination, weathered but strong",
    money:
      "SHOCKED and EXCITED expression, eyes extremely wide open, mouth slightly open in disbelief, eyebrows raised high, as if seeing incredible wealth for the first time",
    crime:
      "dark suspicious look, narrowed eyes with intensity, one eyebrow raised, shadowy mysterious expression, noir detective energy",
    motivation:
      "powerful confident smile, chest out, chin slightly raised, eyes burning with determination, winner's expression, unstoppable energy",
    technology:
      "awe-struck fascinated expression, eyes wide reflecting holographic blue light, slight wonder and curiosity, futuristic genius look",
    education:
      "thoughtful intellectual expression, slight knowing smile, wise contemplative gaze, confident scholar energy, glasses optional",
    politics:
      "stern authoritative commanding expression, sharp piercing eyes, slight frown of power, leader's decisive face",
    space:
      "pure awestruck wonder, mouth slightly open, eyes wide reflecting starlight and nebula colors, cosmic amazement",
    sports:
      "fierce battle cry expression, veins visible, intense competitive scream, sweat glistening, raw victory energy",
    horror:
      "genuine terror, eyes wide with primal fear, pale skin, mouth open in silent scream, looking at something horrifying off-camera",
    health:
      "concerned empathetic expression, focused doctor's gaze, slight worry mixed with determination to save, medical professional intensity",
    general:
      "dramatic intense expression with strong eye contact directly at camera, charismatic presence, slightly furrowed brow, commanding attention",
  };
  return emotions[category] || emotions.general;
}
function buildSubjectPrompt(strategy: any) {
  const { category, strategy: type, subjectType, hasImage } = strategy;

  // 💥 IMAGE PRIORITY (MOST IMPORTANT)
  if (hasImage) {
    return "USE PROVIDED IMAGE AS MAIN SUBJECT, NO AI FACE, clean cutout, high contrast lighting";
  }

  // 🎯 SUBJECT TYPE CONTROL
  if (subjectType === "object_only") {
    return "NO human, NO face, focus on objects only, cinematic scene";
  }

  let subject = "";

  if (subjectType === "ai_face") {
    subject = "ultra realistic cinematic human face";
  } else {
    subject = "cinematic subject relevant to topic";
  }

  // category logic
  if (category === "economy") subject += " stressed South Asian man";
  if (category === "tech") subject += " shocked young man";
  if (category === "history") subject += " serious historical leader";

  // strategy influence
  if (type === "contrast") subject += ", strong emotional contrast";

  return `MAIN SUBJECT: ${subject}`;
}

function buildBackgroundPrompt(strategy: any) {
  const { category, strategy: type } = strategy;

  let background = "cinematic environment";

  if (type === "contrast") {
    background = "split scene: left side dark poor environment, right side rich bright success environment";
  }

  if (type === "transformation") {
    background = "before vs after transformation scene, dramatic difference";
  }

  if (category === "history") {
    background = "ancient realistic battlefield or historical setting, no modern elements";
  }

  if (category === "tech") {
    background = "modern tech environment, screens, realistic lighting, no sci-fi neon";
  }

  if (category === "survival") {
    background = "harsh environment, snow/desert, extreme survival conditions";
  }

  return `BACKGROUND: ${background}, depth, cinematic atmosphere, storytelling`;
}

function detectStrategy(prompt: string) {
  if (prompt.includes("vs") || prompt.includes("battle")) return "contrast";
  if (prompt.includes("before") || prompt.includes("after")) return "transformation";
  if (prompt.includes("story")) return "cinematic";
  if (prompt.includes("focus")) return "direct_subject";
  return "cinematic";
}

function detectSubjectType(prompt: string) {
  if (prompt.includes("no face") || prompt.includes("object")) {
    return "object_only";
  }
  if (prompt.includes("person") || prompt.includes("face")) {
    return "ai_face";
  }
  return "auto";
}
function detectLayout(strategy: any) {
  const { strategy: type, subjectType, hasImage } = strategy;

  // 💥 IMAGE MODE
  if (hasImage) return "clean_subject_left";

  if (subjectType === "object_only") return "center_object";

  if (type === "contrast") return "split_screen";
  if (type === "transformation") return "before_after";
  if (type === "direct_subject") return "zoom_face";

  return "cinematic";
}

function buildThumbnailPrompt(prompt: string, style: string, colorScheme: string): string {
  const category = detectTopicCategory(prompt);
const strategyData = {
  category,
  strategy: detectStrategy(prompt), // 🔥 NEW
  subjectType: detectSubjectType(prompt),
  hasImage: typeof style === "string" && style.includes("image"),
};
  const { scene, tone, elements, visualClues } = getCategoryScene(category);
  const emotion = getEmotionForCategory(category);

  const subject = buildSubjectPrompt(strategyData);
const background = buildBackgroundPrompt(strategyData);
  const layout = detectLayout(strategyData);

return `
${subject}

${background}

COMPOSITION:
- Layout: ${layout}

- If split_screen → left dark / right bright contrast
- If before_after → clear transformation divide
- If zoom_face → face fills 70% frame
- If clean_subject_left → subject left, empty space right for text
- If center_object → object center, no human

SUBJECT RULES:
- If hasImage → MUST use uploaded image, NO AI FACE
- If object_only → NO human at all

VISUAL PRIORITY:
- Subject must be biggest element
- Background must support story, not dominate
- Strong contrast lighting

Generate a MASTER-LEVEL CINEMATIC YOUTUBE THUMBNAIL for the topic: "${prompt}".

═══ 1-SECOND STORY RULE (MOST IMPORTANT) ═══
The viewer must understand the ENTIRE topic within 1 SECOND of seeing this thumbnail.
Use VISUAL CLUES that instantly communicate the subject matter:
${visualClues}
- These objects/symbols must be clearly visible in the background composition
- They act as instant visual shorthand — no text needed to understand the story

— SUBJECT SYSTEM —

Follow SUBJECT RULES above strictly.

- If hasImage → use uploaded image only (no AI face)
- If object_only → no human, no face
- Otherwise → generate cinematic subject based on topic

Subject must match topic perfectly and be visually dominant.

═══ RIM LIGHT (TOPIC-ADAPTIVE) ═══
- Strong colored rim light outlining subject's head, shoulders, body edge
- Color should match the topic mood (red for drama, blue for tech, gold for motivation)
- Bright edge light separating subject from background
- Warm backlight halo behind subject's head

═══ STORYTELLING BACKGROUND WITH CONTRAST ═══
${scene}
COLOR GRADING: ${tone}
ATMOSPHERIC DETAILS: ${elements}
- Background MUST directly represent the topic — NEVER generic
- 3 depth layers: far background (very blurry), mid-ground (slightly blurry), foreground particles
- IMPORTANT: Match brightness to topic. Education/motivation = brighter. Horror/crime = darker.

═══ CINEMATIC COMPOSITION ═══
- LEFT 55%: Atmospheric story zone with visible contextual elements
- RIGHT 45%: Subject dominates with dramatic lighting, face is focal point
- VIGNETTE: Moderate vignette on edges (adapt intensity to topic mood)

═══ LIGHTING (5-POINT) ═══
1. KEY: Strong warm light from upper-right on subject's face
2. RIM: Colored edge light from behind-left (topic-adaptive color)
3. FILL: Subtle ambient from left
4. BG LIGHT: Volumetric god rays in story background
5. HAIR: Top-down edge light for separation

═══ COLOR GRADING (TOPIC-ADAPTIVE) ═══
- Match color grade to topic mood:
  * Tech/AI → cyan shadows + blue highlights
  * Motivation/Money → warm gold + orange tones
  * Horror/Crime → desaturated + red accents
  * Education → clean, bright, slightly warm
  * Default → balanced cinematic with good contrast
- Avoid making everything uniformly dark

═══ CTR-BOOST EFFECTS ═══
- Volumetric god rays from behind/above subject
- Atmospheric particles (smoke, dust, embers per topic)
- Lens flare from strongest light source
- Depth layers creating parallax 3D feel

═══ ABSOLUTE RULES ═══
- ZERO text, letters, words, numbers, typography, watermarks, logos
- Must rival MrBeast / Veritasium / Johnny Harris quality
- Real Hollywood movie still feel, NOT generic AI art
- 8K photorealistic detail, cinematic depth of field
- Every pixel serves the story — viewer STOPS SCROLLING and CLICKS
`
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
  script:
    "You are PromptNova AI Script Generator. Write a professional video script with clear sections: [HOOK], [INTRO], [BODY], [CTA], [OUTRO]. Use engaging language appropriate for the requested tone.",
  prompt:
    "You are PromptNova AI Prompt Generator. Create a detailed, highly effective AI prompt based on the user's idea. The prompt should be clear, specific, and designed to get the best possible output from an AI model.",
  image:
    "You are an AI image generator. Generate the image the user describes. Do not describe images in text — actually generate visual images.",
  thumbnail: `You are an elite, metric-obsessed YouTube Thumbnail Art Director. The user will provide a Topic and a Selected Style. Your absolute priority is maximizing Click-Through Rate (CTR).

STRICT TEXT RULES (CRITICAL):
- bangla_hook: MUST be strictly 1 to 3 words maximum. NO EXCEPTIONS.
- english_subtitle: 2 to 4 words maximum.

STYLE & RENDERING DIRECTIVES:

Documentary:
- 35mm lens, gritty, extreme shadows, volumetric fog, cinematic contrast, 8k, photorealistic
- Emotion: Serious

Viral Clickbait:
- hyper-saturated, eerie glow, vignette, macro, ominous lighting, Unreal Engine 5
- Emotion: Shocked

Hyper-Viral:
- ultra-bright, HDR, clean, vibrant colors, wide-angle, glossy
- Emotion: Excited

INTELLIGENCE RULES:
- Match subject based on topic
- Background must be empty (no people, no text)
- Focus on storytelling contrast
VISUAL VARIATION ENGINE:

Every output MUST be visually unique.

Randomize:
- Camera angle (close-up, wide shot, top view, side profile)
- Scene type (battlefield, cityscape, stadium, dark room, abstract, futuristic)
- Lighting (neon glow, sunset, foggy, fire-lit, cold blue, high contrast)
- Composition (center focus, split screen, off-center, zoomed, depth focus)

Never repeat the same composition or layout.
Avoid generating similar-looking backgrounds across requests.
STYLE DIVERSITY ENGINE:

Do NOT use a fixed layout.

Randomly choose layout:
- Full background cinematic scene
- Split screen (ONLY if needed)
- Subject zoom + blurred background
- Minimal clean background
- Chaos collage (for viral topics)

Avoid repeating:
- same split layout
- same subject position
- same composition

---

COLOR & MOOD ENGINE:

Color grading MUST match topic emotion:

- War / history → desaturated, dusty, dark tones
- Mystery → dark blue, green, foggy, low light
- Tech / AI → neon, cyan, futuristic glow
- Economy / serious → muted, grey, cold tones
- Viral / MrBeast → bright, high contrast, colorful

Never reuse same color grading repeatedly.

---

CONTEXT AWARE ENGINE:

Background MUST match topic strictly.

- No random futuristic elements unless topic is tech/AI
- No brain / hologram / sci-fi unless relevant
- Historical topic → historical environment ONLY
- Sports → stadium / action ONLY
- Politics → realistic environment

If mismatch → REJECT and regenerate internally
OUTPUT:
Return ONLY JSON:

{
  "text_layers": {
    "bangla_hook": "max 3 words",
    "english_subtitle": "max 4 words"
  },
  "visual_intelligence": {
    "target_demographic": "subject type",
    "emotion": "one word",
    "environmental_lighting_color": "#hex",
    "css_blend_preset": "darken | lighten | high-contrast | neon-glow"
  },
  "generation_prompts": {
    "background_plate": "cinematic background prompt, no people, no text"
  }
}`,
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

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
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

      const totalUsedToday = ((usageRows as any[]) || []).reduce((sum: number, r: any) => sum + (r.count || 0), 0);
      const effectiveLimit = dailyLimit + bonusCredits;

      if (totalUsedToday >= effectiveLimit) {
        return new Response(
          JSON.stringify({
            error: "Daily credit limit reached. Upgrade to Pro for more credits!",
            credits_used: totalUsedToday,
            credits_limit: effectiveLimit,
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    // ── Build request ──
    const { type, messages, prompt, options } = await req.json();
let strategyData = await generateStrategy(prompt, LOVABLE_API_KEY);

if (!validateStrategy(strategyData)) {
  console.log("❌ Bad strategy, regenerating...");

  strategyData = await generateStrategy(
    prompt + " (simple, real-world, no futuristic elements)", LOVABLE_API_KEY
  );
}

console.log("FINAL STRATEGY:", strategyData);
    const toolType = type || "chat";
    const systemPrompt = systemPrompts[toolType] || systemPrompts.chat;

    const chatMessages: any[] = [{ role: "system", content: systemPrompt }];
    const isImageGen = toolType === "image" || toolType === "thumbnail-image" || toolType === "logo" || toolType === "remove-bg";
    const isHeadlineSuggest = toolType === "thumbnail-headlines";
    const isThumbnailStructure = toolType === "thumbnail";

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
      } else if (toolType === "thumbnail" || toolType === "thumbnail-image") {
        userPrompt = buildThumbnailPrompt(prompt, strategyData);
      } else if (toolType === "remove-bg") {
        // For remove-bg, the prompt is unused; the image is sent as multimodal content
        userPrompt = "Remove the background from this image completely. Keep ONLY the main subject (person, object, or character). Output the subject on a fully transparent/clean background. Make the edges smooth and clean — no rough cuts. Return ONLY the processed image.";
        // The image data URL will be in options.image
        if (options?.image) {
          chatMessages.length = 0; // Clear existing messages
          chatMessages.push({
            role: "user",
            content: [
              { type: "text", text: userPrompt },
              { type: "image_url", image_url: { url: options.image } },
            ],
          });
        }
      } else if (toolType === "logo" && options) {
        userPrompt = buildLogoPrompt(prompt, options.industry || "Technology", options.style || "Minimal");
      } else if (isHeadlineSuggest) {
        userPrompt = `Generate 3 viral clickable thumbnail headlines for this topic: "${prompt}". Return ONLY a JSON array of 3 short headline strings.`;
      }
      if (toolType !== "remove-bg" || !options?.image) {
        chatMessages.push({ role: "user", content: userPrompt });
      }
    }

    const stream = toolType === "chat";
    const requestBody: any = {
      model: isImageGen ? IMAGE_MODEL : MODEL,
      messages: chatMessages,
      stream,
      max_tokens: isHeadlineSuggest ? 256 : toolType === "blog" ? 4096 : 2048,
      temperature: isHeadlineSuggest ? 0.9 : toolType === "chat" ? 0.7 : 0.8,
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
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (gatewayResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
      await supabase.from("usage_tracking").insert({ user_id: userId, tool_type: toolType, used_at: today, count: 1 });
    }

    // ── Return response ──
    if (stream) {
      return new Response(gatewayResponse.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    } else if (isImageGen) {
      const data = await gatewayResponse.json();
      console.log("Image gen response keys:", Object.keys(data));
      const message = data.choices?.[0]?.message;
      const images = message?.images?.map((img: any) => img?.image_url?.url) || [];
      const text = message?.content || "";
      if (images.length === 0) {
        console.warn("EMPTY IMAGE RESPONSE. Full message:", JSON.stringify(message).slice(0, 500));
      }
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
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
