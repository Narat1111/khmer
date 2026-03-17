import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const MORSE: Record<string, string> = { A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..",0:"-----",1:".----",2:"..---",3:"...--",4:"....-",5:".....",6:"-....",7:"--...",8:"---..",9:"----."," ":"/" };
const REVERSE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

const MorseCode: React.FC = () => {
  const [text, setText] = useState("HELLO WORLD");
  const [morse, setMorse] = useState("");

  const toMorse = () => setMorse(text.toUpperCase().split("").map(c => MORSE[c] || c).join(" "));
  const toText = () => setText(morse.split(" ").map(c => REVERSE[c] || c).join(""));

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <label className="mb-1 block text-sm font-medium">Text</label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} />
      </motion.div>
      <div className="flex gap-2">
        <Button onClick={toMorse} className="flex-1">Text → Morse</Button>
        <Button onClick={toText} variant="outline" className="flex-1">Morse → Text</Button>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <label className="mb-1 block text-sm font-medium">Morse Code</label>
        <Textarea value={morse} onChange={(e) => setMorse(e.target.value)} rows={2} className="font-mono tracking-wider" />
      </motion.div>
    </div>
  );
};

export default MorseCode;
