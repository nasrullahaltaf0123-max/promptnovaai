import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

type State = "idle" | "loading" | "success" | "error";

interface GenerationStateProps {
  state: State;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  onRetry?: () => void;
}

const GenerationState = ({
  state,
  loadingText = "Generating with AI…",
  successText = "Generated successfully!",
  errorText = "Something went wrong",
  onRetry,
}: GenerationStateProps) => {
  if (state === "idle") return null;

  return (
    <AnimatePresence mode="wait">
      {state === "loading" && (
        <motion.div
          key="loading"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20"
        >
          <div className="relative">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <Sparkles className="w-3 h-3 text-primary/50 absolute -top-1 -right-1" />
          </div>
          <div>
            <p className="text-caption font-medium text-foreground">{loadingText}</p>
            <p className="text-micro text-muted-foreground">This may take a few seconds…</p>
          </div>
        </motion.div>
      )}

      {state === "success" && (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </motion.div>
          <p className="text-caption font-medium text-foreground">{successText}</p>
        </motion.div>
      )}

      {state === "error" && (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20"
        >
          <AlertCircle className="w-5 h-5 text-destructive" />
          <div className="flex-1">
            <p className="text-caption font-medium text-foreground">{errorText}</p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-micro font-semibold text-primary hover:underline"
            >
              Retry
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GenerationState;
export type { State as GenerationStateType };
