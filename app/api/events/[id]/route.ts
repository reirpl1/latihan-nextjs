import { NextResponse } from "next/server";
import { ambilEvent } from "@/data/ambil";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  const params = await context.params;
  const eventId = Number(params.id);
  const event = await ambilEvent(eventId);

  if (!event) {
    return NextResponse.json(
      { pesan: "Event tidak ditemukan" },
      { status: 404 },
    );
  }

  return NextResponse.json(event);
}
