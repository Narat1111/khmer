import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "km" | "en";

const toolsKm = {
  ai_chat: { name: "AI ជជែក", desc: "ជជែកជាមួយ AI ជំនួយការឆ្លាតវៃ" },
  tiktok: { name: "ទាញយកវីដេអូ TikTok", desc: "ទាញយកវីដេអូ TikTok គ្មាន Watermark" },
  voice: { name: "សំឡេង AI", desc: "បំប្លែងអត្ថបទទៅជាសំឡេង" },
  image_compress: { name: "បង្រួមរូបភាព", desc: "បង្រួមទំហំរូបភាពដោយរក្សាគុណភាព" },
  image_pdf: { name: "រូបភាព → PDF", desc: "បំប្លែងរូបភាពទៅជា PDF" },
  translator: { name: "បកប្រែ", desc: "បកប្រែអត្ថបទរវាងភាសាជាច្រើន" },
  image_to_text: { name: "រូបភាព → អត្ថបទ", desc: "ស្កេនអត្ថបទពីរូបភាព OCR" },
  bg_remover: { name: "ដកផ្ទៃខាងក្រោយ", desc: "ដកផ្ទៃខាងក្រោយរូបភាព" },
  image_enhancer: { name: "កែលម្អរូបភាព", desc: "កែពន្លឺ កម្រិតពណ៌ និងភាពច្បាស់" },
  screen_recorder: { name: "ថតអេក្រង់", desc: "ថតអេក្រង់កុំព្យូទ័ររបស់អ្នក" },
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
  bluetooth: { name: "ពិនិត្យ Bluetooth", desc: "ស្កេនឧបករណ៍ Bluetooth នៅជិត" },
  wifi: { name: "ពិនិត្យ WiFi", desc: "ពិនិត្យល្បឿន WiFi និងស្ថានភាព" },
  ip_location: { name: "ទីតាំង IP", desc: "រកទីតាំង IP Address របស់អ្នក" },
  code_editor: { name: "កម្មវិធីកែកូដ", desc: "សរសេរ និងដំណើរការកូដ HTML/JS/CSS" },
  calculator: { name: "ម៉ាស៊ីនគិតលេខ", desc: "ម៉ាស៊ីនគិតលេខមូលដ្ឋាន" },
  bmi_calculator: { name: "គណនា BMI", desc: "គណនាសន្ទស្សន៍ម៉ាសរាងកាយ" },
  age_calculator: { name: "គណនាអាយុ", desc: "គណនាអាយុពីថ្ងៃកំណើត" },
  typing_test: { name: "សាកល្បងវាយអក្សរ", desc: "វាស់ល្បឿនវាយអក្សររបស់អ្នក" },
  snake_game: { name: "ហ្គេមពស់", desc: "ហ្គេមពស់បុរាណដ៏សប្បាយ" },
  lucky_wheel: { name: "កង់សំណាង", desc: "បង្វិលកង់សំណាងដើម្បីជ្រើសរើស" },
  todo_list: { name: "បញ្ជីកិច្ចការ", desc: "គ្រប់គ្រងកិច្ចការប្រចាំថ្ងៃ" },
  notes: { name: "កំណត់ចំណាំ", desc: "សរសេរ និងរក្សាកំណត់ចំណាំ" },
  pomodoro: { name: "Pomodoro Timer", desc: "បច្ចេកទេសផ្តោតអារម្មណ៍ 25 នាទី" },
  json_formatter: { name: "JSON Formatter", desc: "ធ្វើទ្រង់ទ្រាយ និងបង្រួម JSON" },
  gradient_generator: { name: "បង្កើត Gradient", desc: "បង្កើត CSS gradient ស្រស់ស្អាត" },
  flip_coin: { name: "បោះកាក់", desc: "បោះកាក់ក្បាល ឬកន្ទុយ" },
  tip_calculator: { name: "គណនា Tip", desc: "គណនាទឹកប្រាក់ Tip និងចែកថវិកា" },
  loan_calculator: { name: "គណនាកម្ចី", desc: "គណនាការបង់រំលស់កម្ចីប្រចាំខែ" },
  // New tools
  markdown_preview: { name: "Markdown Preview", desc: "មើល Markdown ជាមុន" },
  regex_tester: { name: "Regex Tester", desc: "សាកល្បង Regular Expression" },
  lorem_ipsum: { name: "Lorem Ipsum", desc: "បង្កើតអត្ថបទ Lorem Ipsum" },
  emoji_picker: { name: "Emoji Picker", desc: "ជ្រើសរើស និងចម្លង Emoji" },
  draw_board: { name: "ក្តារគូរ", desc: "គូរគំនូរដោយសេរី" },
  barcode_gen: { name: "បង្កើត Barcode", desc: "បង្កើត Barcode ពីអត្ថបទ" },
  percentage_calc: { name: "គណនា %", desc: "គណនាភាគរយផ្សេងៗ" },
  date_diff: { name: "គម្លាតកាលបរិច្ឆេទ", desc: "គណនាគម្លាតរវាងកាលបរិច្ឆេទ" },
  countdown_timer: { name: "រាប់ថយក្រោយ", desc: "រាប់ពេលវេលាទៅព្រឹត្តិការណ៍" },
  color_palette: { name: "បង្កើតក្ដារពណ៌", desc: "បង្កើតក្ដារពណ៌ចៃដន្យ" },
  css_shadow: { name: "CSS Shadow", desc: "បង្កើត CSS box-shadow" },
  text_diff: { name: "ប្រៀបធៀបអត្ថបទ", desc: "ប្រៀបធៀបភាពខុសគ្នាអត្ថបទ" },
  url_encoder: { name: "URL Encoder", desc: "Encode/Decode URL" },
  binary_converter: { name: "បំប្លែង Binary", desc: "បំប្លែង Dec/Bin/Hex/Oct" },
  roman_numeral: { name: "លេខរ៉ូម៉ាំង", desc: "បំប្លែងលេខទៅលេខរ៉ូម៉ាំង" },
  temperature: { name: "បំប្លែងសីតុណ្ហភាព", desc: "បំប្លែង °C, °F, K" },
  morse_code: { name: "Morse Code", desc: "បំប្លែងអត្ថបទទៅ Morse" },
  dice_roller: { name: "បោះឡុកឡាក់", desc: "បោះឡុកឡាក់ជាច្រើន" },
  rock_paper: { name: "កណ្ដុរ កន្រ្តៃ ក្រដាស", desc: "ហ្គេមកណ្ដុរកន្រ្តៃក្រដាស" },
  memory_game: { name: "ហ្គេមចងចាំ", desc: "ផ្គូផ្គងកាតស្រដៀងគ្នា" },
  tic_tac_toe: { name: "Tic Tac Toe", desc: "ហ្គេម XO បុរាណ" },
  quote_gen: { name: "ពាក្យស្រង់", desc: "ពាក្យស្រង់ចៃដន្យដែលបំផុសគំនិត" },
  habit_tracker: { name: "តាមដានទម្លាប់", desc: "តាមដានទម្លាប់ប្រចាំថ្ងៃ" },
  character_map: { name: "តួអក្សរពិសេស", desc: "ចម្លងសញ្ញា និងនិមិត្តសញ្ញាពិសេស" },
  ai_math: { name: "AI គណិតវិទ្យា", desc: "ដោះស្រាយកន្សោមគណិតវិទ្យា" },
  quiz: { name: "ប្រឡងសំណួរ", desc: "សាកល្បងចំណេះដឹងរបស់អ្នក" },
  meme_maker: { name: "បង្កើត Meme", desc: "បង្កើតរូបភាព Meme គួរឱ្យសើច" },
} as const;

const toolsEn = {
  ai_chat: { name: "AI Chat", desc: "Chat with an intelligent AI assistant" },
  tiktok: { name: "TikTok Downloader", desc: "Download TikTok videos without watermark" },
  voice: { name: "Voice AI", desc: "Convert text to natural speech" },
  image_compress: { name: "Image Compressor", desc: "Compress images while keeping quality" },
  image_pdf: { name: "Image → PDF", desc: "Convert images to PDF document" },
  translator: { name: "Translator", desc: "Translate text between languages" },
  image_to_text: { name: "Image to Text", desc: "Extract text from images (OCR)" },
  bg_remover: { name: "BG Remover", desc: "Remove image background" },
  image_enhancer: { name: "Image Enhancer", desc: "Adjust brightness, contrast & colors" },
  screen_recorder: { name: "Screen Recorder", desc: "Record your screen to video" },
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
  calculator: { name: "Calculator", desc: "Basic calculator with operations" },
  bmi_calculator: { name: "BMI Calculator", desc: "Calculate your Body Mass Index" },
  age_calculator: { name: "Age Calculator", desc: "Calculate age from date of birth" },
  typing_test: { name: "Typing Test", desc: "Measure your typing speed (WPM)" },
  snake_game: { name: "Snake Game", desc: "Classic snake game for fun" },
  lucky_wheel: { name: "Lucky Wheel", desc: "Spin the wheel to pick randomly" },
  todo_list: { name: "Todo List", desc: "Manage your daily tasks" },
  notes: { name: "Notes", desc: "Write and save quick notes" },
  pomodoro: { name: "Pomodoro Timer", desc: "25-min focus technique timer" },
  json_formatter: { name: "JSON Formatter", desc: "Beautify and minify JSON data" },
  gradient_generator: { name: "Gradient Generator", desc: "Create beautiful CSS gradients" },
  flip_coin: { name: "Coin Flip", desc: "Flip a coin — heads or tails" },
  tip_calculator: { name: "Tip Calculator", desc: "Calculate tips and split bills" },
  loan_calculator: { name: "Loan Calculator", desc: "Calculate monthly loan payments" },
  // New tools
  markdown_preview: { name: "Markdown Preview", desc: "Preview Markdown in real-time" },
  regex_tester: { name: "Regex Tester", desc: "Test regular expressions live" },
  lorem_ipsum: { name: "Lorem Ipsum", desc: "Generate placeholder text" },
  emoji_picker: { name: "Emoji Picker", desc: "Browse and copy emojis" },
  draw_board: { name: "Drawing Board", desc: "Free-hand drawing canvas" },
  barcode_gen: { name: "Barcode Generator", desc: "Generate barcodes from text" },
  percentage_calc: { name: "Percentage Calc", desc: "Calculate percentages easily" },
  date_diff: { name: "Date Difference", desc: "Calculate days between dates" },
  countdown_timer: { name: "Countdown Timer", desc: "Countdown to any event" },
  color_palette: { name: "Color Palette", desc: "Generate random color palettes" },
  css_shadow: { name: "CSS Shadow Gen", desc: "Create CSS box-shadow visually" },
  text_diff: { name: "Text Diff", desc: "Compare two texts side by side" },
  url_encoder: { name: "URL Encoder", desc: "Encode/Decode URLs" },
  binary_converter: { name: "Binary Converter", desc: "Convert Dec/Bin/Hex/Oct" },
  roman_numeral: { name: "Roman Numerals", desc: "Convert to/from Roman numerals" },
  temperature: { name: "Temperature", desc: "Convert °C, °F, Kelvin" },
  morse_code: { name: "Morse Code", desc: "Translate text to Morse code" },
  dice_roller: { name: "Dice Roller", desc: "Roll multiple dice at once" },
  rock_paper: { name: "Rock Paper Scissors", desc: "Play against the computer" },
  memory_game: { name: "Memory Game", desc: "Match pairs of cards" },
  tic_tac_toe: { name: "Tic Tac Toe", desc: "Classic XO board game" },
  quote_gen: { name: "Quote Generator", desc: "Random inspirational quotes" },
  habit_tracker: { name: "Habit Tracker", desc: "Track your daily habits" },
  character_map: { name: "Character Map", desc: "Copy special symbols & characters" },
  ai_math: { name: "AI Math Solver", desc: "Solve math expressions step by step" },
  quiz: { name: "Quiz", desc: "Test your general knowledge" },
} as const;

const dict = {
  km: {
    title: "DaraTool",
    subtitle: "ឧបករណ៍អនឡាញឥតគិតថ្លៃសម្រាប់អ្នកគ្រប់គ្នា",
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
      games: "ហ្គេម",
      finance: "ហិរញ្ញវត្ថុ",
      design: "រចនា",
      developer: "អ្នកអភិវឌ្ឍន៍",
    },
    tools: toolsKm,
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
      games: "Games & Fun",
      finance: "Finance & Math",
      design: "Design & Creative",
      developer: "Developer Tools",
    },
    tools: toolsEn,
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
