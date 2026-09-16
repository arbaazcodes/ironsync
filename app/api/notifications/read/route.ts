import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminUser } from "@/lib/security/adminAuth";
import { MEMBER_COOKIE_NAME, verifyMemberSessionToken } from "@/lib/security/memberSession";
import { markNotificationRead } from "@/lib/services/notificationService";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { id, all } = body;

    // 1. Check Admin
    const admin = await getAdminUser();
    if (admin) {
      await markNotificationRead({
        id,
        all: !!all,
        audience: "admin",
      });
      return NextResponse.json({ success: true });
    }

    // 2. Check Member
    const cookieStore = await cookies();
    const token = cookieStore.get(MEMBER_COOKIE_NAME)?.value;
    if (token) {
      const payload = verifyMemberSessionToken(token);
      if (payload) {
        await markNotificationRead({
          id,
          all: !!all,
          audience: "member",
          memberUuid: payload.id,
        });
        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json(
      { error: "Unauthorized. Authentication required." },
      { status: 401 }
    );
  } catch (err: any) {
    console.error("POST /api/notifications/read error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to mark notification read" },
      { status: 500 }
    );
  }
}
