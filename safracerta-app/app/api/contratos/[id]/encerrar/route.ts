import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  const body = await request.json();
  const { motivo, data_encerramento } = body as { motivo: string; data_encerramento?: string };

  if (!motivo) {
    return NextResponse.json({ error: "Informe o motivo do encerramento antecipado." }, { status: 400 });
  }

  const { error } = await supabase
    .from("contratos")
    .update({
      status: "encerrado",
      motivo_encerramento: motivo,
      data_encerramento: data_encerramento || new Date().toISOString().slice(0, 10),
    })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
