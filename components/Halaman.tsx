import Link from "next/link";
import { alamatHalaman } from "@/data/saring";

interface HalamanProps {
  s: any;
  hal: number;
  jumlah: number;
}

export default function Halaman({ s, hal, jumlah }: HalamanProps) {
  if (jumlah <= 1) {
    return null;
  }

  const adaSebelumnya = hal > 1;
  const adaBerikutnya = hal < jumlah;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {adaSebelumnya && (
        <Link
          href={alamatHalaman(s, hal - 1)}
          className="px-3 py-1 border rounded text-sm hover:bg-slate-100"
        >
          &laquo; Sebelumnya
        </Link>
      )}

      {Array.from({ length: jumlah }, (_, i) => i + 1).map((nomor) => {
        const aktif = nomor === hal;
        return (
          <Link
            key={nomor}
            href={alamatHalaman(s, nomor)}
            className={`px-3 py-1 border rounded text-sm ${
              aktif
                ? "bg-blue-600 text-white font-bold border-blue-600"
                : "hover:bg-slate-100"
            }`}
          >
            {nomor}
          </Link>
        );
      })}

      {adaBerikutnya && (
        <Link
          href={alamatHalaman(s, hal + 1)}
          className="px-3 py-1 border rounded text-sm hover:bg-slate-100"
        >
          Berikutnya &raquo;
        </Link>
      )}
    </div>
  );
}
