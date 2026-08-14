import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, ExternalLink, Sparkles, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ADMIN_WA_NUMBER = "6285772202454";

type ChatMessage = {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  isAction?: boolean;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "m-init",
    sender: "ai",
    text: "Halo! 👋 Saya Asisten Virtual GEN-CB AI. Silakan tanyakan informasi seputar MTQ, Event, Program Jalan Sehat, Donasi, atau lokasi kami.\n\nJika ingin berbicara langsung dengan pengurus, ketik **chat admin** atau tekan tombol di bawah.",
    timestamp: "Baru saja",
  },
];

const SUGGESTED_QUESTIONS = [
  "Jadwal MTQ Desa",
  "Program Jalan Sehat",
  "Cara Donasi",
  "Chat Admin WA",
];

function getAiResponse(userText: string): { reply: string; redirectWa: boolean } {
  const lower = userText.toLowerCase().trim();

  if (
    lower.includes("chat admin") ||
    lower.includes("hubungi admin") ||
    lower.includes("admin wa") ||
    lower.includes("whatsapp") ||
    lower.includes("bicara admin") ||
    lower.includes("kontak admin")
  ) {
    return {
      reply: "Baik, saya langsung alihkan Anda ke WhatsApp Admin GEN-CB (+62 857-7220-2454) untuk respon langsung...",
      redirectWa: true,
    };
  }

  if (lower.includes("mtq") || lower.includes("quran") || lower.includes("tilawah")) {
    return {
      reply: "Kegiatan MTQ Desa Sasak Panjang 2026 menghadirkan 4 cabang lomba: Tilawah, Hifdzil Qur'an, Murottal, dan Adzan di Masjid Jami Al-Ikhlas. Pendaftaran 100% GRATIS! Anda dapat mendaftar melalui menu Event.",
      redirectWa: false,
    };
  }

  if (lower.includes("jalan") || lower.includes("sehat") || lower.includes("olahraga")) {
    return {
      reply: "Program Jalan Sehat GEN-CB diselenggarakan rutin setiap 2 minggu sekali untuk seluruh warga dan pemuda desa. Kumpul pukul 06.00 WIB di Alun-Alun Desa Sasak Panjang.",
      redirectWa: false,
    };
  }

  if (lower.includes("tenis") || lower.includes("meja") || lower.includes("pingpong")) {
    return {
      reply: "Turnamen Tenis Meja & GEN-CB Sport Community diadakan di Balai Warga Desa Sasak Panjang. Terbuka untuk umum dan pemuda desa.",
      redirectWa: false,
    };
  }

  if (lower.includes("donasi") || lower.includes("beasiswa") || lower.includes("rekening") || lower.includes("qris")) {
    return {
      reply: "Donasi GEN-CB disalurkan untuk operasional Rumah Belajar gratis, Beasiswa Anak Desa, dan santunan yatim. Pembayaran dapat dilakukan via Transfer Bank atau QRIS pada menu Donasi.",
      redirectWa: false,
    };
  }

  if (lower.includes("lokasi") || lower.includes("alamat") || lower.includes("mana")) {
    return {
      reply: "Sekretariat GEN-CB berlokasi di Jl. Raya Sasak Panjang No. 12, Kec. Tajurhalang, Kabupaten Bogor, Jawa Barat.",
      redirectWa: false,
    };
  }

  if (lower.includes("relawan") || lower.includes("daftar") || lower.includes("gabung")) {
    return {
      reply: "Anda dapat bergabung menjadi relawan pengajar Rumah Belajar atau panitia kegiatan dengan mendaftar di formulir kegiatan kami atau menghubungi Admin via WhatsApp.",
      redirectWa: false,
    };
  }

  return {
    reply: "Terima kasih atas pertanyaan Anda! Saya Asisten AI GEN-CB. Saya bisa memberikan info seputar Event, Program, Donasi, atau Lokasi. Jika butuh bantuan spesifik dari pengurus, silakan ketik **chat admin** untuk tersambung ke WhatsApp.",
    redirectWa: false,
  };
}

export function WhatsAppBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const openWhatsApp = (customText?: string) => {
    const textToSend = customText || input || "Halo min, saya ingin menanyakan informasi seputar GEN-CB";
    const encoded = encodeURIComponent(textToSend.trim());
    window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${encoded}`, "_blank");
  };

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (textOverride?: string) => {
    const text = (textOverride || input).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textOverride) setInput("");

    // Trigger AI thinking state
    setIsTyping(true);

    setTimeout(() => {
      const { reply, redirectWa } = getAiResponse(text);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: reply,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        isAction: redirectWa,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);

      if (redirectWa) {
        setTimeout(() => openWhatsApp(text), 1200);
      }
    }, 400);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 font-sans select-none print:hidden">
      {/* AI Chat Window */}
      {isOpen && (
        <div className="w-[330px] sm:w-[380px] h-[460px] rounded-3xl border border-border bg-card text-card-foreground shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 backdrop-blur-md">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-4 text-white flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-white shadow-inner">
                  <Bot className="size-6 text-emerald-100" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-400 border-2 border-emerald-800 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm leading-tight">Asisten GEN-CB AI</h3>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md font-mono text-emerald-100">
                    BOT
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/90 mt-0.5 flex items-center gap-1">
                  <Sparkles className="size-3 text-emerald-300" /> Tanya Jawab Virtual & WA Admin
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Tutup chat"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 space-y-3 bg-muted/20 overflow-y-auto">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "ai" && (
                  <div className="size-7 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="size-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                    m.sender === "user"
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-background text-foreground border border-border/60 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  {m.isAction && (
                    <Button
                      size="sm"
                      onClick={() => openWhatsApp("Halo min saya ingin bicara dengan admin")}
                      className="mt-2.5 w-full h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 rounded-xl shadow-xs"
                    >
                      <PhoneCall className="size-3.5" /> Buka WhatsApp Admin Sekarang <ExternalLink className="size-3" />
                    </Button>
                  )}
                  <span
                    className={`block text-[9px] mt-1.5 text-right ${
                      m.sender === "user" ? "text-emerald-100" : "text-muted-foreground"
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
                {m.sender === "user" && (
                  <div className="size-7 rounded-xl bg-accent text-accent-foreground flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                    <User className="size-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-muted-foreground pt-1">
                <div className="size-7 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <Bot className="size-4 animate-bounce" />
                </div>
                <span className="italic text-[11px]">Asisten AI sedang mengetik...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-card border-t border-border/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
              >
                + {q}
              </button>
            ))}
          </div>

          {/* Input & Direct WA Action */}
          <div className="p-3 bg-card border-t border-border space-y-2">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanyakan ke AI atau ketik 'chat admin'..."
                className="text-xs h-9 bg-background shadow-xs focus-visible:ring-emerald-500"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSend())}
              />
              <Button
                onClick={() => handleSend()}
                size="icon"
                className="size-9 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                title="Kirim pesan ke AI"
              >
                <Send className="size-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
              <span>Tanyakan AI dulu atau hubungi admin</span>
              <button
                onClick={() => openWhatsApp("Halo min saya ingin menanyakan tentang GEN-CB")}
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
              >
                Chat Admin WA <ExternalLink className="size-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
        aria-label="Tanya AI & Hubungi Admin GEN-CB"
      >
        <span className="absolute -top-1 -right-1 flex size-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full size-3 bg-emerald-300"></span>
        </span>
        <Bot className="size-6 animate-pulse group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline font-semibold text-xs pr-1">Tanya AI & Admin WA</span>
      </button>
    </div>
  );
}
