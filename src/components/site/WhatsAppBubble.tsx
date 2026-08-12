import { useState } from "react";
import { MessageCircle, X, Send, CheckCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ADMIN_WA_NUMBER = "6285772202454";
const DEFAULT_PREFIX = "Halo min, saya ingin menanyakan ";

const QUICK_TOPICS = [
  "Pendaftaran MTQ Desa",
  "Program Jalan Sehat 2 Mingguan",
  "Cara Menjadi Relawan",
  "Informasi Donasi & Sponsor",
];

export function WhatsAppBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("Halo min, saya ingin menanyakan ");

  const handleSend = (customMsg?: string) => {
    const textToSend = customMsg || message || DEFAULT_PREFIX;
    const encoded = encodeURIComponent(textToSend.trim());
    window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${encoded}`, "_blank");
  };

  const handleQuickTopic = (topic: string) => {
    const fullText = `Halo min, saya ingin menanyakan seputar ${topic}`;
    setMessage(fullText);
    handleSend(fullText);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 font-sans select-none print:hidden">
      {/* Floating Popup Box */}
      {isOpen && (
        <div className="w-[320px] sm:w-[360px] rounded-2xl border border-emerald-500/20 bg-card text-card-foreground shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 backdrop-blur-md">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-white text-base shadow-inner">
                  GC
                </div>
                <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-400 border-2 border-emerald-700 animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight">Admin GEN-CB</h3>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-100 mt-0.5">
                  <span className="size-1.5 rounded-full bg-emerald-300" />
                  <span>+62 857-7220-2454 (Online)</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Tutup chat"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Body Chat Content */}
          <div className="p-4 space-y-3 bg-muted/20 max-h-[320px] overflow-y-auto">
            <div className="flex flex-col gap-2">
              <div className="bg-background rounded-xl p-3 text-xs text-foreground shadow-xs border border-border/50 max-w-[88%] space-y-1">
                <div className="flex items-center justify-between gap-2 text-[10px] text-emerald-600 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="size-3" /> Layanan Bantuan Fast Response
                  </span>
                </div>
                <p className="leading-relaxed">
                  Halo! 👋 Ada yang bisa kami bantu seputar pendaftaran event, program kegiatan, atau donasi GEN-CB?
                </p>
                <div className="text-[9px] text-muted-foreground text-right flex items-center justify-end gap-1">
                  <span>Sistem Otomatis</span>
                  <CheckCheck className="size-3 text-emerald-500" />
                </div>
              </div>
            </div>

            {/* Quick Topic Chips */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] font-medium text-muted-foreground">Pilih topik cepat:</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleQuickTopic(topic)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all text-left"
                  >
                    + {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Input area */}
            <div className="pt-2 space-y-2">
              <label className="text-[11px] font-medium text-muted-foreground block">
                Format pesan Anda:
              </label>
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Halo min saya ingin menanyakan..."
                  className="text-xs h-9 bg-background shadow-xs focus-visible:ring-emerald-500"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSend())}
                />
                <Button
                  onClick={() => handleSend()}
                  size="icon"
                  className="size-9 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
                  title="Kirim via WhatsApp"
                >
                  <Send className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="px-4 py-2.5 bg-card border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Respon langsung ke WhatsApp Admin</span>
            <button
              onClick={() => handleSend()}
              className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              Buka WA
            </button>
          </div>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
        aria-label="Hubungi Admin GEN-CB via WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex size-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full size-3 bg-emerald-300"></span>
        </span>
        <MessageCircle className="size-6 animate-pulse group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline font-semibold text-xs pr-1">Tanya Admin WA</span>
      </button>
    </div>
  );
}
