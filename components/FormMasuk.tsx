"use client";

import { useActionState, useEffect, useState } from "react";
import { masuk, type HasilMasuk } from "@/app/login/actions";

export default function FormMasuk({ dari }: { dari: string }) {
  const [hasil, kirim, sedangKirim] = useActionState<HasilMasuk, FormData>(
    masuk,
    { pesan: "" },
  );

  const [sisaDetik, setSisaDetik] = useState(0);
  const [batasWaktu, setBatasWaktu] = useState<number | null>(null);

  // 1. Mengambil waktu tunggu dari pesan server
  useEffect(() => {
    if (!hasil?.pesan) return;

    const match = hasil.pesan.match(/dalam (\d+) detik/);

    if (match) {
      const detik = parseInt(match[1], 10);

      setBatasWaktu(Date.now() + detik * 1000);
    }
  }, [hasil]);

  // 2. Menjalankan countdown secara otomatis setiap detik
  useEffect(() => {
    if (batasWaktu === null) return;

    const hitungMundur = () => {
      const selisih = Math.max(0, Math.ceil((batasWaktu - Date.now()) / 1000));

      setSisaDetik(selisih);

      if (selisih === 0) {
        setBatasWaktu(null);
      }
    };

    // Langsung perbarui angka
    hitungMundur();

    // Perbarui setiap 1 detik
    const timer = setInterval(hitungMundur, 1000);

    return () => clearInterval(timer);
  }, [batasWaktu]);

  const dikunci = sedangKirim || sisaDetik > 0;

  return (
    <form
      action={kirim}
      className="mx-auto max-w-sm space-y-3 rounded-xl border bg-white p-6"
    >
      <h1 className="text-xl font-bold">Masuk Admin</h1>

      <input type="hidden" name="dari" value={dari} />

      <input
        type="password"
        name="sandi"
        placeholder="Kata sandi"
        disabled={dikunci}
        className="block w-full rounded border px-3 py-2 disabled:bg-slate-100 disabled:cursor-not-allowed"
      />

      {hasil.pesan && (
        <p className="text-sm text-red-600">
          {sisaDetik > 0
            ? `Terlalu banyak percobaan salah. Coba lagi dalam ${sisaDetik} detik.`
            : hasil.pesan}
        </p>
      )}

      <button
        disabled={dikunci}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sedangKirim
          ? "Memeriksa..."
          : sisaDetik > 0
            ? `Tunggu (${sisaDetik}s)`
            : "Masuk"}
      </button>
    </form>
  );
}
