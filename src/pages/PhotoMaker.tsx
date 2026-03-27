import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Download, Wand2, Shirt, Image as ImageIcon, Sparkles, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { generateContent } from "@/lib/ai";
import { toast } from "sonner";

type DressStyle = "suit" | "shirt-tie" | "casual";
type Background = "white" | "light-gray" | "office" | "studio";
type Enhancement = "natural" | "medium" | "high";
type ExportSize = "passport" | "square" | "hd";

const DRESS_OPTIONS: { value: DressStyle; label: string; icon: string }[] = [
  { value: "suit", label: "Formal Suit", icon: "🤵" },
  { value: "shirt-tie", label: "Shirt + Tie", icon: "👔" },
  { value: "casual", label: "Smart Casual", icon: "👕" },
];

const BG_OPTIONS: { value: Background; label: string; icon: string }[] = [
  { value: "white", label: "White (Passport)", icon: "⬜" },
  { value: "light-gray", label: "Light Gray", icon: "🔘" },
  { value: "office", label: "Office Blur", icon: "🏢" },
  { value: "studio", label: "Studio", icon: "📸" },
];

const ENHANCE_OPTIONS: { value: Enhancement; label: string }[] = [
  { value: "natural", label: "Natural" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const EXPORT_OPTIONS: { value: ExportSize; label: string; dimensions: string }[] = [
  { value: "passport", label: "Passport Size", dimensions: "413×531" },
  { value: "square", label: "Square (LinkedIn)", dimensions: "800×800" },
  { value: "hd", label: "HD Image", dimensions: "1200×1500" },
];

const PhotoMaker = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState("");

  const [dressStyle, setDressStyle] = useState<DressStyle>("suit");
  const [background, setBackground] = useState<Background>("white");
  const [enhancement, setEnhancement] = useState<Enhancement>("medium");
  const [exportSize, setExportSize] = useState<ExportSize>("square");
  const [aiAutoMode, setAiAutoMode] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
      setResultImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!uploadedImage) {
      toast.error("Please upload a photo first");
      return;
    }

    setIsProcessing(true);
    setResultImage(null);

    try {
      setProcessStep("Analyzing photo...");
      await new Promise((r) => setTimeout(r, 500));

      setProcessStep("Enhancing photo professionally...");

      const bgDesc: Record<Background, string> = {
        white: "pure white clean passport-style background",
        "light-gray": "soft light gray gradient studio background",
        office: "professional office environment with soft bokeh blur background",
        studio: "professional photography studio with soft lighting background",
      };

      const dressDesc: Record<DressStyle, string> = {
        suit: "formal black or navy business suit with white shirt",
        "shirt-tie": "professional dress shirt with a matching tie",
        casual: "smart casual polo or button-up shirt",
      };

      const enhanceDesc: Record<Enhancement, string> = {
        natural: "subtle natural enhancement, minimal retouching, keep original look",
        medium: "moderate enhancement, smooth skin, good lighting balance, natural colors",
        high: "high enhancement, perfect skin, studio-quality lighting, sharp details",
      };

      const autoNote = aiAutoMode
        ? "AI AUTO MODE: Automatically choose the best combination of background, outfit and lighting for a professional look. Override the specific choices below if a better option exists."
        : "Follow the specific user choices below exactly.";

      const prompt = `Transform this person's photo into a PROFESSIONAL OFFICIAL PHOTO suitable for CV, LinkedIn, or job applications.

${autoNote}

CRITICAL RULES:
- DO NOT change the person's face identity AT ALL
- DO NOT over-beautify or make the face look artificial
- Keep the person's natural facial features, skin tone, and identity
- The result must look like the SAME PERSON, just in a professional setting

BACKGROUND: ${bgDesc[background]}
CLOTHING: Replace current clothing with ${dressDesc[dressStyle]}. Match lighting and shadows to the body naturally. Keep body proportions realistic.
ENHANCEMENT: ${enhanceDesc[enhancement]}

ADDITIONAL IMPROVEMENTS:
- Fix lighting to be even and professional
- Clean up any hair flyaways for a neat look
- Remove noise and improve sharpness
- Ensure natural skin tones (not orange or overly smooth)
- Add subtle professional lighting (key light + fill light)

OUTPUT: A clean, professional headshot photo ready for official use.`;

      const result = await generateContent("photo-enhance", prompt, {
        image: uploadedImage,
      });

      if (result.error) {
        toast.error(result.error);
        setIsProcessing(false);
        setProcessStep("");
        return;
      }

      if (result.images && result.images.length > 0) {
        setResultImage(result.images[0]);
        toast.success("Professional photo generated!");
      } else {
        toast.error("Failed to generate photo. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsProcessing(false);
      setProcessStep("");
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = `professional-photo-${exportSize}.png`;
    link.click();
    toast.success("Photo downloaded!");
  };

  const handleReset = () => {
    setUploadedImage(null);
    setResultImage(null);
    setProcessStep("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
          <Camera className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Professional Photo Maker</h1>
          <p className="text-sm text-muted-foreground">Transform any photo into a professional headshot</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Controls */}
        <div className="space-y-4">
          {/* Upload */}
          <div className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
            <Label className="text-sm font-medium">Upload Photo</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              className="w-full h-20 border-dashed border-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-1">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {uploadedImage ? "Change photo" : "Click to upload"}
                </span>
              </div>
            </Button>
          </div>

          {/* AI Auto Mode */}
          <div className="rounded-xl border border-border/50 bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <Label className="text-sm font-medium">AI Auto Mode</Label>
              </div>
              <Switch checked={aiAutoMode} onCheckedChange={setAiAutoMode} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              AI picks the best settings automatically
            </p>
          </div>

          {/* Dress Style */}
          <div className="rounded-xl border border-border/50 bg-card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Shirt className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Dress Style</Label>
            </div>
            <Select value={dressStyle} onValueChange={(v) => setDressStyle(v as DressStyle)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DRESS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.icon} {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Background */}
          <div className="rounded-xl border border-border/50 bg-card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Background</Label>
            </div>
            <Select value={background} onValueChange={(v) => setBackground(v as Background)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {BG_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.icon} {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Enhancement Level */}
          <div className="rounded-xl border border-border/50 bg-card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Enhancement Level</Label>
            </div>
            <Select value={enhancement} onValueChange={(v) => setEnhancement(v as Enhancement)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ENHANCE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Export Size */}
          <div className="rounded-xl border border-border/50 bg-card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Export Size</Label>
            </div>
            <Select value={exportSize} onValueChange={(v) => setExportSize(v as ExportSize)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {EXPORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label} ({o.dimensions})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <Button
              className="w-full"
              size="lg"
              onClick={handleGenerate}
              disabled={!uploadedImage || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {processStep || "Processing..."}
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Professional Photo
                </>
              )}
            </Button>

            {(uploadedImage || resultImage) && (
              <Button variant="outline" className="w-full" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original */}
            <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border/50 bg-muted/30">
                <span className="text-xs font-medium text-muted-foreground">Original Photo</span>
              </div>
              <div className="aspect-[3/4] flex items-center justify-center bg-muted/10">
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Original"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-6">
                    <Camera className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground/50">Upload a photo to start</p>
                  </div>
                )}
              </div>
            </div>

            {/* Result */}
            <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border/50 bg-muted/30 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Professional Result</span>
                {resultImage && (
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={handleDownload}>
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                )}
              </div>
              <div className="aspect-[3/4] flex items-center justify-center bg-muted/10 relative">
                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center p-6"
                    >
                      <Loader2 className="w-10 h-10 text-primary mx-auto mb-3 animate-spin" />
                      <p className="text-sm text-muted-foreground">{processStep}</p>
                    </motion.div>
                  ) : resultImage ? (
                    <motion.img
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={resultImage}
                      alt="Professional result"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center p-6"
                    >
                      <Sparkles className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground/50">Result will appear here</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoMaker;
