"use client";

import { hapusEvent } from "@/app/admin/actions";

export function TombolHapus({ id }: { id: number }) {
  return (
    <form
      action={hapusEvent}
      onSubmit={(e) => {
        if (!window.confirm("Apakah kamu yakin ingin menghapus event ini?")) {
          e.preventDefault(); // Membatalkan aksi jika klik "Cancel"
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-red-600 underline">
        Hapus
      </button>
    </form>
  );
}
