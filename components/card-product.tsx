"use client"; 

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { getcookies } from "@/lib/cookies";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
};

export function CardProduct(props: Props) {
  const router = useRouter();

  async function handleDelete() {
    // Tampilkan konfirmasi sebelum menghapus
    if (!confirm(`Yakin ingin menghapus ${props.name}?`)) return;

    try {
      const token = await getcookies("token");
      
      // CATATAN: Pastikan URL /admin/deletebarang/ ini sesuai dengan backend kamu!
      // Bisa jadi namanya /admin/hapusbarang atau /admin/destroy
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/deletebarang/${props.id}`;
      
      const response = await fetch(url, {
        method: "DELETE", // Pastikan method-nya DELETE (atau POST jika backend minta POST)
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Barang berhasil dihapus!");
        router.refresh(); // Otomatis me-refresh data di halaman
      } else {
        toast.error("Gagal menghapus barang.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Terjadi kesalahan sistem.");
    }
  }

  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0 flex flex-col justify-between">
      <div>
        <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGINE}/${props.image}`}
          width={500}
          height={500}
          priority
          alt={props.name}
          className="relative z-20 aspect-video w-full object-cover"
        />
        <CardHeader>
          <CardAction>
            <Badge variant="secondary">Rp {props.price}</Badge>
          </CardAction>
          <CardTitle>{props.name}</CardTitle>
          <CardDescription>{props.description}</CardDescription>
        </CardHeader>
      </div>
      
      {/* Tombol Edit dan Hapus dibuat bersebelahan */}
      <CardFooter className="flex gap-2">
        <Button className="flex-1" variant="outline" asChild>
          <Link href={`/admin/product/edit/${props.id}`}>Edit</Link>
        </Button>
        <Button className="flex-1" variant="destructive" onClick={handleDelete}>
          Hapus
        </Button>
      </CardFooter>
    </Card>
  );
}