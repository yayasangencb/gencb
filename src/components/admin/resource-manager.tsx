import { useState, type ReactNode } from "react";
import { Copy, Pencil, Plus, Printer, Trash2, FileDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type Column, type TableFilter } from "./data-table";
import { useCollection, type Entity } from "@/lib/admin/store";
import { downloadCsv, printTable } from "@/lib/admin/export";

import { ImageDropzone } from "./image-dropzone";

export type Field = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select" | "date" | "image";
  options?: string[];
  placeholder?: string;
  required?: boolean;
};

export function ResourceManager<T extends Entity>({
  title,
  description,
  storageKey,
  seed,
  columns,
  fields,
  searchKeys,
  filters = [],
  allowDuplicate = false,
  readOnly = false,
  addLabel = "Tambah Data",
  extraToolbar,
  rowActions,
  exportable = false,
}: {
  title: string;
  description?: string;
  storageKey: string;
  seed: T[];
  columns: Column<T>[];
  fields: Field[];
  searchKeys: string[];
  filters?: TableFilter[];
  allowDuplicate?: boolean;
  readOnly?: boolean;
  addLabel?: string;
  extraToolbar?: ReactNode;
  rowActions?: (row: T) => ReactNode;
  exportable?: boolean;
}) {
  const { items, create, update, remove, duplicate } = useCollection<T>(storageKey, seed);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toDelete, setToDelete] = useState<T | null>(null);

  const openForm = (row?: T) => {
    const base: Record<string, string> = {};
    fields.forEach((f) => {
      let value = row ? (row as unknown as Record<string, unknown>)[f.key] : "";
      if (!row && f.key === "status" && !value && f.options) {
        if (f.options.includes("PUBLISH")) value = "PUBLISH";
        else if (f.options.includes("OPEN")) value = "OPEN";
        else if (f.options.includes("AKTIF")) value = "AKTIF";
      }
      base[f.key] = value === undefined || value === null ? "" : String(value);
    });
    setDraft(base);
    setErrors({});
    setEditing(row ?? null);
    setOpen(true);
  };

  const submit = () => {
    const nextErrors: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.required !== false && !String(draft[f.key] ?? "").trim()) {
        nextErrors[f.key] = `${f.label} wajib diisi`;
      }
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      toast.error("Periksa kembali isian form");
      return;
    }
    const payload: Record<string, unknown> = {};
    fields.forEach((f) => {
      payload[f.key] = f.type === "number" ? Number(draft[f.key] ?? 0) : draft[f.key];
    });
    if (editing) {
      update(editing.id, payload as Partial<T>);
      toast.success("Data berhasil diperbarui");
    } else {
      create(payload as Omit<T, "id">);
      toast.success("Data berhasil ditambahkan");
    }
    setOpen(false);
  };

  const exportHeaders = columns.map((c) => ({ key: c.key, label: c.label }));

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {!readOnly ? (
          <Button onClick={() => openForm()} className="rounded-full">
            <Plus className="mr-1 size-4" /> {addLabel}
          </Button>
        ) : null}
      </div>

      <DataTable
        rows={items}
        columns={columns}
        searchKeys={searchKeys}
        filters={filters}
        toolbar={
          <>
            {extraToolbar}
            {exportable ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    downloadCsv(storageKey, items as unknown as Record<string, unknown>[], exportHeaders);
                    toast.success("Export Excel (CSV) diunduh");
                  }}
                >
                  <FileDown className="mr-1 size-4" /> Excel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    printTable(title, items as unknown as Record<string, unknown>[], exportHeaders)
                  }
                >
                  <Printer className="mr-1 size-4" /> Cetak / PDF
                </Button>
              </>
            ) : null}
          </>
        }
        actions={(row) => (
          <>
            {rowActions?.(row)}
            {!readOnly ? (
              <>
                <Button variant="outline" size="icon" className="size-8" onClick={() => openForm(row)}>
                  <Pencil className="size-4" />
                </Button>
                {allowDuplicate ? (
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => {
                      duplicate(row.id);
                      toast.success("Data diduplikat");
                    }}
                  >
                    <Copy className="size-4" />
                  </Button>
                ) : null}
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 text-destructive"
                  onClick={() => setToDelete(row)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </>
            ) : null}
          </>
        )}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit" : "Tambah"} — {title}</DialogTitle>
            <DialogDescription>Lengkapi data berikut lalu simpan perubahan.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div
                key={f.key}
                className={
                  f.type === "textarea" || f.type === "image"
                    ? "sm:col-span-2 space-y-1.5"
                    : "space-y-1.5"
                }
              >
                <Label htmlFor={f.key}>{f.label}</Label>
                {f.type === "image" ? (
                  <ImageDropzone
                    value={draft[f.key] ?? ""}
                    onChange={(val) => setDraft((p) => ({ ...p, [f.key]: val }))}
                    label={f.label}
                    placeholder={f.placeholder}
                    error={errors[f.key]}
                  />
                ) : f.type === "textarea" ? (
                  <Textarea
                    id={f.key}
                    rows={4}
                    value={draft[f.key] ?? ""}
                    placeholder={f.placeholder ?? ""}
                    onChange={(e) => setDraft((p) => ({ ...p, [f.key]: e.target.value }))}
                  />
                ) : f.type === "select" ? (
                  <Select
                    value={draft[f.key] ?? ""}
                    onValueChange={(v) => setDraft((p) => ({ ...p, [f.key]: v }))}
                  >
                    <SelectTrigger id={f.key}>
                      <SelectValue placeholder={`Pilih ${f.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {(f.options ?? []).map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={f.key}
                    type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                    value={draft[f.key] ?? ""}
                    placeholder={f.placeholder ?? ""}
                    onChange={(e) => setDraft((p) => ({ ...p, [f.key]: e.target.value }))}
                  />
                )}
                {f.type !== "image" && errors[f.key] ? (
                  <p className="text-xs font-medium text-destructive">{errors[f.key]}</p>
                ) : null}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button onClick={submit}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus data ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data akan dihapus dari daftar {title.toLowerCase()}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDelete) {
                  remove(toDelete.id);
                  toast.success("Data dihapus");
                }
                setToDelete(null);
              }}
            >
              Ya, hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}