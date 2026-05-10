"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getcookies } from "@/lib/cookies";
import { toast } from "sonner";

// Kita minta ID barang lewat props
export function EditProductForm({ idBarang }: { idBarang: string }) {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [stok, setStok] = useState("");
  const [harga, setHarga] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // --- (OPSIONAL) Ambil data lama dulu agar input tidak kosong saat dibuka ---
  // Jika API-mu mendukung get detail barang, kamu bisa pakai useEffect di sini
  // --------------------------------------------------------------------------

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getcookies("token");
      
      // DISINI TEMPAT KODE YANG KAMU TANYAKAN TADI:
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/updatebarang/${idBarang}`;
      
      const formData = new FormData();
      formData.append("nama_barang", nama);
      formData.append("deskripsi", deskripsi);
      formData.append("stok", stok);
      formData.append("harga", harga);
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(url, {
        method: "POST", // Sesuai instruksi di Postman kamu pakai POST
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok || responseData.status === false) {
        toast.error(responseData.message || "Gagal mengupdate produk");
        return;
      }

      toast.success("Produk berhasil diperbarui!");
      router.push("/admin/product");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat mengupdate data.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Product ID: {idBarang}</CardTitle>
        <CardDescription>Ubah data barang di bawah ini.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Nama Barang</FieldLabel>
              <Input value={nama} onChange={(e) => setNama(e.target.value)} required />
            </Field>
            <Field>
              <FieldLabel>Deskripsi</FieldLabel>
              <Input value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} required />
            </Field>
            <Field>
              <FieldLabel>Stok</FieldLabel>
              <Input type="number" value={stok} onChange={(e) => setStok(e.target.value)} required />
            </Field>
            <Field>
              <FieldLabel>Harga (Rp)</FieldLabel>
              <Input type="number" value={harga} onChange={(e) => setHarga(e.target.value)} required />
            </Field>
            <Field>
              <FieldLabel>Gambar Baru (Kosongkan jika tidak ingin diubah)</FieldLabel>
              <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
            </Field>
            <Button type="submit" disabled={loading} className="mt-4">
              {loading ? "Menyimpan..." : "Update Produk"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}