import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/security/adminAuth";
import { reviewChangeRequest } from "@/lib/services/changeRequestService";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized. Admin credentials required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { action, adminNote } = body;

    if (!action || (action !== "approve" && action !== "reject")) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'." },
        { status: 400 }
      );
    }

    if (action === "reject" && (!adminNote || !adminNote.trim())) {
      return NextResponse.json(
        { error: "A rejection reason is required before rejecting a change request." },
        { status: 400 }
      );
    }

    const reviewed = await reviewChangeRequest(id, admin, action, adminNote);

    return NextResponse.json({
      success: true,
      message:
        action === "approve"
          ? "Change request approved. Member profile has been updated."
          : "Change request rejected.",
      request: reviewed,
    });
  } catch (err: any) {
    console.error("POST /api/admin/change-requests/[id]/review error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to process change request review." },
      { status: 400 }
    );
  }
}
