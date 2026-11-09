"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Event } from "@/data/events";
import { rupiah } from "@/data/events";

export default function DaftarFavorit() {
  const [semua, setSemua] = useState<Event[]>([]);
  const [ids, setIds] = useState<number[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState("");

  useEffect(() => {
    //eslint-disable-next-line react-hooks/set-state-in-effect
    setIds(JSON.parse(localStorage.getItem("favorit") ?? "[]"));
    fetch("/api/events")
      .then((r) => {
        if (!r.ok) throw new Error("Gagal mengambil data");
        return r.json();
      })
      .then((d: Event[]) => setSemua(d))
      .catch((e: Error) => setGalat(e.message))
      .finally(() => setMemuat(false));
  }, []);

  if (memuat) return <p>Memuat...</p>;
  if (galat) return <p className="text-red-600">{galat}</p>;

  const daftar = semua.filter((e) => ids.includes(e.id));
  if (daftar.length === 0)
    return <p className="text-slate-500">Belum ada favorit</p>;

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {daftar.map((e) => (
        <li
          key={e.id}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <Link href={`/event/${e.id}`} className="block">
            <h3 className="font-semibold text-slate-800 text-lg mb-2">
              {e.judul}
            </h3>

            <p className="text-blue-600 font-bold">{rupiah(e.harga)}</p>

            <p className="text-sm text-slate-500 mt-3">Lihat detail event →</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
