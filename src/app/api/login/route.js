import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const form = new URLSearchParams(body).toString();
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
    {
      method: "POST",
      body: form,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const response = await data.json();

  const value = NextResponse.json(response);
  value.cookies.set({
    name: "token",
    value: response?.results?.token,
    path: "/",
  });

  if (!response?.results?.token) {
    return NextResponse.json({ success: false });
  }

  return value;
}
