import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RequireModule } from "@/components/admin/guard";
import { ResourceManager } from "@/components/admin/resource-manager";
import { seedNotifications, type NotificationRow } from "@/lib/admin/seed";
import { useCollection } from "@/lib/admin/store";

export const Route = createFileRoute("/admin/notifikasi")({
  head: () => ({
    meta: [
      { title: "Kelola Notifikasi — Admin GEN-CB" },
      { name: "description", content: "Kirim broadcast email, WhatsApp, atau push notification kepada peserta." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Kelola Notifikasi — Admin GEN-CB" },
      { property: "og:description", content: "Broadcast pengumuman dan pengingat jadwal." },
    ],
  }),
  component: () => (
    <RequireModule module="notifikasi">
      <NotifikasiAdmin />
    </RequireModule>
  ),
});

function NotifikasiAdmin() {
  const { update } = useCollection<NotificationRow>("notifications", seedNotifications);

  return (
    <ResourceManager<NotificationRow>
      title="Kelola Notifikasi"
      description="Susun pesan broadcast untuk pengumuman, pengingat jadwal, dan update status pendaftaran."
      storageKey="notifications"
      seed={seedNotifications}
      addLabel="Buat Broadcast"
      searchKeys={["title", "audience", "message"]}
      filters={[
        { key: "channel", label: "Kanal", options: ["EMAIL", "WHATSAPP", "PUSH"] },
        { key: "status", label: "Status", options: ["DRAFT", "TERKIRIM"] },
      ]}
      columns={[
        { key: "title", label: "Judul" },
        { key: "channel", label: "Kanal", render: (r) => <Badge variant="secondary">{r.channel}</Badge> },
        { key: "audience", label: "Penerima" },
        { key: "schedule", label: "Jadwal" },
        {
          key: "status",
          label: "Status",
          render: (r) => (
            <Badge variant={r.status === "TERKIRIM" ? "default" : "secondary"}>{r.status}</Badge>
          ),
        },
      ]}
      fields={[
        { key: "title", label: "Judul pesan" },
        { key: "channel", label: "Kanal", type: "select", options: ["EMAIL", "WHATSAPP", "PUSH"] },
        { key: "audience", label: "Segmen penerima" },
        { key: "schedule", label: "Jadwal kirim", type: "date" },
        { key: "status", label: "Status", type: "select", options: ["DRAFT", "TERKIRIM"] },
        { key: "message", label: "Isi pesan", type: "textarea" },
      ]}
      rowActions={(row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            update(row.id, { status: "TERKIRIM" });
            toast.success(`Broadcast "${row.title}" dikirim`);
          }}
        >
          Kirim
        </Button>
      )}
    />
  );
}