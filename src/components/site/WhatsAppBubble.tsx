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
    text: "Halo! 👋 Selamat datang di Yayasan Generasi Cerdas Beraksi (GEN-CB).\n\nSaya Asisten AI Virtual. Silakan tanyakan info seputar **MTQ, Program Jalan Sehat, Rumah Belajar, Donasi, atau Lokasi**.\n\nJika ingin bicara langsung dengan pengurus, ketik **'chat admin'** atau klik tombol WhatsApp di bawah.",
    timestamp: "Baru saja",
  },
];

const SUGGESTED_QUESTIONS = [
  "Jadwal MTQ Desa",
  "Program Jalan Sehat",
  "Berapa Biaya Pendaftaran?",
  "Alamat Sekretariat",
  "Cara Donasi",
  "Chat Admin WA",
];

function getAiResponse(userText: string): { reply: string; redirectWa: boolean } {
  const lower = userText.toLowerCase().trim();

  // Direct Admin Request
  if (
    lower.includes("chat admin") ||
    lower.includes("hubungi admin") ||
    lower.includes("admin wa") ||
    lower.includes("whatsapp") ||
    lower.includes("bicara admin") ||
    lower.includes("kontak admin") ||
    lower.includes("ngobrol admin") ||
    lower.includes("panggil admin") ||
    lower.includes("operator")
  ) {
    return {
      reply: "Tentu! Saya akan langsung menghubungkan Anda ke WhatsApp Admin GEN-CB (+62 857-7220-2454) untuk berbicara langsung dengan pengurus sekarang...",
      redirectWa: true,
    };
  }

  // Greetings & Intros
  if (
    lower === "halo" ||
    lower === "hi" ||
    lower === "p" ||
    lower === "tes" ||
    lower === "siang" ||
    lower === "pagi" ||
    lower === "malam" ||
    lower.includes("assalamualaikum") ||
    lower.includes("selamat pagi") ||
    lower.includes("selamat siang") ||
    lower.includes("selamat sore") ||
    lower.includes("selamat malam") ||
    lower.includes("permisi")
  ) {
    return {
      reply: "Waalaikumsalam / Halo! Selamat datang di Yayasan Generasi Cerdas Beraksi (GEN-CB). 😊\n\nAda yang bisa saya bantu? Anda bisa tanyakan seputar:\n1. 📖 Pendaftaran MTQ & Lomba\n2. 🏃‍♂️ Program Jalan Sehat (Rutin 2 Mingguan)\n3. 🏓 Turnamen Tenis Meja & Olahraga\n4. 🎓 Rumah Belajar & Bimbingan Gratis\n5. 🤲 Program Donasi & Beasiswa\n6. 📍 Alamat & Kontak Sekretariat\n\nAtau ketik **'chat admin'** jika ingin tersambung ke WhatsApp Admin.",
      redirectWa: false,
    };
  }

  // MTQ & Keagamaan
  if (lower.includes("mtq") || lower.includes("quran") || lower.includes("tilawah") || lower.includes("adzan") || lower.includes("murottal") || lower.includes("hifdzil")) {
    return {
      reply: "📖 **MTQ Desa Sasak Panjang 2026**\n\n• **Cabang Lomba**: Tilawah Al-Qur'an, Hifdzil Qur'an (Juz 30), Murottal, dan Adzan (Kategori Anak & Remaja).\n• **Lokasi**: Masjid Jami Al-Ikhlas, Desa Sasak Panjang.\n• **Waktu**: 12 September 2026 (Pukul 07.00 WIB - Selesai).\n• **Biaya Pendaftaran**: 100% GRATIS!\n• **Fasilitas**: Trophy/Piala, Piagam Sertifikat Resmi, dan Uang Pembinaan.\n\nAnda dapat mendaftar online melalui menu **Event** pada website kami. Mau bertanya langsung ke panitia? Ketik **'chat admin'**.",
      redirectWa: false,
    };
  }

  // Jalan Sehat
  if (lower.includes("jalan") || lower.includes("sehat") || lower.includes("jalan santai") || lower.includes("2 minggu")) {
    return {
      reply: "🏃‍♂️ **Program Jalan Sehat (Rutin 2 Minggu Sekali)**\n\n• **Jadwal**: Setiap hari Minggu (2 minggu sekali) pukul 06.00 WIB.\n• **Titik Kumpul**: Lapangan / Alun-Alun Desa Sasak Panjang.\n• **Peserta**: Terbuka gratis untuk seluruh warga desa, keluarga, & pemuda.\n• **Benefit**: Olahraga santai bersama, doorprize menarik, & kupon sembako.\n\nSilakan langsung datang ke lokasi saat pelaksanaan atau tanyakan admin via WhatsApp!",
      redirectWa: false,
    };
  }

  // Tenis Meja & Olahraga
  if (lower.includes("tenis") || lower.includes("meja") || lower.includes("pingpong") || lower.includes("sport") || lower.includes("liga")) {
    return {
      reply: "🏓 **GEN-CB Sport Community & Turnamen Tenis Meja**\n\n• **Kegiatan**: Latihan rutin dan turnamen tenis meja antar-warga.\n• **Lokasi**: Balai Warga & Sekretariat GEN-CB Desa Sasak Panjang.\n• **Peserta**: Pemuda, dewasa, dan pencinta olahraga tenis meja.\n• **Pendaftaran**: Terbuka secara berkala melalui menu Event.",
      redirectWa: false,
    };
  }

  // Rumah Belajar & Pendidikan
  if (lower.includes("belajar") || lower.includes("rumah belajar") || lower.includes("pendidikan") || lower.includes("les") || lower.includes("kursus") || lower.includes("sekolah")) {
    return {
      reply: "🎓 **Program Rumah Belajar Generasi**\n\n• **Layanan**: Bimbingan belajar gratis (Matematika, Bahasa Inggris, Membaca & Mengaji) untuk anak SD–SMA.\n• **Siswa Aktif**: 300+ siswa didampingi relawan pengajar mahasiswa.\n• **Jadwal**: Setiap Selasa & Kamis sore serta Sabtu pagi.\n• **Biaya**: 100% GRATIS untuk seluruh warga desa.",
      redirectWa: false,
    };
  }

  // Donasi & Beasiswa
  if (lower.includes("donasi") || lower.includes("beasiswa") || lower.includes("zakat") || lower.includes("infaq") || lower.includes("sedekah") || lower.includes("rekening") || lower.includes("qris")) {
    return {
      reply: "🤲 **Program Donasi & Beasiswa Anak Desa**\n\n• **Pilar Penyaluran**: Operasional Rumah Belajar, Beasiswa Yatim & Dhuafa, serta Paket Sembako.\n• **Metode Donasi**: Transfer Bank Resmi & QRIS Instant.\n• **Transparansi**: Donasi tercatat otomatis dan dapat dipantau di menu Donasi.\n\nTerima kasih atas kebaikan Anda dalam mendukung pendidikan dan sosial anak-anak desa!",
      redirectWa: false,
    };
  }

  // Relawan / Gabung Panitia
  if (lower.includes("relawan") || lower.includes("volunteer") || lower.includes("gabung") || lower.includes("pengajar") || lower.includes("panitia")) {
    return {
      reply: "🤝 **Bergabung Menjadi Relawan GEN-CB**\n\nKami sangat terbuka menerima relawan pengajar Rumah Belajar, relawan dokumentasi, maupun panitia event kepemudaan.\n\nSilakan isi form relawan via website atau ketik **'chat admin'** untuk mendaftar via WhatsApp Pengurus.",
      redirectWa: false,
    };
  }

  // Lokasi & Alamat Kontak
  if (lower.includes("lokasi") || lower.includes("alamat") || lower.includes("mana") || lower.includes("dimana") || lower.includes("sekretariat") || lower.includes("telepon") || lower.includes("nomor")) {
    return {
      reply: "📍 **Lokasi & Alamat Sekretariat GEN-CB**\n\n• **Alamat**: Jl. Raya Sasak Panjang No. 12, Desa Sasak Panjang, Kec. Tajurhalang, Kab. Bogor, Jawa Barat 16320.\n• **WhatsApp Admin**: +62 857-7220-2454\n• **Email Resmi**: halo@gencb.or.id\n• **Jam Operasional**: Senin – Sabtu (08.00 – 17.00 WIB)",
      redirectWa: false,
    };
  }

  // Biaya Pendaftaran
  if (lower.includes("biaya") || lower.includes("bayar") || lower.includes("harga") || lower.includes("gratis")) {
    return {
      reply: "💡 **Informasi Biaya**\n\nHampir seluruh kegiatan GEN-CB (seperti MTQ Desa, Program Jalan Sehat, dan Rumah Belajar) adalah **100% GRATIS** alias tanpa dipungut biaya apapun! Untuk event khusus turnamen, biaya kontribusi tertera di detail event.",
      redirectWa: false,
    };
  }

  // Default fallback response
  return {
    reply: `Terima kasih atas pertanyaannya: "${userText}" 😊\n\nSaya Asisten AI Virtual GEN-CB. Saya dapat menginfokan seputar **MTQ, Jalan Sehat, Tenis Meja, Rumah Belajar, Donasi, atau Alamat Sekretariat**.\n\nJika Anda ingin bertanya sesuatu yang spesifik langsung kepada pengurus yayasan, silakan ketik **'chat admin'** atau klik tombol **Chat Admin WA** di bawah ini.`,
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
    }, 450);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 font-sans select-none print:hidden">
      {/* AI Chat Window */}
      {isOpen && (
        <div className="w-[330px] sm:w-[380px] h-[480px] rounded-3xl border border-border bg-card text-card-foreground shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 backdrop-blur-md">
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
                  <Sparkles className="size-3 text-emerald-300" /> Jawab Otomatis & Alih ke WA Admin
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
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
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
                <span className="italic text-[11px]">Asisten AI sedang berpikir...</span>
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
