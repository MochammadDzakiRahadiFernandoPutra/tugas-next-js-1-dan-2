import { CardProduct } from "@/components/card-product";
import { getcookies } from "@/lib/cookies"; 
import { Key } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface Product {
  description: any;
  id: number;
  nama_barang: string;
  deskripsi: string;
  stok: number;
  harga: number;
  image: string;
}

async function getProduct(): Promise<Product[]> {
  try {
    const token = await getcookies("token"); // Memanggil token dari lib/cookies
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/getbarang`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // Pastikan tidak nge-cache agar produk baru langsung muncul
    });

    const responseData = await response.json();
    console.log("Response API:", responseData); // Pesan ini akan muncul di terminal VS Code

    if (!response.ok) {
      return [];
    }
    return responseData?.data as Product[];
  } catch (error) {
    console.log("Error fetch:", error);
    return [];
  }
}

export default async function ProductPage() {
  const products = await getProduct();
  
  return (
    <div className="w-full p-3">
      {/* Header Halaman dengan Judul dan Tombol Add */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Product Page</h1>
        <Button asChild>
          <Link href="/admin/product/add">Add Product</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products && products.length > 0 ? (
          products.map((product) => (
            <CardProduct
              key={product.id as Key}
              id={product.id}
              name={product.nama_barang}
              description={product.deskripsi}
              image={product.image}
              price={product.harga}
            />
          ))
        ) : (
          <p>Tidak ada produk. Pastikan sudah login dan token valid.</p>
        )}
      </div>
    </div>
  );
}