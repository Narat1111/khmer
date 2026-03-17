import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Copy } from "lucide-react";

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "An unexamined life is not worth living.", author: "Socrates" },
];

const QuoteGenerator: React.FC = () => {
  const [idx, setIdx] = useState(0);

  const next = () => setIdx(Math.floor(Math.random() * quotes.length));
  const q = quotes[idx];

  return (
    <div className="flex flex-col items-center gap-6">
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          className="max-w-lg rounded-2xl border bg-card p-8 text-center">
          <p className="text-xl font-bold leading-relaxed">"{q.text}"</p>
          <p className="mt-4 text-muted-foreground">— {q.author}</p>
        </motion.div>
      </AnimatePresence>
      <div className="flex gap-2">
        <Button onClick={next} className="gap-2"><RefreshCw className="h-4 w-4" /> New Quote</Button>
        <Button variant="outline" onClick={() => navigator.clipboard.writeText(`"${q.text}" — ${q.author}`)}><Copy className="h-4 w-4" /></Button>
      </div>
    </div>
  );
};

export default QuoteGenerator;
