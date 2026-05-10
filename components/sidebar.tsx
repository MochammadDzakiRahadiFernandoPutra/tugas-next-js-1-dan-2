"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getcookies } from "@/lib/cookies";
// Jika kamu punya ikon dari lucide-react, bisa di-import di sini. 
// Contoh: import { LayoutDashboard, Package, LogOut } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Daftar menu untuk Admin (bisa disesuaikan)
  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Products", href: "/admin/product", icon: "📦" },
  ];

  async function handleLogout() {
    try {
      const token = await getcookies("token");
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/user/logout`;
      
      await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Hapus token dari cookies browser
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      toast.success("Berhasil logout!");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Gagal logout");
    }
  }

  return (
    <aside className="w-64 h-screen bg-white dark:bg-zinc-950 border-r flex flex-col fixed left-0 top-0">
      {/* Bagian Logo / Judul */}
      <div className="h-16 flex items-center justify-center border-b">
        <h2 className="text-xl font-bold">Toko Online Admin</h2>
      </div>

      {/* Bagian Menu navigasi */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          
          return (
            <Link key={item.name} href={item.href}>
              <span
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? "bg-zinc-100 dark:bg-zinc-800 font-medium" 
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400"
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bagian Tombol Logout di paling bawah */}
      <div className="p-4 border-t">
        <Button 
          variant="destructive" 
          className="w-full flex items-center gap-2" 
          onClick={handleLogout}
        >
          <span>🚪</span> Logout
        </Button>
      </div>
    </aside>
  );
}