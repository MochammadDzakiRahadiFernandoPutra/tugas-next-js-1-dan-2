"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Import useRouter untuk redirect

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter(); // Inisialisasi router

  /** preparing state for each input */
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");

  async function handleregister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Validasi password vs confirm password
    if (password !== confirmPassword) {
      toast.error("Password dan Confirm Password tidak cocok!", {
        className: "bg-red-500 text-white p-2 rounded",
      });
      return;
    }

    try {
      /** prepare request requirement */
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`;
      const payload = new FormData();
      payload.append("name", name);
      payload.append("email", email);
      payload.append("role", role);
      payload.append("password", password);

      /** sending to backend */
      const response = await fetch(url, {
        method: "POST",
        body: payload,
      });

      // CUKUP PANGGIL response.json() SATU KALI SAJA
      const responseData = await response.json();
      console.log(responseData);

      /** handle response data */
      const message: string | { [key: string]: string } =
        typeof responseData?.message === "string"
          ? responseData?.message
          : Object.values(responseData?.message || {}).join(",");
          
      const status: boolean = responseData?.status || false;

      if (!response.ok || !status) {
        toast.error(
          (message as string) || "Registration failed",
          { className: "bg-yellow-500 text-white p-2 rounded" }
        );
        return;
      }

      toast.success(
        (message as string) || "Registration successful",
        { className: `bg-green-500 text-white p-2 rounded` }
      );

      /** redirect to login page */
      router.push("/login"); // Otomatis pindah ke halaman login setelah sukses

    } catch (error) {
      console.log(error);
      toast.error("Registration failed. Please check your connection.", {
        className: `bg-red-500 text-white p-2 rounded`,
      });
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleregister} className="w-full">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                type="text"
                placeholder="John Doe"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="role">Pilih Role</FieldLabel>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input 
                id="confirm-password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} // Tambahkan onChange agar statenya terisi
                type="password" 
                required 
              />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Create Account</Button>
                <Button variant="outline" type="button">
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <a href="/login" className="underline">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}