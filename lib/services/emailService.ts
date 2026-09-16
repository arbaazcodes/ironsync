import { logMemberAction } from "./auditLogService";
import { AllowedChangeFieldKey, CHANGE_FIELD_METADATA } from "../types/changeRequest";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/**
 * Sends an email via the Resend API if configured.
 * If RESEND_API_KEY is not configured, gracefully skips sending and returns skipped status.
 */
async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailParams): Promise<{ sent: boolean; skipped: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    return { sent: false, skipped: true };
  }

  try {
    const fromAddress =
      process.env.EMAIL_FROM_ADDRESS || "IronSync Gym <notifications@ironsync.online>";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [to],
        subject,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.warn(`[EmailService] Resend API error (${res.status}):`, errBody);
      return { sent: false, skipped: false, error: errBody };
    }

    return { sent: true, skipped: false };
  } catch (err: any) {
    console.warn("[EmailService] Exception sending email:", err?.message);
    return { sent: false, skipped: false, error: err?.message };
  }
}

/**
 * Dispatches notification to Gym Administration when a member submits a change request.
 */
export async function notifyGymAdminNewRequest(params: {
  memberUuid: string;
  memberId: string;
  memberName: string;
  requestedFields: Record<string, any>;
  memberNote?: string | null;
  requestId: string;
}): Promise<void> {
  const adminEmail =
    process.env.GYM_NOTIFY_EMAIL?.trim() || "front-desk@ironsync.online";

  const fieldList = Object.entries(params.requestedFields)
    .map(([key, val]) => {
      const meta = CHANGE_FIELD_METADATA[key as AllowedChangeFieldKey];
      const label = meta ? meta.label : key.replace(/_/g, " ");
      const unit = meta?.unit ? ` ${meta.unit}` : "";
      return `• ${label}: ${val}${unit}`;
    })
    .join("\n");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ironsync.online";
  const reviewUrl = `${siteUrl}/admin/members`;

  const subject = `[IronSync] New Profile Change Request: ${params.memberId} (${params.memberName})`;
  const text = `A member has submitted a profile change request.\n\nMember: ${params.memberName} (${params.memberId})\n\nRequested Changes:\n${fieldList}\n\n${
    params.memberNote ? `Member Note: "${params.memberNote}"\n\n` : ""
  }Review and approve/reject the request at:\n${reviewUrl}\n\nIronSync Gym Operations`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0C0C0C; background-color: #F7F7F5; border-radius: 12px;">
      <div style="border-bottom: 2px solid #E11D2E; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #0C0C0C; margin: 0; font-size: 20px; text-transform: uppercase;">IronSync Gym Management</h2>
        <p style="color: #5C5C5C; font-size: 13px; margin: 4px 0 0 0;">Member Profile Change Request</p>
      </div>
      <p style="font-size: 15px; margin-bottom: 16px;">
        Member <strong>${params.memberName}</strong> (<code style="background: #E7E5E4; padding: 2px 6px; border-radius: 4px;">${params.memberId}</code>) has submitted profile updates for verification.
      </p>
      <div style="background: #FFFFFF; border: 1px solid #E7E5E4; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <h4 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; color: #5C5C5C;">Requested Fields:</h4>
        <pre style="font-family: inherit; font-size: 14px; margin: 0; white-space: pre-wrap; line-height: 1.6;">${fieldList}</pre>
      </div>
      ${
        params.memberNote
          ? `<div style="background: #FFFFFF; border: 1px solid #E7E5E4; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
               <h4 style="margin: 0 0 6px 0; font-size: 13px; text-transform: uppercase; color: #5C5C5C;">Member Note:</h4>
               <p style="margin: 0; font-style: italic; font-size: 14px; color: #333;">&ldquo;${params.memberNote}&rdquo;</p>
             </div>`
          : ""
      }
      <p style="margin-bottom: 24px;">
        <a href="${reviewUrl}" style="display: inline-block; background-color: #E11D2E; color: #FFFFFF; font-weight: bold; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; text-transform: uppercase;">
          Review in Admin Portal &rarr;
        </a>
      </p>
      <p style="font-size: 12px; color: #888; margin: 0; border-top: 1px solid #E7E5E4; padding-top: 12px;">
        IronSync Automated Notification System • ${siteUrl}
      </p>
    </div>
  `;

  const result = await sendEmail({ to: adminEmail, subject, html, text });

  if (result.skipped) {
    await logMemberAction({
      memberUuid: params.memberUuid,
      memberId: params.memberId,
      action: "email_skipped",
      actorType: "system",
      actorLabel: "Notification Engine",
      requestId: params.requestId,
      afterData: {
        recipient: adminEmail,
        event: "request_submitted",
        reason: "RESEND_API_KEY not configured",
      },
    });
  }
}

/**
 * Dispatches notification to the member when their change request is approved or rejected.
 */
export async function notifyMemberRequestReviewed(params: {
  memberUuid: string;
  memberId: string;
  memberName: string;
  memberEmail?: string | null;
  action: "approve" | "reject";
  adminNote?: string | null;
  requestId: string;
  requestedFields: Record<string, any>;
}): Promise<void> {
  // If member has no email on record, log email_skipped
  if (!params.memberEmail || !params.memberEmail.includes("@")) {
    await logMemberAction({
      memberUuid: params.memberUuid,
      memberId: params.memberId,
      action: "email_skipped",
      actorType: "system",
      actorLabel: "Notification Engine",
      requestId: params.requestId,
      afterData: {
        recipient: null,
        event: params.action === "approve" ? "request_approved" : "request_rejected",
        reason: "Member has no email address on file",
      },
    });
    return;
  }

  const isApproved = params.action === "approve";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ironsync.online";
  const profileUrl = `${siteUrl}/member/profile`;

  const subject = isApproved
    ? `[IronSync] Your Profile Change Request Has Been Approved`
    : `[IronSync] Update Regarding Your Profile Change Request`;

  const text = isApproved
    ? `Hello ${params.memberName},\n\nYour profile change request has been reviewed and APPROVED by the gym administration.\n\nYour official athlete profile and personalized training metrics have been updated accordingly.\n\n${
        params.adminNote ? `Gym Note: "${params.adminNote}"\n\n` : ""
      }View your updated profile:\n${profileUrl}\n\nIronSync Gym Operations`
    : `Hello ${params.memberName},\n\nYour profile change request has been reviewed and REJECTED by the gym administration.\n\nReason: "${
        params.adminNote || "Details could not be verified by the front desk."
      }"\n\nYou can review your profile and submit a revised request at:\n${profileUrl}\n\nIronSync Gym Operations`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0C0C0C; background-color: #F7F7F5; border-radius: 12px;">
      <div style="border-bottom: 2px solid ${isApproved ? "#10B981" : "#E11D2E"}; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #0C0C0C; margin: 0; font-size: 20px; text-transform: uppercase;">IronSync Gym</h2>
        <p style="color: #5C5C5C; font-size: 13px; margin: 4px 0 0 0;">Profile Change Request Update</p>
      </div>
      <p style="font-size: 15px; margin-bottom: 16px;">
        Hello <strong>${params.memberName}</strong>,
      </p>
      <div style="background: #FFFFFF; border: 1px solid #E7E5E4; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
        <div style="display: inline-block; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 12px; text-transform: uppercase; background: ${
          isApproved ? "#DCFCE7; color: #15803D;" : "#FEE2E2; color: #B91C1C;"
        }">
          Decision: ${isApproved ? "Approved" : "Rejected"}
        </div>
        ${
          isApproved
            ? `<p style="font-size: 14px; margin: 12px 0 0 0; color: #333; line-height: 1.5;">
                 Your requested profile changes have been verified and applied to your athlete records. Your training split and nutrition targets have been updated.
               </p>`
            : `<p style="font-size: 14px; margin: 12px 0 0 0; color: #333; line-height: 1.5;">
                 Your requested profile changes could not be applied at this time.
               </p>
               <div style="margin-top: 12px; padding: 12px; background: #FFF1F2; border-left: 3px solid #E11D2E; border-radius: 4px;">
                 <strong style="font-size: 13px; color: #9F1239;">Front Desk Reason:</strong>
                 <p style="margin: 4px 0 0 0; font-size: 13px; color: #4C0519; font-style: italic;">
                   &ldquo;${params.adminNote || "Please visit front desk for verification."}&rdquo;
                 </p>
               </div>`
        }
      </div>
      <p style="margin-bottom: 24px;">
        <a href="${profileUrl}" style="display: inline-block; background-color: #0C0C0C; color: #FFFFFF; font-weight: bold; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; text-transform: uppercase;">
          ${isApproved ? "View Updated Profile &rarr;" : "Submit New Request &rarr;"}
        </a>
      </p>
      <p style="font-size: 12px; color: #888; margin: 0; border-top: 1px solid #E7E5E4; padding-top: 12px;">
        IronSync Gym Operations • Member ID: ${params.memberId}
      </p>
    </div>
  `;

  const result = await sendEmail({ to: params.memberEmail, subject, html, text });

  if (result.skipped) {
    await logMemberAction({
      memberUuid: params.memberUuid,
      memberId: params.memberId,
      action: "email_skipped",
      actorType: "system",
      actorLabel: "Notification Engine",
      requestId: params.requestId,
      afterData: {
        recipient: params.memberEmail,
        event: isApproved ? "request_approved" : "request_rejected",
        reason: "RESEND_API_KEY not configured",
      },
    });
  }
}
