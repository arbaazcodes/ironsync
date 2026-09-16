import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { MEMBER_COOKIE_NAME, verifyMemberSessionToken } from "@/lib/security/memberSession";
import {
  createChangeRequest,
  getMemberChangeRequests,
} from "@/lib/services/changeRequestService";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(MEMBER_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized. Member session required." }, { status: 401 });
    }

    const payload = verifyMemberSessionToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired member session." }, { status: 401 });
    }

    const data = await getMemberChangeRequests(payload.id, payload.memberId);
    return NextResponse.json({
      success: true,
      pendingRequest: data.pendingRequest,
      history: data.history,
    });
  } catch (err: any) {
    console.error("GET /api/member/change-request error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load member change requests." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(MEMBER_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized. Member session required." }, { status: 401 });
    }

    const payload = verifyMemberSessionToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired member session." }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { requestedFields, memberNote } = body;

    if (!requestedFields || typeof requestedFields !== "object") {
      return NextResponse.json(
        { error: "Invalid payload: requestedFields object is required." },
        { status: 400 }
      );
    }

    const newRequest = await createChangeRequest(
      payload.id,
      payload.memberId,
      requestedFields,
      memberNote
    );

    return NextResponse.json(
      {
        success: true,
        message: "Profile change request submitted successfully. It is now pending gym administrator approval.",
        request: newRequest,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST /api/member/change-request error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to submit change request." },
      { status: 400 }
    );
  }
}
