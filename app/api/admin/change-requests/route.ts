import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/security/adminAuth";
import { getAdminChangeRequests } from "@/lib/services/changeRequestService";
import { ChangeRequestStatus } from "@/lib/types/changeRequest";
import { isServiceRoleConfigured } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    if (!isServiceRoleConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "Server is missing Supabase service configuration",
          requests: [],
          pendingCount: 0,
        },
        { status: 503 }
      );
    }

    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized. Admin credentials required.", requests: [], pendingCount: 0 },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status") as ChangeRequestStatus | "all" | null;
    const statusFilter =
      statusParam && ["pending", "approved", "rejected", "all"].includes(statusParam)
        ? statusParam
        : undefined;

    const requests = await getAdminChangeRequests(statusFilter);

    return NextResponse.json({
      success: true,
      requests: Array.isArray(requests) ? requests : [],
      pendingCount: Array.isArray(requests) ? requests.filter((r) => r.status === "pending").length : 0,
    });
  } catch (err: any) {
    console.error("GET /api/admin/change-requests error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Failed to load change requests.",
        requests: [],
        pendingCount: 0,
      },
      { status: 500 }
    );
  }
}
