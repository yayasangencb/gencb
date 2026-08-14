import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { UploadCloud, X, Image as ImageIcon, Link as LinkIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ImageDropzoneProps {
  value?: string | undefined;
  onChange: (value: string) => void;
  label?: string | undefined;
  error?: string | undefined;
  disabled?: boolean | undefined;
  placeholder?: string | undefined;
}

export function ImageDropzone({
  value,
  onChange,
  label = "Unggah Gambar",
  error,
  disabled = false,
  placeholder = "Seret & lepas foto di sini, atau klik untuk memilih berkas",
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Hanya berkas gambar (JPG, PNG, WEBP, GIF, SVG) yang diperbolehkan.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFileSelect(dropped);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const picked = e.target.files[0];
      if (picked) handleFileSelect(picked);
    }
  };

  const handleApplyUrl = () => {
    if (urlDraft.trim()) {
      onChange(urlDraft.trim());
      setShowUrlInput(false);
      setUrlDraft("");
    }
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative group overflow-hidden rounded-xl border border-border bg-card p-2">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted/40 flex items-center justify-center">
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // If image fails to load as direct URL, display icon fallback
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="rounded-full h-8 px-3 text-xs gap-1.5 shadow-md"
                onClick={() => fileInputRef.current?.click()}
              >
                <RefreshCw className="size-3.5" /> Ganti
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="rounded-full h-8 px-3 text-xs gap-1.5 shadow-md"
                onClick={() => onChange("")}
              >
                <X className="size-3.5" /> Hapus
              </Button>
            </div>
          </div>
          <div className="p-2 flex items-center justify-between text-xs text-muted-foreground truncate">
            <span className="truncate max-w-[200px]" title={value}>
              {value.startsWith("data:") ? "Berkas diunggah (Base64)" : value}
            </span>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-primary hover:underline flex items-center gap-1 font-medium"
            >
              <LinkIcon className="size-3" /> Input URL
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !showUrlInput && fileInputRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center p-6 text-center rounded-xl border-2 border-dashed transition-all cursor-pointer select-none",
            isDragging
              ? "border-primary bg-primary/10 scale-[1.01] shadow-lg"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30 bg-card",
            disabled && "opacity-50 cursor-not-allowed",
            error && "border-destructive bg-destructive/5"
          )}
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3 transition-transform group-hover:scale-110">
            {isDragging ? (
              <UploadCloud className="size-6 animate-bounce" />
            ) : (
              <ImageIcon className="size-6" />
            )}
          </div>

          <p className="text-sm font-semibold text-foreground mb-1">{label}</p>
          <p className="text-xs text-muted-foreground max-w-xs">{placeholder}</p>
          <p className="text-[10px] text-muted-foreground/70 mt-2 font-medium">
            Mendukung JPG, PNG, WEBP, GIF, SVG (seret berkas langsung ke sini)
          </p>

          <div className="mt-3 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Pilih Berkas
            </Button>
            <span className="text-xs text-muted-foreground">atau</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs rounded-full text-primary"
              onClick={(e) => {
                e.stopPropagation();
                setShowUrlInput(!showUrlInput);
              }}
            >
              <LinkIcon className="size-3 mr-1" /> Pakai URL
            </Button>
          </div>
        </div>
      )}

      {showUrlInput && (
        <div className="p-3 border border-border rounded-xl bg-muted/20 space-y-2 text-xs">
          <p className="font-medium text-foreground">Masukkan URL Gambar / Nama Berkas</p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="https://... atau nama-berkas.jpg"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              className="h-8 text-xs"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyUrl())}
            />
            <Button type="button" size="sm" className="h-8 px-3 text-xs" onClick={handleApplyUrl}>
              Terapkan
            </Button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled}
      />

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
