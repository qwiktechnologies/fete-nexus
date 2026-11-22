import { NextResponse } from "next/server";
import { createContactEnquiry } from "@/lib/enquiries";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send JSON with the enquiry fields." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const result = await createContactEnquiry({
    fullName: String(data.fullName ?? ""),
    email: String(data.email ?? ""),
    phone: data.phone != null ? String(data.phone) : "",
    serviceRequired: String(data.serviceRequired ?? ""),
    collectionPostcode: data.collectionPostcode != null ? String(data.collectionPostcode) : "",
    deliveryPostcode: data.deliveryPostcode != null ? String(data.deliveryPostcode) : "",
    message: String(data.message ?? ""),
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  return NextResponse.json({ ok: true, reference: result.reference, id: result.id }, { status: 201 });
}