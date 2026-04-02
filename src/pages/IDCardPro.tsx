import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, Upload, Download, Sparkles, Loader2, RotateCcw, Lock, Crown,
  User, Building2, Hash, Calendar, QrCode, PenLine, Image as ImageIcon,
  Palette, LayoutTemplate, Smartphone, Monitor, FlipHorizontal, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { useCredits } from "@/hooks/use-credits";
import { incrementUsage } from "@/lib/usage";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

/* ───── Types ───── */
type CardType = "student" | "employee" | "corporate" | "event" | "visitor" | "membership" | "press" | "freelancer";
type TemplateName = "glass-corporate" | "luxury-black-gold" | "minimal-white" | "neon-tech" | "university-modern" | "government-formal" | "event-vip" | "gradient-holographic";
type Orientation = "portrait" | "landscape";
type ExportFormat = "png" | "pdf" | "hd" | "transparent";
type CardSide = "front" | "back";

interface CardData {
  fullName: string;
  role: string;
  organization: string;
  idNumber: string;
  expiryDate: string;
  phone: string;
  email: string;
  department: string;
  session: string;
  bloodGroup: string;
  visitReason: string;
  host: string;
  visitTime: string;
  visitDate: string;
  accessLevel: string;
  seatZone: string;
  eventDate: string;
  designation: string;
  authority: string;
}

/* ───── Dynamic fields by card type ───── */
type FieldConfig = { key: keyof CardData; label: string; placeholder: string; icon: typeof User };

const CARD_FIELDS: Record<CardType, FieldConfig[]> = {
  student: [
    { key: "fullName", label: "Full Name", placeholder: "John Doe", icon: User },
    { key: "idNumber", label: "Student ID", placeholder: "STU-2025-001", icon: Hash },
    { key: "department", label: "Department", placeholder: "Computer Science", icon: Building2 },
    { key: "session", label: "Session", placeholder: "2024-2025", icon: Calendar },
    { key: "bloodGroup", label: "Blood Group", placeholder: "O+", icon: PenLine },
    { key: "expiryDate", label: "Expiry Date", placeholder: "2027-12-31", icon: Calendar },
  ],
  employee: [
    { key: "fullName", label: "Full Name", placeholder: "Jane Smith", icon: User },
    { key: "idNumber", label: "Employee ID", placeholder: "EMP-001234", icon: Hash },
    { key: "role", label: "Role / Position", placeholder: "Software Engineer", icon: PenLine },
    { key: "department", label: "Department", placeholder: "Engineering", icon: Building2 },
    { key: "organization", label: "Company", placeholder: "Acme Corp", icon: Building2 },
    { key: "expiryDate", label: "Validity", placeholder: "2027-12-31", icon: Calendar },
  ],
  corporate: [
    { key: "fullName", label: "Full Name", placeholder: "John Doe", icon: User },
    { key: "role", label: "Title", placeholder: "VP Engineering", icon: PenLine },
    { key: "organization", label: "Company", placeholder: "TechCorp", icon: Building2 },
    { key: "idNumber", label: "Badge ID", placeholder: "CORP-5678", icon: Hash },
    { key: "department", label: "Division", placeholder: "Technology", icon: Building2 },
    { key: "email", label: "Email", placeholder: "john@techcorp.com", icon: QrCode },
  ],
  event: [
    { key: "fullName", label: "Full Name", placeholder: "VIP Guest", icon: User },
    { key: "accessLevel", label: "Access Level", placeholder: "VIP / Backstage", icon: PenLine },
    { key: "seatZone", label: "Seat / Zone", placeholder: "Zone A - Row 1", icon: Hash },
    { key: "eventDate", label: "Event Date", placeholder: "2025-06-15", icon: Calendar },
    { key: "organization", label: "Event Name", placeholder: "Tech Summit 2025", icon: Building2 },
    { key: "idNumber", label: "Pass ID", placeholder: "EVT-9012", icon: Hash },
  ],
  visitor: [
    { key: "fullName", label: "Visitor Name", placeholder: "Alex Brown", icon: User },
    { key: "visitReason", label: "Visit Reason", placeholder: "Meeting", icon: PenLine },
    { key: "host", label: "Host Person", placeholder: "Dr. Sarah Lee", icon: User },
    { key: "visitTime", label: "Time", placeholder: "10:00 AM", icon: Calendar },
    { key: "visitDate", label: "Date", placeholder: "2025-04-02", icon: Calendar },
    { key: "idNumber", label: "Pass No.", placeholder: "VIS-3456", icon: Hash },
  ],
  membership: [
    { key: "fullName", label: "Member Name", placeholder: "John Doe", icon: User },
    { key: "idNumber", label: "Member ID", placeholder: "MEM-7890", icon: Hash },
    { key: "role", label: "Tier", placeholder: "Gold / Platinum", icon: PenLine },
    { key: "organization", label: "Club / Org", placeholder: "Sports Club", icon: Building2 },
    { key: "expiryDate", label: "Valid Until", placeholder: "2026-12-31", icon: Calendar },
    { key: "email", label: "Email", placeholder: "john@email.com", icon: QrCode },
  ],
  press: [
    { key: "fullName", label: "Full Name", placeholder: "Reporter Name", icon: User },
    { key: "role", label: "Publication", placeholder: "Daily News", icon: PenLine },
    { key: "organization", label: "Media House", placeholder: "News Corp", icon: Building2 },
    { key: "idNumber", label: "Press ID", placeholder: "PRESS-1234", icon: Hash },
    { key: "expiryDate", label: "Valid Until", placeholder: "2026-06-30", icon: Calendar },
    { key: "phone", label: "Phone", placeholder: "+1-555-0123", icon: QrCode },
  ],
  freelancer: [
    { key: "fullName", label: "Full Name", placeholder: "Creator Name", icon: User },
    { key: "role", label: "Specialization", placeholder: "UI/UX Designer", icon: PenLine },
    { key: "organization", label: "Brand / Studio", placeholder: "Design Studio", icon: Building2 },
    { key: "idNumber", label: "ID Number", placeholder: "FRL-5678", icon: Hash },
    { key: "email", label: "Email / Portfolio", placeholder: "creator@email.com", icon: QrCode },
    { key: "expiryDate", label: "Valid Until", placeholder: "2026-12-31", icon: Calendar },
  ],
};

/* ───── Template configs ───── */
const TEMPLATES: { value: TemplateName; label: string; pro: boolean; colors: { bg: string; text: string; accent: string; border: string } }[] = [
  { value: "glass-corporate", label: "Glass Corporate", pro: false, colors: { bg: "from-slate-900/90 to-slate-800/80", text: "text-white", accent: "bg-blue-500", border: "border-white/10" } },
  { value: "luxury-black-gold", label: "Luxury Black Gold", pro: true, colors: { bg: "from-gray-950 to-gray-900", text: "text-amber-100", accent: "bg-amber-500", border: "border-amber-500/30" } },
  { value: "minimal-white", label: "Minimal White Pro", pro: false, colors: { bg: "from-white to-gray-50", text: "text-gray-900", accent: "bg-gray-900", border: "border-gray-200" } },
  { value: "neon-tech", label: "Neon Tech", pro: true, colors: { bg: "from-gray-950 to-purple-950/80", text: "text-cyan-100", accent: "bg-cyan-500", border: "border-cyan-500/30" } },
  { value: "university-modern", label: "University Modern", pro: false, colors: { bg: "from-indigo-900 to-indigo-800", text: "text-white", accent: "bg-indigo-400", border: "border-indigo-400/20" } },
  { value: "government-formal", label: "Government Formal", pro: true, colors: { bg: "from-emerald-950 to-emerald-900", text: "text-emerald-50", accent: "bg-emerald-500", border: "border-emerald-500/20" } },
  { value: "event-vip", label: "Event VIP", pro: true, colors: { bg: "from-rose-950 to-pink-900", text: "text-rose-50", accent: "bg-rose-500", border: "border-rose-400/20" } },
  { value: "gradient-holographic", label: "Gradient Holographic", pro: true, colors: { bg: "from-violet-900 via-fuchsia-900 to-cyan-900", text: "text-white", accent: "bg-fuchsia-500", border: "border-fuchsia-400/20" } },
];

const CARD_TYPES: { value: CardType; label: string; icon: string }[] = [
  { value: "student", label: "Student ID", icon: "🎓" },
  { value: "employee", label: "Employee ID", icon: "💼" },
  { value: "corporate", label: "Corporate Badge", icon: "🏢" },
  { value: "event", label: "Event Pass", icon: "🎫" },
  { value: "visitor", label: "Visitor Card", icon: "🪪" },
  { value: "membership", label: "Membership Card", icon: "⭐" },
  { value: "press", label: "Press Card", icon: "📰" },
  { value: "freelancer", label: "Creator / Freelancer", icon: "🎨" },
];

const EXPORT_OPTIONS: { value: ExportFormat; label: string; pro: boolean }[] = [
  { value: "png", label: "PNG Standard", pro: false },
  { value: "hd", label: "HD Export", pro: true },
  { value: "pdf", label: "PDF Print", pro: true },
  { value: "transparent", label: "Transparent Mockup", pro: true },
];

const FREE_DAILY_LIMIT = 2;

/* ───── Card Preview Component ───── */
function CardPreview({
  data, template, cardType, orientation, photo, logo, side, showQR, plan
}: {
  data: CardData; template: TemplateName; cardType: CardType; orientation: Orientation;
  photo: string | null; logo: string | null; side: CardSide; showQR: boolean; plan: string;
}) {
  const t = TEMPLATES.find(tp => tp.value === template)!;
  const ct = CARD_TYPES.find(c => c.value === cardType)!;
  const isLandscape = orientation === "landscape";
  const cardW = isLandscape ? "w-[420px]" : "w-[280px]";
  const cardH = isLandscape ? "h-[265px]" : "h-[420px]";

  if (side === "back") {
    return (
      <div className={`${cardW} ${cardH} rounded-2xl bg-gradient-to-br ${t.colors.bg} border ${t.colors.border} relative overflow-hidden flex flex-col items-center justify-center p-6 backdrop-blur-xl`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.04),transparent_60%)]" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          {showQR && data.idNumber && (
            <div className="bg-white p-2 rounded-lg">
              <QRCodeSVG value={`ID:${data.idNumber}|${data.fullName}|${data.organization}`} size={80} />
            </div>
          )}
          <div className={`w-48 h-8 rounded bg-white/10 flex items-center justify-center`}>
            <div className="flex gap-[2px]">
              {(data.idNumber || "000000000").split("").map((c, i) => (
                <div key={i} className="w-[2px] bg-white/70" style={{ height: `${12 + (parseInt(c) || 3) * 2}px` }} />
              ))}
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={`b${i}`} className="w-[1px] bg-white/50" style={{ height: `${8 + Math.random() * 12}px` }} />
              ))}
            </div>
          </div>
          <p className={`text-[10px] ${t.colors.text} opacity-50`}>This card is property of {data.organization || "Organization"}</p>
        </div>
        {plan === "free" && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <span className="text-white/20 text-2xl font-black rotate-[-30deg] tracking-[8px] select-none">SAMPLE</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${cardW} ${cardH} rounded-2xl bg-gradient-to-br ${t.colors.bg} border ${t.colors.border} relative overflow-hidden backdrop-blur-xl shadow-2xl`}>
      {/* Gloss overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_15%,rgba(255,255,255,0.08),transparent_50%)] pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03)_0%,transparent_50%)] pointer-events-none z-10" />

      <div className={`relative z-[5] h-full flex ${isLandscape ? "flex-row" : "flex-col"} p-4 gap-3`}>
        {/* Header strip */}
        <div className={`${isLandscape ? "hidden" : "flex"} items-center gap-2`}>
          {logo ? (
            <img src={logo} alt="Logo" className="w-8 h-8 rounded-lg object-contain bg-white/10 p-0.5" />
          ) : (
            <div className={`w-8 h-8 rounded-lg ${t.colors.accent} flex items-center justify-center`}>
              <Building2 className="w-4 h-4 text-white" />
            </div>
          )}
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${t.colors.text} opacity-70`}>{data.organization || "Organization"}</p>
            <p className={`text-[8px] ${t.colors.text} opacity-40`}>{ct.icon} {ct.label}</p>
          </div>
        </div>

        {/* Photo */}
        <div className={`flex ${isLandscape ? "flex-col items-center justify-center pr-3 border-r border-white/5" : "justify-center"}`}>
          <div className={`${isLandscape ? "w-24 h-28" : "w-24 h-28 mx-auto"} rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center`}>
            {photo ? (
              <img src={photo} alt="Photo" className="w-full h-full object-cover" />
            ) : (
              <User className={`w-10 h-10 ${t.colors.text} opacity-20`} />
            )}
          </div>
          {isLandscape && logo && (
            <img src={logo} alt="Logo" className="w-8 h-8 rounded-lg mt-2 object-contain bg-white/10 p-0.5" />
          )}
        </div>

        {/* Info */}
        <div className={`flex-1 flex flex-col ${isLandscape ? "justify-center" : ""} gap-1.5`}>
          <h3 className={`text-lg font-bold ${t.colors.text} leading-tight`}>{data.fullName || "Full Name"}</h3>
          <p className={`text-xs ${t.colors.text} opacity-70`}>{data.role || "Role / Position"}</p>

          <div className="mt-auto space-y-1">
            {data.idNumber && (
              <div className="flex items-center gap-1.5">
                <Hash className={`w-3 h-3 ${t.colors.text} opacity-40`} />
                <span className={`text-[10px] ${t.colors.text} opacity-60 font-mono`}>{data.idNumber}</span>
              </div>
            )}
            {data.expiryDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className={`w-3 h-3 ${t.colors.text} opacity-40`} />
                <span className={`text-[10px] ${t.colors.text} opacity-60`}>Exp: {data.expiryDate}</span>
              </div>
            )}
          </div>

          {showQR && !isLandscape && data.idNumber && (
            <div className="mt-1 self-end">
              <div className="bg-white p-1 rounded">
                <QRCodeSVG value={`ID:${data.idNumber}`} size={36} />
              </div>
            </div>
          )}
          {showQR && isLandscape && data.idNumber && (
            <div className="mt-1">
              <div className="bg-white p-1 rounded inline-block">
                <QRCodeSVG value={`ID:${data.idNumber}`} size={36} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Watermark for free */}
      {plan === "free" && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <span className="text-white/15 text-3xl font-black rotate-[-30deg] tracking-[8px] select-none">SAMPLE</span>
        </div>
      )}
    </div>
  );
}

/* ───── Main Page ───── */
const IDCardPro = () => {
  const { user } = useAuth();
  const { remaining, plan, isAdmin } = useCredits();

  const [cardType, setCardType] = useState<CardType>("employee");
  const [template, setTemplate] = useState<TemplateName>("glass-corporate");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [side, setSide] = useState<CardSide>("front");
  const [showQR, setShowQR] = useState(true);
  const [aiMode, setAiMode] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [data, setData] = useState<CardData>({
    fullName: "", role: "", organization: "", idNumber: "", expiryDate: "", phone: "", email: "",
    department: "", session: "", bloodGroup: "", visitReason: "", host: "", visitTime: "", visitDate: "",
    accessLevel: "", seatZone: "", eventDate: "", designation: "", authority: ""
  });

  const photoRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const isFree = plan === "free" && !isAdmin;

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>, setter: (v: string | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Max 5MB"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setter(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const updateField = useCallback((field: keyof CardData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAIAutoDesign = useCallback(async () => {
    if (!user) { toast.error("Please log in"); return; }
    if (isFree && remaining <= 0) { toast.error("Daily limit reached"); return; }
    setGenerating(true);
    toast.loading("✨ AI is choosing the best design...");

    // Simulate AI auto-design logic
    await new Promise(r => setTimeout(r, 1500));

    const autoTemplates: TemplateName[] = ["glass-corporate", "luxury-black-gold", "neon-tech", "gradient-holographic"];
    setTemplate(autoTemplates[Math.floor(Math.random() * autoTemplates.length)]);

    if (!data.idNumber) updateField("idNumber", `ID-${Date.now().toString().slice(-6)}`);
    if (!data.expiryDate) {
      const exp = new Date();
      exp.setFullYear(exp.getFullYear() + 1);
      updateField("expiryDate", exp.toISOString().split("T")[0]);
    }

    await incrementUsage(user.id, "idcard", isAdmin);
    setGenerating(false);
    toast.dismiss();
    toast.success("✨ AI design applied!");
  }, [user, isFree, remaining, data.idNumber, data.expiryDate, isAdmin, updateField]);

  const handleExport = useCallback(async (format: ExportFormat) => {
    if (!user) { toast.error("Please log in"); return; }
    if (isFree && (format === "hd" || format === "pdf" || format === "transparent")) {
      toast.error("Upgrade to Pro for HD/PDF exports");
      return;
    }

    if (!data.fullName) { toast.error("Please enter a name"); return; }

    setGenerating(true);
    toast.loading("Preparing export...");

    try {
      const html2canvas = (await import("html2canvas")).default;
      if (!cardRef.current) throw new Error("Card not found");

      const canvas = await html2canvas(cardRef.current, {
        scale: format === "hd" ? 4 : 2,
        useCORS: true,
        backgroundColor: format === "transparent" ? null : undefined,
      });

      // Add watermark for free users
      if (isFree) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.save();
          ctx.globalAlpha = 0.15;
          ctx.font = "bold 36px sans-serif";
          ctx.fillStyle = "#ffffff";
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(-Math.PI / 6);
          ctx.textAlign = "center";
          ctx.fillText("PROMPTNOVA", 0, 0);
          ctx.restore();
        }
      }

      const link = document.createElement("a");
      link.download = `id-card-${data.fullName.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      await incrementUsage(user.id, "idcard", isAdmin);
      toast.dismiss();
      toast.success("Card exported!");
    } catch (err) {
      toast.dismiss();
      toast.error("Export failed");
    }
    setGenerating(false);
  }, [user, isFree, data.fullName, isAdmin]);

  const selectedTemplate = TEMPLATES.find(t => t.value === template)!;

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">ID Card Pro</h1>
            <p className="text-sm text-muted-foreground">Premium ID card & badge generator</p>
          </div>
          {isFree && (
            <Link to="/dashboard/upgrade" className="ml-auto flex items-center gap-1.5 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
              <Crown className="w-3.5 h-3.5" /> Upgrade
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Left: Controls */}
          <div className="space-y-5">
            {/* AI Mode Toggle */}
            <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-sm font-semibold text-foreground">✨ AI Auto Design</p>
                  <p className="text-xs text-muted-foreground">Let AI choose the perfect layout</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={aiMode} onCheckedChange={setAiMode} />
                {aiMode && (
                  <Button size="sm" onClick={handleAIAutoDesign} disabled={generating} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
                    {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : "Apply"}
                  </Button>
                )}
              </div>
            </div>

            {/* Card Type + Template */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Card Type</Label>
                <Select value={cardType} onValueChange={(v) => setCardType(v as CardType)}>
                  <SelectTrigger className="glass-card border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CARD_TYPES.map(ct => (
                      <SelectItem key={ct.value} value={ct.value}>{ct.icon} {ct.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Template</Label>
                <Select value={template} onValueChange={(v) => setTemplate(v as TemplateName)}>
                  <SelectTrigger className="glass-card border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TEMPLATES.map(t => (
                      <SelectItem key={t.value} value={t.value} disabled={t.pro && isFree}>
                        {t.label} {t.pro && isFree && "🔒"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Photos */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Photo</Label>
                <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setPhoto)} />
                <button
                  onClick={() => photoRef.current?.click()}
                  className="w-full glass-card rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors border border-dashed border-border"
                >
                  {photo ? (
                    <img src={photo} alt="Photo" className="w-16 h-16 rounded-xl object-cover" />
                  ) : (
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  )}
                  <span className="text-xs text-muted-foreground">{photo ? "Change" : "Upload"}</span>
                </button>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Logo</Label>
                <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setLogo)} />
                <button
                  onClick={() => logoRef.current?.click()}
                  className="w-full glass-card rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors border border-dashed border-border"
                >
                  {logo ? (
                    <img src={logo} alt="Logo" className="w-16 h-16 rounded-xl object-contain" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  )}
                  <span className="text-xs text-muted-foreground">{logo ? "Change" : "Upload"}</span>
                </button>
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {([
                { key: "fullName" as const, label: "Full Name", placeholder: "John Doe", icon: User },
                { key: "role" as const, label: "Role / Position", placeholder: "Software Engineer", icon: PenLine },
                { key: "organization" as const, label: "Company / School", placeholder: "Acme Corp", icon: Building2 },
                { key: "idNumber" as const, label: "ID Number", placeholder: "EMP-001234", icon: Hash },
                { key: "expiryDate" as const, label: "Expiry Date", placeholder: "2027-12-31", icon: Calendar },
                { key: "email" as const, label: "Email", placeholder: "john@example.com", icon: QrCode },
              ]).map(f => (
                <div key={f.key} className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <f.icon className="w-3 h-3" /> {f.label}
                  </Label>
                  <Input
                    value={data[f.key]}
                    onChange={(e) => updateField(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="glass-card border-border text-sm h-9"
                  />
                </div>
              ))}
            </div>

            {/* Options row */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">Orientation</Label>
                <Select value={orientation} onValueChange={(v) => setOrientation(v as Orientation)}>
                  <SelectTrigger className="glass-card border-border w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">📱 Portrait</SelectItem>
                    <SelectItem value="landscape">🖥️ Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">QR Code</Label>
                <Switch checked={showQR} onCheckedChange={setShowQR} />
              </div>
            </div>

            {/* Export */}
            <div className="glass-card rounded-2xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Download className="w-4 h-4 text-primary" /> Export
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EXPORT_OPTIONS.map(opt => (
                  <Button
                    key={opt.value}
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport(opt.value)}
                    disabled={generating || (opt.pro && isFree)}
                    className="text-xs relative"
                  >
                    {opt.pro && isFree && <Lock className="w-3 h-3 mr-1 text-muted-foreground" />}
                    {opt.label}
                  </Button>
                ))}
              </div>
              {isFree && <p className="text-[10px] text-muted-foreground/50">Free: watermarked PNG only. Upgrade for HD/PDF.</p>}
            </div>
          </div>

          {/* Right: Preview */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-5 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4 w-full">
                <Tabs value={side} onValueChange={(v) => setSide(v as CardSide)} className="w-full">
                  <TabsList className="w-full grid grid-cols-2 h-8">
                    <TabsTrigger value="front" className="text-xs">Front</TabsTrigger>
                    <TabsTrigger value="back" className="text-xs">Back</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div ref={cardRef} className="flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${side}-${template}-${orientation}`}
                    initial={{ opacity: 0, rotateY: 90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: -90 }}
                    transition={{ duration: 0.4 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <CardPreview
                      data={data}
                      template={template}
                      cardType={cardType}
                      orientation={orientation}
                      photo={photo}
                      logo={logo}
                      side={side}
                      showQR={showQR}
                      plan={plan}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <p className="text-[10px] text-muted-foreground/40 mt-3">
                {orientation === "portrait" ? "85.6 × 128mm" : "128 × 85.6mm"} • ISO/IEC 7810 ID-1
              </p>
            </div>

            {/* Template gallery mini */}
            <div className="glass-card rounded-2xl p-4">
              <h4 className="text-xs font-semibold text-muted-foreground mb-3">Templates</h4>
              <div className="grid grid-cols-4 gap-2">
                {TEMPLATES.map(t => (
                  <button
                    key={t.value}
                    onClick={() => !t.pro || !isFree ? setTemplate(t.value) : toast.error("Upgrade to Pro")}
                    className={`rounded-lg h-10 bg-gradient-to-br ${t.colors.bg} border ${t.colors.border} transition-all duration-200 relative ${template === t.value ? "ring-2 ring-primary scale-105" : "opacity-60 hover:opacity-100"}`}
                  >
                    {t.pro && isFree && <Lock className="w-2.5 h-2.5 text-white/50 absolute top-1 right-1" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Credits info */}
            <div className="glass-card rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground">
                {isAdmin ? "∞ Admin access" : `${remaining} credits remaining today`}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default IDCardPro;
