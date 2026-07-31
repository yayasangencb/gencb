import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const steps = [
  "Initializing GEN-CB...",
  "Loading Community Programs...",
  "Loading Education System...",
  "Loading Social Impact...",
  "Launching Website...",
];

export function LoadingScreen() {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage.getItem("gencb-loaded")) {
      setDone(true);
      return;
    }
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min((now - started) / 2600, 1);
      setProgress(p);
      if (p < 1) frame = requestAnimationFrame(tick);
      else {
        window.sessionStorage.setItem("gencb-loaded", "1");
        setDone(true);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const stepIndex = Math.min(steps.length - 1, Math.floor(progress * steps.length));

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-gradient-brand px-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="glass flex size-20 items-center justify-center rounded-3xl font-display text-2xl font-bold text-primary-foreground">
              GC
            </div>
            <p className="font-display text-xl font-semibold text-primary-foreground">
              Generasi Cerdas Beraksi
            </p>
            <div className="h-1.5 w-64 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-gradient-accent transition-[width] duration-100"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={stepIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-primary-foreground/80"
              >
                {steps[stepIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}