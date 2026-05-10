"use client";

import { useState } from "react";
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
import { getcookies } from "@/lib/cookies"; // Bisa dipanggil di client component Next.js terbaru
import { toast } from "sonner";

export function AddProductForm() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [stok, setStok] = useState("");
  const [harga, setHarga] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getcookies("token");
      if (!token) {
        toast.error("Anda belum login!");
        return;
      }

      // CATATAN: Pastikan endpoint API ini sesuai dengan buatan backend kamu.
      // Karena get-nya /admin/getbarang, saya asumsikan post-nya /admin/insertbarang
const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/insertbarang`;

      const formData = new FormData();
      formData.append("nama_barang", nama);
      formData.append("deskripsi", deskripsi);
      formData.append("stok", stok);
      formData.append("harga", harga);
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Jangan tambahkan "Content-Type": "multipart/form-data" di sini!
          // Browser akan otomatis menambahkannya bersama boundary jika pakai FormData.
        },
        body: formData, 
      });

      const responseData = await response.json();

      if (!response.ok || responseData.status === false) {
        toast.error(responseData.message || "Gagal menambah produk");
        return;
      }

      toast.success("Produk berhasil ditambahkan!");
      router.push("/admin/product");
      router.refresh(); // Memaksa halaman produk me-refresh cache data terbarunya
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
        <CardDescription>Masukkan detail barang baru di bawah ini.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Nama Barang</FieldLabel>
              <Input
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
                placeholder="Misal: Sepatu Nike"
              />
            </Field>
            <Field>
              <FieldLabel>Deskripsi</FieldLabel>
              <Input
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                required
                placeholder="Deskripsi singkat produk"
              />
            </Field>
            <Field>
              <FieldLabel>Stok</FieldLabel>
              <Input
                type="number"
                value={stok}
                onChange={(e) => setStok(e.target.value)}
                required
                placeholder="10"
              />
            </Field>
            <Field>
              <FieldLabel>Harga (Rp)</FieldLabel>
              <Input
                type="number"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                required
                placeholder="150000"
              />
            </Field>
            <Field>
              <FieldLabel>Gambar Produk</FieldLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                required
              />
            </Field>
            <Button type="submit" disabled={loading} className="mt-4">
              {loading ? "Menyimpan..." : "Simpan Produk"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}