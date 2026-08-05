import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Facebook, Link2, MessageCircle, Twitter } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/site/reveal";
import {
  fetchApprovedComments,
  fetchNewsBySlug,
  formatDateId,
  submitComment,
} from "@/lib/cloud/public-data";

export const Route = createFileRoute("/berita/$slug")({
  head: ({ params }) => {
    const title = `Berita ${params.slug.replace(/-/g, " ")} — GEN-CB`;
    const description = "Berita dan pengumuman Yayasan Generasi Cerdas Beraksi (GEN-CB).";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: BeritaDetail,
});

function BeritaDetail() {
  const { slug } = Route.useParams();
  const queryClient = useQueryClient();
  const { data: article, isLoading } = useQuery({
    queryKey: ["news", slug],
    queryFn: () => fetchNewsBySlug(slug),
  });
  const { data: comments = [] } = useQuery({
    queryKey: ["news-comments", article?.id],
    queryFn: () => fetchApprovedComments(article!.id),
    enabled: Boolean(article?.id),
  });

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  if (isLoading) {
    return <div className="py-40 text-center text-sm text-muted-foreground">Memuat artikel...</div>;
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-md px-4 py-40 text-center">
        <h1 className="font-display text-2xl font-bold">Artikel tidak ditemukan</h1>
        <Button asChild variant="hero" className="mt-6">
          <Link to="/berita">Kembali ke Berita</Link>
        </Button>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const published = article.published_at ?? article.created_at;

  const onSubmit = async () => {
    if (!name.trim() || text.trim().length < 3) {
      toast.error("Isi nama dan komentar terlebih dahulu.");
      return;
    }
    setSending(true);
    const ok = await submitComment({ newsId: article.id, name: name.trim(), text: text.trim() });
    setSending(false);
    if (!ok) {
      toast.error("Komentar gagal dikirim, coba lagi.");
      return;
    }
    setName("");
    setText("");
    toast.success("Komentar terkirim dan menunggu moderasi admin.");
    void queryClient.invalidateQueries({ queryKey: ["news-comments", article.id] });
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: article.title,
            datePublished: published,
            articleSection: article.category,
            image: article.cover_image ?? undefined,
            publisher: { "@type": "Organization", name: "Yayasan Generasi Cerdas Beraksi" },
          }),
        }}
      />
      <article className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
        <Link
          to="/berita"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Semua berita
        </Link>
        <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-accent">
          {article.category}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{formatDateId(published)}</p>

        {article.cover_image ? (
          <img
            src={article.cover_image}
            alt={article.title}
            width={1200}
            height={800}
            className="mt-8 aspect-[16/9] w-full rounded-3xl object-cover shadow-soft"
          />
        ) : null}

        {article.video_url ? (
          <div className="mt-6 aspect-video overflow-hidden rounded-3xl shadow-soft">
            <iframe
              src={article.video_url}
              title={article.title}
              allowFullScreen
              className="size-full"
            />
          </div>
        ) : null}

        <div className="mt-8 space-y-4 text-base leading-relaxed text-foreground/90">
          {(article.content ?? "").split(/\n{2,}/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {article.tags.length ? (
          <div className="mt-8 flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                #{t}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-2 border-y border-border/60 py-5">
          <span className="text-sm font-medium">Bagikan:</span>
          <Button asChild variant="outline" size="sm">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${article.title} ${shareUrl}`)}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle /> WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
            >
              <Facebook /> Facebook
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noreferrer"
            >
              <Twitter /> X
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void navigator.clipboard.writeText(shareUrl);
              toast.success("Tautan artikel disalin.");
            }}
          >
            <Link2 /> Salin tautan
          </Button>
        </div>

        <Reveal>
          <section className="mt-12">
            <h2 className="font-display text-xl font-bold">Komentar ({comments.length})</h2>
            <div className="mt-5 space-y-3 rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
              />
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tulis komentar..."
                rows={4}
              />
              <Button variant="hero" disabled={sending} onClick={onSubmit}>
                {sending ? "Mengirim..." : "Kirim komentar"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Komentar tampil setelah disetujui admin.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="rounded-2xl border border-border/60 bg-card p-5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{c.name ?? "Anonim"}</span>
                    <span>{formatDateId(c.created_at)}</span>
                  </div>
                  <p className="mt-2 text-sm">{c.comment_text}</p>
                </div>
              ))}
              {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Belum ada komentar. Jadilah yang pertama!
                </p>
              ) : null}
            </div>
          </section>
        </Reveal>
      </article>
    </>
  );
}