import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CalendarTool: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<Record<string, string>>({});
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [eventText, setEventText] = useState("");

  const year = date.getFullYear(), month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = date.toLocaleString("default", { month: "long", year: "numeric" });
  const days = Array.from({ length: firstDay }, () => 0).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const key = (d: number) => `${year}-${month}-${d}`;
  const prev = () => setDate(new Date(year, month - 1, 1));
  const next = () => setDate(new Date(year, month + 1, 1));
  const today = new Date();
  const isToday = (d: number) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const addEvent = () => {
    if (selectedDay && eventText.trim()) { setEvents({ ...events, [key(selectedDay)]: eventText }); setEventText(""); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <Button size="icon" variant="ghost" onClick={prev}><ChevronLeft className="h-4 w-4" /></Button>
        <h3 className="font-bold">{monthName}</h3>
        <Button size="icon" variant="ghost" onClick={next}><ChevronRight className="h-4 w-4" /></Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="font-bold text-muted-foreground py-1">{d}</div>)}
        {days.map((d, i) => (
          <motion.div
            key={i}
            whileHover={d ? { scale: 1.1 } : {}}
            whileTap={d ? { scale: 0.9 } : {}}
            onClick={() => d && setSelectedDay(d)}
            className={`rounded-lg py-2 text-xs cursor-pointer transition-colors ${!d ? "" : isToday(d) ? "bg-primary text-primary-foreground font-bold" : selectedDay === d ? "bg-primary/20" : events[key(d)] ? "bg-accent font-bold" : "hover:bg-accent"}`}
          >
            {d || ""}
          </motion.div>
        ))}
      </div>
      {selectedDay && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border bg-card p-3 space-y-2">
          <p className="text-xs font-bold">{monthName.split(" ")[0]} {selectedDay}</p>
          {events[key(selectedDay)] && <p className="text-xs text-primary">📌 {events[key(selectedDay)]}</p>}
          <div className="flex gap-2">
            <input value={eventText} onChange={(e) => setEventText(e.target.value)} placeholder="Add event..." className="flex-1 rounded border bg-background px-2 py-1 text-xs outline-none" onKeyDown={(e) => e.key === "Enter" && addEvent()} />
            <Button size="sm" onClick={addEvent}>Add</Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CalendarTool;
