import { Sidebar } from "@/components/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-50/50 dark:bg-zinc-900/50">
      {/* Panggil komponen Sidebar di sisi kiri */}
      <Sidebar />
      
      {/* Konten utama (halaman-halaman admin) ditaruh di sebelah kanan.
        Kita beri margin-left (ml-64) sebesar lebar sidebar agar kontennya tidak tertutup sidebar.
      */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}