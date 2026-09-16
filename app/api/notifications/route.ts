import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminUser } from "@/lib/security/adminAuth";
import { MEMBER_COOKIE_NAME, verifyMemberSessionToken } from "@/lib/security/memberSession";
import { getNotifications } from "@/lib/services/notificationService";

export async function GET(request: Request) {
  try {
    // 1. Check if Admin is authenticated
    const admin = await getAdminUser();
    if (admin) {
      const { notifications, unreadCount } = await getNotifications({
        audience: "admin",
        limit: 20,
      });
      return NextResponse.json({
        success: true,
        audience: "admin",
        notifications,
        unreadCount,
      });
    }

    // 2. Check if Member is authenticated
    const cookieStore = await cookies();
    const token = cookieStore.get(MEMBER_COOKIE_NAME)?.value;
    if (token) {
      const payload = verifyMemberSessionToken(token);
      if (payload) {
        const { notifications, unreadCount } = await getNotifications({
          audience: "member",
          memberUuid: payload.id,
          limit: 20,
        });
        return NextResponse.json({
          success: true,
          audience: "member",
          notifications,
          unreadCount,
        });
      }
    }

    // If neither Admin nor Member session is found
    return NextResponse.json(
      { error: "Unauthorized. Authentication required." },
      { status: 401 }
    );
  } catch (err: any) {
    console.error("GET /api/notifications error:", err);
    // Never crash; return empty notifications if table is missing
    return NextResponse.json(
      { success: true, notifications: [], unreadCount: 0 },
      { status: 200 }
    );
  }
}
