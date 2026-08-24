import { motion } from "framer-motion";
import { Link } from "react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Home, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-5xl mx-auto relative px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center min-h-[200px]"
          >
            <div className="text-center">
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground mb-4">404</h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8">Page Not Found</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] cursor-pointer min-h-[48px]"
              >
                <Home className="h-4 w-4" /> Go Home
              </Link>
              <Link
                to="/generator"
                className="ml-3 inline-flex items-center gap-2 rounded-xl border border-border bg-background px-8 py-3 text-base font-semibold text-foreground transition-all hover:bg-accent active:scale-[0.98] cursor-pointer min-h-[48px]"
              >
                <Sparkles className="h-4 w-4" /> Create Wish
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
