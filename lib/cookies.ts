"use server";

import { get } from "https";
import { cookies } from "next/headers";

export async function setcoookies(
    label: string,
    value: string
) {
    (await cookies()).set(label, value, { httpOnly: true, maxAge: 60 * 60 * 24 * 30 });
}

export async function getcookies(label: string) {
    return (await cookies()).get(label)?.value || ""
}

export async function removecookies(label: string) {
    (await cookies()).delete(label);
}
export async function parseResponseMessage(msg: any) {
    if (!msg) return ""; return typeof msg === "string" ? msg : Object.values(msg).join(",")
}
