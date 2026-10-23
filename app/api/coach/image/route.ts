import { NextResponse } from "next/server";
export async function GET() { return NextResponse.json({ enabled: false }); }
export async function POST() { return NextResponse.json({ success: false, isGenerated: false, error: "Image generation is not available in this release." }, { status: 503 }); }
