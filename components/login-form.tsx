"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
// Import fungsi setcoookies buatanmu
import { setcoookies } from "@/lib/cookies" 

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("") 

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      if (!email || !password) {
        setError("Please fill in all fields.")
        return
      }
      
      setError("")
      const url = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/auth/login`
      const payload = { email, password }
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
      })
      
      const responseData = await response.json()
      if (!response.ok) {
        setError(responseData?.message as string || "Login failed.")
        return
      }
      
      // LOGIC PENYIMPANAN TOKEN DITAMBAHKAN DI SINI
      // Cek apakah token ada di responseData.token atau responseData.data.token
      // Disesuaikan dengan struktur API backend kamu
      // LOGIC PENYIMPANAN TOKEN DITAMBAHKAN DI SINI
      const token = responseData.token || responseData.data?.token;
      
      // Ambil role dari response API (sesuaikan dengan struktur JSON dari backend-mu)
      const role = responseData.role || responseData.data?.role || responseData.user?.role;

      if (token) {
        await setcoookies("token", token);
        console.log("Login success & Token saved! Role:", role);
        
        // Pengecekan Role
        if (role === "admin") {
          router.push("/admin/product");
        } else {
          // Arahkan ke halaman user biasa (sesuaikan nama foldernya jika beda)
          router.push("/user/dashboard"); 
        }
      } else {
        setError("Login failed: Token not received.");
      }
      
      console.log("Response data:", responseData);
    
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login.")
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleLogin}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        
        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit">Login</Button>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </FieldGroup>
    </form>
  )
}