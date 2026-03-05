import { NextResponse } from "next/server";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();

  if (website) {
    return NextResponse.redirect(new URL("/contact-us?sent=1", request.url));
  }

  const invalid =
    !name ||
    name.length < 2 ||
    !isValidEmail(email) ||
    !subject ||
    subject.length < 4 ||
    !message ||
    message.length < 20;

  if (invalid) {
    return NextResponse.redirect(new URL("/contact-us?error=1", request.url));
  }

  return NextResponse.redirect(new URL("/contact-us?sent=1", request.url));
}
