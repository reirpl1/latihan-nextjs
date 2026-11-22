"use client";

import { useActionState, useEffect, useState } from "react";
import { masuk, type HasilMasuk } from "@/app/login/actions";

export default function FormMasuk({ dari }: { dari: string }) {
  const [hasil, kirim, sedangKirim] = useActionState<HasilMasuk, FormData>(
    masuk,
    { pesan: "" },
  );

  const [sisaDetik, setSisaDetik] = useState(0);
  const [durasiTunggu, setDurasiTunggu] = useState<number | null>(null);
  const [hasilSebelumnya, setHasilSebelumnya] = useState(hasil);

  // 1. Ambil angka detiknya saja saat render (murni tanpa Date.now)
  if (hasil !== hasilSebelumnya) {
    setHasilSebelumnya(hasil);

    if (hasil?.pesan) {
      const match = hasil.pesan.match(/dalam (\d+) detik/);

      if (match) {
        setDurasiTunggu(parseInt(match[1], 10));
      }
    }
  }

  // 2. Hitung Date.now() dan jalankan countdown di dalam useEffect
  useEffect(() => {
    if (durasiTunggu === null) return;

    const batasWaktu = Date.now() + durasiTunggu * 1000;

    const hitungMundur = () => {
      const selisih = Math.max(0, Math.ceil((batasWaktu - Date.now()) / 1000));
      setSisaDetik(selisih);

      if (selisih === 0) {
        setDurasiTunggu(null);
      }
    };

    hitungMundur();
    const timer = setInterval(hitungMundur, 1000);

    return () => clearInterval(timer);
  }, [durasiTunggu]);

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
