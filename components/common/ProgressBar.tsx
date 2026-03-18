"use client";

import { useEffect, useState }   from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence }      from "framer-motion";
import { Suspense }              from "react";

function ProgressBarInner() {
  const pathname      = usePathname();
  const searchParams  = useSearchParams();
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    setProgress(30);

    const t1 = setTimeout(() => setProgress(60),  100);
    const t2 = setTimeout(() => setProgress(85),  300);
    const t3 = setTimeout(() => setProgress(100), 500);
    const t4 = setTimeout(() => setLoading(false), 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-transparent pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="h-full bg-foreground origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ProgressBar() {
  return (
    <Suspense>
      <ProgressBarInner />
    </Suspense>
  );
}