"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { NAMA_COOKIE, UMUR_SESI, buatToken } from "@/lib/sesi";

export type HasilMasuk = { pesan: string };

const NAMA_COOKIE_UPAYA = "upaya-login";
const MAKS_UPAYA = 5;
const WAKTU_TUNGGU_MS = 60 * 1000; // 1 menit

export async function masuk(
  _sebelum: HasilMasuk,
  formData: FormData,
): Promise<HasilMasuk> {
  const cookieStore = await cookies();
  const sekarang = Date.now();

  // 1. Cek Tantangan 1: Batasi percobaan login
  const cookieUpaya = cookieStore.get(NAMA_COOKIE_UPAYA);
  let dataUpaya = { count: 0, lockUntil: 0 };

  if (cookieUpaya) {
    try {
      dataUpaya = JSON.parse(cookieUpaya.value);
    } catch {
      // Abaikan jika format cookie rusak
    }
  }

  // Jika masih dalam masa hukuman/tunggu
  if (dataUpaya.lockUntil > sekarang) {
    const sisaDetik = Math.ceil((dataUpaya.lockUntil - sekarang) / 1000);
    return {
      pesan: `Terlalu banyak percobaan salah. Coba lagi dalam ${sisaDetik} detik.`,
    };
  }

  const sandi = String(formData.get("sandi") ?? "");
  const dari = String(formData.get("dari") ?? "");

  // 2. Cek Tantangan 2: Bandingkan sandi dengan crypto.timingSafeEqual (Anti Timing Attack)
  const sandiBuffer = Buffer.from(sandi);
  const adminSandiBuffer = Buffer.from(process.env.ADMIN_PASSWORD ?? "");

  const isSandiValid =
    sandiBuffer.length === adminSandiBuffer.length &&
    crypto.timingSafeEqual(sandiBuffer, adminSandiBuffer);

  if (!isSandiValid) {
    // Tambah hitungan percobaan gagal
    dataUpaya.count += 1;

    if (dataUpaya.count >= MAKS_UPAYA) {
      dataUpaya.lockUntil = sekarang + WAKTU_TUNGGU_MS;
      cookieStore.set(NAMA_COOKIE_UPAYA, JSON.stringify(dataUpaya), {
        httpOnly: true,
        path: "/",
        maxAge: 60, // 1 menit
      });
      return {
        pesan: "Terlalu banyak percobaan salah. Dikunci selama 1 menit.",
      };
    }

    // Simpan kembali status upaya ke cookie
    cookieStore.set(NAMA_COOKIE_UPAYA, JSON.stringify(dataUpaya), {
      httpOnly: true,
      path: "/",
      maxAge: 300,
    });

    return {
      pesan: `Kata sandi salah. Sisa percobaan: ${MAKS_UPAYA - dataUpaya.count}`,
    };
  }

  // Jika sandi benar, hapus cookie pembatas upaya login
  cookieStore.delete(NAMA_COOKIE_UPAYA);

  cookieStore.set(NAMA_COOKIE, await buatToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: UMUR_SESI,
  });

  // Alihkan ke halaman tujuan
  redirect(dari.startsWith("/admin") ? dari : "/admin");
}

export async function keluar() {
  (await cookies()).delete(NAMA_COOKIE);
  redirect("/login");
}
