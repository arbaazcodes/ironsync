import { NextResponse } from "next/server";
// Deferred until coaching safety evaluation and authenticated usage controls ship.
export async function GET() { return NextResponse.json({ enabled: false, hasGeminiKey: false }); }
export async function POST() { return NextResponse.json({ success: false, error: "AI coaching is not available in this release." }, { status: 503 }); }
