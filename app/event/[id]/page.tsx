import { notFound } from "next/navigation";
import Link from "next/link"; // 1. Impor Link dari next/link
import { events, rupiah } from "@/data/events";
import FormPesan from "@/components/FormPesan";
import TombolFavorit from "@/components/TombolFavorit";

export default async function Detail({ params }: PageProps<"/event/[id]">) {
  const { id } = await params;
  const event = events.find((e) => e.id === Number(id));
  if (!event) notFound();

  // 2. Cari event lain yang kategorinya sama (id tidak boleh sama dengan event yang dibuka)
  const eventTerkait = events.filter(
    (e) => e.kategori === event.kategori && e.id !== event.id,
  );

  const sisa = event.kuota - event.terisi;

  return (
    <article className="rounded-xl border bg-white p-6">
      <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
        {event.kategori}
      </span>
      <h1 className="mt-2 text-3xl font-bold">{event.judul} </h1>
      <p className="mt-2 text-slate-500">
        {event.tanggal} . {event.lokasi}
      </p>
      <p className="mt-4 text-xl font-semibold">{rupiah(event.harga)}</p>
      <p className="text-slate-600">
        Sisa {sisa} dari {event.kuota} tiket
      </p>
      <TombolFavorit id={event.id} />
      <FormPesan event={event} />

      {/* 3. Tampilkan Bagian Event Terkait di Bawah Formulir */}
      <section className="mt-8 border-t pt-4">
        <h2 className="text-xl font-bold mb-3">Event terkait</h2>
        {eventTerkait.length > 0 ? (
          <ul className="space-y-2">
            {eventTerkait.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/event/${item.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {item.judul}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Belum ada event terkait.</p>
        )}
      </section>
    </article>
  );
}
