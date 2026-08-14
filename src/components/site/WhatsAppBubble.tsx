import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ADMIN_WA_NUMBER = "6285772202454";

type ChatMessage = {
  id: string;
  sender: "ai" | "user";
  text: string;
  time: string;
  isActionWA?: boolean;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "m-1",
    sender: "ai",
    text: "Halo! 👋 Saya Asisten AI GEN-CB. Silakan tanyakan apa saja seputar pendaftaran MTQ, program jalan sehat, donasi, atau kegiatan yayasan. Jika butuh bantuan langsung, ketik 'chat admin'.",
    time: "Baru saja",
  },
];

const SUGGESTED_QUESTIONS = [
  "Info Pendaftaran MTQ",
  "Jalan Sehat 2 Mingguan",
  "Cara Berdonasi",
  "Chat Admin WA",
];

export function WhatsAppBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const redirectWa = (query: string) => {
    const text = encodeURIComponent(query.trim() || "Halo min, saya ingin menanyakan informasi seputar GEN-CB");
    window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${text}`, "_blank");
  };

  const processAiResponse = (userText: string) => {
    const textLow = userText.toLowerCase().trim();

    // Check if user specifically requested human admin
    if (
      textLow.includes("admin") ||
      textLow.includes("wa") ||
      textLow.includes("whatsapp") ||
      textLow.includes("hubungi") ||
      textLow.includes("kontak") ||
      textLow.includes("manusia")
    ) {
      setTimeout(() => {
        setIsTyping(false);
        const aiMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          sender: "ai",
          text: "Siap! Saya akan mengarahkan Anda langsung ke WhatsApp Admin Yayasan GEN-CB (+62 857-7220-2454). Memicu ke WhatsApp...",
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          isActionWA: true,
        };
        setMessages((prev) => [...prev, aiMsg]);

        setTimeout(() => {
          redirectWa(`Halo min, saya ingin menanyakan: ${userText}`);
        }, 1200);
      }, 700);
      return;
    }

    let answer = "";
    if (textLow.includes("mtq") || textLow.includes("lomba")) {
      answer = "Pendaftaran MTQ Desa Sasak Panjang 2026 sedang dibuka! Terdapat 4 cabang lomba: Tilawah, Hifdzil Qur'an, Murottal, dan Adzan. Pendaftaran gratis melalui menu Event pada website.";
    } else if (textLow.includes("jalan") || textLow.includes("sehat") || textLow.includes("olahraga")) {
      answer = "Program Jalan Sehat GEN-CB diadakan rutin setiap 2 minggu sekali untuk seluruh warga & pemuda Desa. Kegiatan ini gratis dan menyehatkan!";
    } else if (textLow.includes("donasi") || textLow.includes("transfer") || textLow.includes("qris") || textLow.includes("bantu")) {
      answer = "Donasi disalurkan untuk operasional Rumah Belajar gratis, Beasiswa Anak Desa, dan baksos yatim. Anda dapat berdonasi via Transfer Bank atau QRIS di halaman Donasi.";
    } else if (textLow.includes("relawan") || textLow.includes("gabung") || textLow.includes("daftar")) {
      answer = "Anda dapat mendaftar kegiatan melalui menu Event atau bergabung sebagai relawan pengajar Rumah Belajar. Kami selalu terbuka untuk pemuda yang ingin berkontribusi!";
    } else if (textLow.includes("lokasi") || textLow.includes("alamat") || textLow.includes("mana")) {
      answer = "Sekretariat GEN-CB berlokasi di Desa Sasak Panjang, Kec. Tajurhalang, Kab. Bogor, Jawa Barat.";
    } else {
      answer = "Terima kasih atas pertanyaannya! GEN-CB aktif dalam bidang pendidikan, keagamaan, sosial, dan olahraga. Untuk pertanyaan lebih spesifik atau bantuan khusus, ketik 'chat admin' agar dihubungkan ke WhatsApp admin.";
    }

    setTimeout(() => {
      setIsTyping(false);
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: "ai",
        text: answer,
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  const handleSend = (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!overrideText) setInput("");
    setIsTyping(true);

    processAiResponse(textToSend.trim());
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 font-sans select-none print:hidden">
      {/* Chat Popup Box */}
      {isOpen && (
        <div className="w-[320px] sm:w-[370px] rounded-2xl border border-emerald-500/20 bg-card text-card-foreground shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 backdrop-blur-md">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3.5 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="size-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white shadow-inner">
                  <Bot className="size-5" />
                </div>
                <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-400 border-2 border-emerald-700 animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-xs leading-tight flex items-center gap-1">
                  Asisten AI GEN-CB <Sparkles className="size-3 text-amber-300" />
                </h3>
                <p className="text-[10px] text-emerald-100 mt-0.5">Tanya Jawab Otomatis & WA Admin</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Tutup chat"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages List */}
          <div className="p-3.5 space-y-3 bg-muted/20 h-[280px] overflow-y-auto">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "ai" && (
                  <div className="size-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1">
                    <Bot className="size-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs shadow-xs leading-relaxed space-y-1 ${
                    m.sender === "user"
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-background text-foreground border border-border/60 rounded-bl-none"
                  }`}
                >
                  <p>{m.text}</p>
                  {m.isActionWA && (
                    <Button
                      size="sm"
                      className="mt-2 w-full text-[11px] h-7 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl gap-1"
                      onClick={() => redirectWa(messages[messages.length - 2]?.text || "Chat Admin")}
                    >
                      <ExternalLink className="size-3" /> Langsung ke WhatsApp
                    </Button>
                  )}
                  <span
                    className={`block text-[9px] text-right ${
                      m.sender === "user" ? "text-emerald-100" : "text-muted-foreground"
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
                {m.sender === "user" && (
                  <div className="size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-1">
                    <User className="size-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-muted-foreground">
                <div className="size-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Bot className="size-3.5 animate-spin" />
                </div>
                <span className="italic text-[11px]">Asisten AI mengetik...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3.5 py-2 bg-muted/40 border-t border-border/50">
            <div className="flex flex-wrap gap-1">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-card border border-border text-foreground hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-card border-t border-border flex gap-2 items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pertanyaan atau 'chat admin'..."
              className="text-xs h-8 bg-background focus-visible:ring-emerald-500"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSend())}
            />
            <Button
              onClick={() => handleSend()}
              size="icon"
              className="size-8 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
              title="Kirim pesan"
            >
              <Send className="size-3.5" />
            </Button>
          </div>

          {/* Footer Direct WA Redirection Button */}
          <div className="px-3 py-1.5 bg-emerald-500/10 border-t border-emerald-500/20 flex items-center justify-between text-[10px] text-emerald-800 dark:text-emerald-300">
            <span>Admin WA (+62 857-7220-2454)</span>
            <button
              onClick={() => redirectWa(input || "Halo Admin GEN-CB")}
              className="font-bold flex items-center gap-0.5 hover:underline text-emerald-700 dark:text-emerald-400"
            >
              Chat Admin WA <ExternalLink className="size-2.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
        aria-label="Tanya AI & Chat Admin WA GEN-CB"
      >
        <span className="absolute -top-1 -right-1 flex size-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full size-3 bg-emerald-300"></span>
        </span>
        <Bot className="size-6 animate-bounce group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline font-semibold text-xs pr-1">Tanya AI & Admin WA</span>
      </button>
    </div>
  );
}
