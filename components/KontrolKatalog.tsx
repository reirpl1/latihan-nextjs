"use client";

type KontrolKatalogProps = {
  cari: string;
  setCari: (val: string) => void;
  kategori: string;
  setKategori: (val: string) => void;
  urut: string;
  setUrut: (val: string) => void;
  hanyaAdaTiket: boolean;
  setHanyaAdaTiket: (val: boolean) => void;
  hargaMaksimal: string;
  setHargaMaksimal: (val: string) => void;
  daftarKategori: string[];
};

export default function KontrolKatalog({
  cari,
  setCari,
  kategori,
  setKategori,
  urut,
  setUrut,
  hanyaAdaTiket,
  setHanyaAdaTiket,
  hargaMaksimal,
  setHargaMaksimal,
  daftarKategori,
}: KontrolKatalogProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <input
        value={cari}
        onChange={(e) => setCari(e.target.value)}
        placeholder="Cari event."
        className="rounded border bg-white px-3 py-2"
      />
      <select
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
        className="rounded border bg-white px-3 py-2"
      >
        {daftarKategori.map((k) => (
          <option key={k}>{k}</option>
        ))}
      </select>
      <select
        value={urut}
        onChange={(e) => {
          setUrut(e.target.value);
          localStorage.setItem("urut", e.target.value);
        }}
        className="rounded border bg-white px-3 py-2"
      >
        <option value="tanggal">Tanggal terdekat</option>
        <option value="murah">Harga termurah</option>
        <option value="mahal">harga termahal</option>
        <option value="nama">nama A-Z</option>
      </select>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={hanyaAdaTiket}
          onChange={(e) => setHanyaAdaTiket(e.target.checked)}
        />
        Hanya yang masih ada tiket
      </label>

      <input
        type="number"
        value={hargaMaksimal}
        onChange={(e) => setHargaMaksimal(e.target.value)}
        placeholder="Harga maksimal"
        className="rounded border bg-white px-3 py-2 w-40"
      />
    </div>
  );
}
