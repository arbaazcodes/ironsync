import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/security/adminAuth";
import { getAdminChangeRequests } from "@/lib/services/changeRequestService";
import { ChangeRequestStatus } from "@/lib/types/changeRequest";

export async function GET(request: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized. Admin credentials required." },
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
      requests,
      pendingCount: requests.filter((r) => r.status === "pending").length,
    });
  } catch (err: any) {
    console.error("GET /api/admin/change-requests error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load change requests." },
      { status: 500 }
    );
  }
}
