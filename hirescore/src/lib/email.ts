import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY || "re_c3HDTrDW_8AFbXRfeRd6VCdjAWCCeW3rh"
);

export interface ApplicationStatusEmailData {
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  companyName?: string;
  status: string;
  jobId: string;
  applicationId: string;
}

const getStatusMessage = (status: string) => {
  switch (status) {
    case "PENDING":
      return {
        subject: "Application Received - Thank You for Applying",
        message:
          "Your application has been received and is being reviewed by our team.",
        color: "#f59e0b", // yellow
        emoji: "⏳",
      };
    case "REVIEWING":
      return {
        subject: "Application Under Review",
        message:
          "Great news! Your application is currently being reviewed by our hiring team.",
        color: "#3b82f6", // blue
        emoji: "👀",
      };
    case "INTERVIEWED":
      return {
        subject: "Interview Scheduled - Next Steps",
        message: "Congratulations! You have progressed to the interview stage.",
        color: "#8b5cf6", // purple
        emoji: "🎉",
      };
    case "HIRED":
      return {
        subject: "Congratulations - Job Offer!",
        message: "Excellent news! We are pleased to offer you the position.",
        color: "#10b981", // green
        emoji: "🎊",
      };
    case "REJECTED":
      return {
        subject: "Application Update",
        message:
          "Thank you for your interest. While we have decided to move forward with other candidates, we encourage you to apply for future positions.",
        color: "#ef4444", // red
        emoji: "💼",
      };
    default:
      return {
        subject: "Application Status Update",
        message: "Your application status has been updated.",
        color: "#6b7280", // gray
        emoji: "📧",
      };
  }
};

export async function sendApplicationStatusEmail(
  data: ApplicationStatusEmailData
): Promise<boolean> {
  try {
    console.log("Sending status update email to:", data.candidateEmail);

    const statusInfo = getStatusMessage(data.status);
    const fromEmail = "HireScore <noreply@hirescore.app>";

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${statusInfo.subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background-color: ${statusInfo.color}; color: white; padding: 30px 40px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 600;">
                ${statusInfo.emoji} ${statusInfo.subject}
            </h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px;">
            <p style="font-size: 18px; margin-bottom: 20px;">
                Hello <strong>${data.candidateName}</strong>,
            </p>
            
            <p style="font-size: 16px; margin-bottom: 25px; line-height: 1.8;">
                ${statusInfo.message}
            </p>
            
            <!-- Job Details -->
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 25px; margin: 25px 0;">
                <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">
                    📋 Application Details
                </h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: 600; color: #6b7280; width: 120px;">Position:</td>
                        <td style="padding: 8px 0; color: #1f2937;">${data.jobTitle}</td>
                    </tr>
                    ${
                      data.companyName
                        ? `
                    <tr>
                        <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Company:</td>
                        <td style="padding: 8px 0; color: #1f2937;">${data.companyName}</td>
                    </tr>
                    `
                        : ""
                    }
                    <tr>
                        <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Status:</td>
                        <td style="padding: 8px 0;">
                            <span style="background-color: ${statusInfo.color}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">
                                ${data.status.charAt(0) + data.status.slice(1).toLowerCase()}
                            </span>
                        </td>
                    </tr>
                </table>
            </div>
            
            <!-- Additional Info Based on Status -->
            ${
              data.status === "HIRED"
                ? `
            <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0;">
                <p style="margin: 0; font-weight: 600; color: #065f46;">
                    🎉 Next Steps: Our HR team will contact you within 24-48 hours with offer details and next steps.
                </p>
            </div>
            `
                : ""
            }
            
            ${
              data.status === "INTERVIEWED"
                ? `
            <div style="background-color: #ede9fe; border-left: 4px solid #8b5cf6; padding: 20px; margin: 25px 0;">
                <p style="margin: 0; font-weight: 600; color: #5b21b6;">
                    📅 Next Steps: Our team will reach out to schedule your interview. Please keep an eye on your email.
                </p>
            </div>
            `
                : ""
            }
            
            ${
              data.status === "REJECTED"
                ? `
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 25px 0;">
                <p style="margin: 0; color: #991b1b;">
                    We appreciate the time you invested in the application process. Please consider applying for future opportunities that match your skills and experience.
                </p>
            </div>
            `
                : ""
            }
            
            <p style="font-size: 16px; margin-top: 30px;">
                Thank you for your interest in working with us!
            </p>
            
            <p style="font-size: 16px; margin-bottom: 0;">
                Best regards,<br>
                <strong>${data.companyName || "The Hiring Team"}</strong>
            </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
                This is an automated message from HireScore. Please do not reply to this email.
            </p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #9ca3af;">
                Application ID: ${data.applicationId}
            </p>
        </div>
    </div>
</body>
</html>
    `;

    const textContent = `
${statusInfo.subject}

Hello ${data.candidateName},

${statusInfo.message}

Application Details:
- Position: ${data.jobTitle}
${data.companyName ? `- Company: ${data.companyName}` : ""}
- Status: ${data.status.charAt(0) + data.status.slice(1).toLowerCase()}

${data.status === "HIRED" ? "Next Steps: Our HR team will contact you within 24-48 hours with offer details and next steps." : ""}
${data.status === "INTERVIEWED" ? "Next Steps: Our team will reach out to schedule your interview. Please keep an eye on your email." : ""}
${data.status === "REJECTED" ? "We appreciate the time you invested in the application process. Please consider applying for future opportunities that match your skills and experience." : ""}

Thank you for your interest in working with us!

Best regards,
${data.companyName || "The Hiring Team"}

---
This is an automated message from HireScore. Please do not reply to this email.
Application ID: ${data.applicationId}
    `;

    const result = await resend.emails.send({
      from: fromEmail,
      to: data.candidateEmail,
      subject: statusInfo.subject,
      html: htmlContent,
      text: textContent,
    });

    console.log("Email sent successfully:", result.data?.id);
    return true;
  } catch (error) {
    console.error("Failed to send status update email:", error);
    return false;
  }
}

// Test function for email service
export async function testEmailService(): Promise<boolean> {
  try {
    const testData: ApplicationStatusEmailData = {
      candidateName: "Test Candidate",
      candidateEmail: "test@example.com",
      jobTitle: "Software Engineer",
      companyName: "Test Company",
      status: "REVIEWING",
      jobId: "test-job-id",
      applicationId: "test-app-id",
    };

    return await sendApplicationStatusEmail(testData);
  } catch (error) {
    console.error("Email service test failed:", error);
    return false;
  }
}
