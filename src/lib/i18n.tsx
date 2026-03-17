import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "km" | "en";

const dict = {
  km: {
    title: "DaraTool",
    subtitle: "ឧបករណ៍អនឡាញឥតគិតថ្លៃសម្រាប់អ្នកប្រើប្រាស់ខ្មែរ",
    search: "ស្វែងរកឧបករណ៍...",
    back: "ត្រឡប់ក្រោយ",
    download: "ទាញយក",
    convert: "បំប្លែង",
    generate: "បង្កើត",
    copy: "ចម្លង",
    copied: "បានចម្លង!",
    reset: "កំណត់ឡើងវិញ",
    success: "ជោគជ័យ!",
    error: "មានបញ្ហា",
    loading: "កំពុងផ្ទុក...",
    paste_url: "បិទភ្ជាប់តំណរភ្ជាប់នៅទីនេះ",
    start: "ចាប់ផ្ដើម",
    stop: "បញ្ឈប់",
    play: "លេង",
    pause: "ផ្អាក",
    clear: "សម្អាត",
    categories: {
      media: "មេឌា",
      productivity: "ផលិតភាព",
      utilities: "ឧបករណ៍",
    },
    tools: {
      ai_chat: { name: "AI ជជែក", desc: "ជជែកជាមួយ AI ជំនួយការឆ្លាតវៃ" },
      tiktok: { name: "ទាញយកវីដេអូ TikTok", desc: "ទាញយកវីដេអូ TikTok គ្មាន Watermark" },
      voice: { name: "សំឡេង AI", desc: "បំប្លែងអត្ថបទទៅជាសំឡេង" },
      image_compress: { name: "បង្រួមរូបភាព", desc: "បង្រួមទំហំរូបភាពដោយរក្សាគុណភាព" },
      image_pdf: { name: "រូបភាព → PDF", desc: "បំប្លែងរូបភាពទៅជា PDF" },
      qr: { name: "បង្កើត QR Code", desc: "បង្កើតកូដ QR ពីអត្ថបទ ឬតំណរ" },
      password: { name: "បង្កើតពាក្យសម្ងាត់", desc: "បង្កើតពាក្យសម្ងាត់ដែលមានសុវត្ថិភាព" },
      unit: { name: "បំប្លែងឯកតា", desc: "បំប្លែងរវាងឯកតាផ្សេងៗ" },
      currency: { name: "បំប្លែងរូបិយប័ណ្ណ", desc: "អត្រាប្តូរប្រាក់ផ្ទាល់" },
      text_case: { name: "បំប្លែងអក្សរ", desc: "ប្តូរទម្រង់អក្សរធំ/តូច" },
      word_count: { name: "រាប់ពាក្យ", desc: "រាប់ពាក្យ អក្សរ និងប្រយោគ" },
      color: { name: "ជ្រើសពណ៌", desc: "ជ្រើសរើស និងចម្លងកូដពណ៌" },
      random: { name: "លេខចៃដន្យ", desc: "បង្កើតលេខចៃដន្យក្នុងជួរ" },
      stopwatch: { name: "នាឡិកាកំណត់ពេល", desc: "នាឡិកាបញ្ឈប់ និងកំណត់ពេល" },
      weather: { name: "អាកាសធាតុ", desc: "ពិនិត្យអាកាសធាតុបច្ចុប្បន្ន" },
      hash: { name: "បង្កើត Hash ឯកសារ", desc: "គណនា Hash MD5, SHA-256" },
      base64: { name: "Base64 បំប្លែង", desc: "បំប្លែង Base64 encode/decode" },
      bluetooth: { name: "ពិនិត្យ Bluetooth", desc: "ពិនិត្យឧបករណ៍ Bluetooth នៅជិត" },
      wifi: { name: "ពិនិត្យ WiFi", desc: "ពិនិត្យល្បឿន WiFi និងស្ថានភាព" },
      ip_location: { name: "ទីតាំង IP", desc: "រកទីតាំង IP Address របស់អ្នក" },
      code_editor: { name: "កម្មវិធីកែកូដ", desc: "សរសេរ និងដំណើរការកូដ HTML/JS/CSS" },
    },
  },
  en: {
    title: "DaraTool",
    subtitle: "Free online utility tools for everyone",
    search: "Search tools...",
    back: "Back",
    download: "Download",
    convert: "Convert",
    generate: "Generate",
    copy: "Copy",
    copied: "Copied!",
    reset: "Reset",
    success: "Success!",
    error: "Error",
    loading: "Loading...",
    paste_url: "Paste URL here",
    start: "Start",
    stop: "Stop",
    play: "Play",
    pause: "Pause",
    clear: "Clear",
    categories: {
      media: "Media",
      productivity: "Productivity",
      utilities: "Utilities",
    },
    tools: {
      ai_chat: { name: "AI Chat", desc: "Chat with an intelligent AI assistant" },
      tiktok: { name: "TikTok Downloader", desc: "Download TikTok videos without watermark" },
      voice: { name: "Voice AI", desc: "Convert text to natural speech" },
      image_compress: { name: "Image Compressor", desc: "Compress images while keeping quality" },
      image_pdf: { name: "Image → PDF", desc: "Convert images to PDF document" },
      qr: { name: "QR Code Generator", desc: "Generate QR codes from text or URLs" },
      password: { name: "Password Generator", desc: "Generate secure passwords" },
      unit: { name: "Unit Converter", desc: "Convert between different units" },
      currency: { name: "Currency Converter", desc: "Live exchange rates" },
      text_case: { name: "Text Case Converter", desc: "Convert text case styles" },
      word_count: { name: "Word Counter", desc: "Count words, characters, and sentences" },
      color: { name: "Color Picker", desc: "Pick and copy color codes" },
      random: { name: "Random Number", desc: "Generate random numbers in a range" },
      stopwatch: { name: "Stopwatch / Timer", desc: "Stopwatch and countdown timer" },
      weather: { name: "Weather", desc: "Check current weather conditions" },
      hash: { name: "File Hash Generator", desc: "Calculate MD5, SHA-256 hashes" },
      base64: { name: "Base64 Encoder", desc: "Base64 encode/decode" },
      bluetooth: { name: "Bluetooth Checker", desc: "Scan for nearby Bluetooth devices" },
      wifi: { name: "WiFi Checker", desc: "Check WiFi speed and connection status" },
      ip_location: { name: "IP Location", desc: "Find your IP address and location" },
      code_editor: { name: "Code Editor", desc: "Write and run HTML/JS/CSS code" },
    },
  },
} as const;

type Dict = (typeof dict)[Lang];

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("sranal-lang");
    return (saved === "en" ? "en" : "km") as Lang;
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("sranal-lang", l);
    document.documentElement.lang = l;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t: dict[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
