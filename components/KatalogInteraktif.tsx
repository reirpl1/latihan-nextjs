"use client";
import { useState } from "react";
import { rupiah, type Event } from "@/data/events";
import KartuEvent from "./KartuEvent";
import KontrolKatalog from "./KontrolKatalog";

export default function KatalogInteraktif({ events }: { events: Event[] }) {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [urut, setUrut] = useState("tanggal");
  const [hanyaAdaTiket, setHanyaAdaTiket] = useState(false);
  const [hargaMaksimal, setHargaMaksimal] = useState("");

  const daftarKategori = ["Semua", ...new Set(events.map((e) => e.kategori))];

  const hasil = events.filter((e) => {
    const sisa = e.kuota - e.terisi;
    const cocokCari = e.judul.toLowerCase().includes(cari.toLowerCase());
    const cocokKategori = kategori === "Semua" || e.kategori === kategori;

    if (hanyaAdaTiket && sisa <= 0) {
      return false;
    }
    if (hargaMaksimal !== "" && e.harga > Number(hargaMaksimal)) {
      return false;
    }
    return cocokCari && cocokKategori;
  });

  const tersusun = [...hasil].sort((a, b) => {
    if (urut === "murah") return a.harga - b.harga;
    if (urut === "mahal") return b.harga - a.harga;
    if (urut === "nama") return a.judul.localeCompare(b.judul);
    return a.tanggal.localeCompare(b.tanggal);
  });

  const rataRata =
    tersusun.length > 0
      ? tersusun.reduce((total, e) => total + e.harga, 0) / tersusun.length
      : 0;

  const totalSisaTiket = tersusun.reduce(
    (total, e) => total + (e.kuota - e.terisi),
    0,
  );

  return (
    <div>
      {/* Menggunakan komponen KontrolKatalog yang dipisah */}
      <KontrolKatalog
        cari={cari}
        setCari={setCari}
        kategori={kategori}
        setKategori={setKategori}
        urut={urut}
        setUrut={setUrut}
        hanyaAdaTiket={hanyaAdaTiket}
        setHanyaAdaTiket={setHanyaAdaTiket}
        hargaMaksimal={hargaMaksimal}
        setHargaMaksimal={setHargaMaksimal}
        daftarKategori={daftarKategori}
      />

      <p className="mb-3 text-sm text-slate-500">
        {tersusun.length} event ditemukan
      </p>
      <p className="mb-3 text-sm text-slate-600">
        Rata-rata harga {rupiah(rataRata)} · Total sisa tiket {totalSisaTiket}
      </p>
      {tersusun.length === 0 ? (
        <p className="text-slate-500">Tidak ada event yang sesuai.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tersusun.map((e) => (
            <KartuEvent key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}
