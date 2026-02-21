import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailParams) {
  try {
    await transporter.sendMail({
      from: `"Naufal Adib Studio" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

/**
 * Send order receipt email with UUID link
 */
export async function sendOrderReceipt(params: {
  to: string;
  customerName: string;
  orderNumber: number;
  serviceType: string;
  grossAmount: number;
  uuidToken: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const orderUrl = `${baseUrl}/order/${params.uuidToken}`;

  const html = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #3B82F6, #2563EB); padding: 32px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: white;">Order Confirmed! 🎉</h1>
      </div>
      <div style="padding: 32px;">
        <p style="color: #a3a3a3; margin-bottom: 24px;">Hi <strong style="color: #f5f5f5;">${params.customerName}</strong>,</p>
        <p style="color: #a3a3a3; margin-bottom: 24px;">Your order has been created successfully. Here are the details:</p>
        
        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="color: #a3a3a3; padding: 8px 0;">Order Number</td><td style="color: #f5f5f5; font-weight: 600; text-align: right;">#${params.orderNumber}</td></tr>
            <tr><td style="color: #a3a3a3; padding: 8px 0;">Service</td><td style="color: #f5f5f5; font-weight: 600; text-align: right;">${params.serviceType}</td></tr>
            <tr><td style="color: #a3a3a3; padding: 8px 0;">Total Amount</td><td style="color: #3B82F6; font-weight: 700; text-align: right;">Rp ${params.grossAmount.toLocaleString("id-ID")}</td></tr>
            <tr><td style="color: #a3a3a3; padding: 8px 0;">Down Payment (20%)</td><td style="color: #22C55E; font-weight: 700; text-align: right;">Rp ${(params.grossAmount * 0.2).toLocaleString("id-ID")}</td></tr>
          </table>
        </div>

        <p style="color: #a3a3a3; margin-bottom: 16px;">Track your order and make payments using your private dashboard link:</p>
        
        <a href="${orderUrl}" style="display: block; text-align: center; background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; margin-bottom: 24px;">
          View Your Order Dashboard →
        </a>

        <p style="color: #525252; font-size: 12px; text-align: center;">
          This is a private link — do not share it. You can access your order anytime using this link.
        </p>
      </div>
      <div style="background: rgba(255,255,255,0.02); padding: 16px 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06);">
        <p style="color: #525252; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Naufal Adib Studio. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: params.to,
    subject: `Order #${params.orderNumber} Confirmed — Naufal Adib Studio`,
    html,
  });
}

/**
 * Send payment confirmation email
 */
export async function sendPaymentConfirmation(params: {
  to: string;
  customerName: string;
  orderNumber: number;
  paymentType: "down_payment" | "final_payment";
  amount: number;
  uuidToken: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const orderUrl = `${baseUrl}/order/${params.uuidToken}`;
  const isDown = params.paymentType === "down_payment";
  const invoiceNumber = `INV-${params.orderNumber}-${Date.now().toString().slice(-6)}`;

  const html = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #22C55E, #16A34A); padding: 32px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: white;">Payment Receipt / Invoice ✅</h1>
      </div>
      <div style="padding: 32px;">
        <p style="color: #a3a3a3; margin-bottom: 24px;">Hi <strong style="color: #f5f5f5;">${params.customerName}</strong>,</p>
        <p style="color: #a3a3a3; margin-bottom: 24px;">
          Thank you for your payment. This email serves as your official invoice and receipt for Order <strong style="color: #f5f5f5;">#${params.orderNumber}</strong>.
        </p>
        
        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="color: #a3a3a3; padding: 8px 0;">Invoice No</td><td style="color: #f5f5f5; font-weight: 600; text-align: right;">${invoiceNumber}</td></tr>
            <tr><td style="color: #a3a3a3; padding: 8px 0;">Date</td><td style="color: #f5f5f5; font-weight: 600; text-align: right;">${new Date().toLocaleDateString("id-ID")}</td></tr>
            <tr><td style="color: #a3a3a3; padding: 8px 0;">Payment Type</td><td style="color: #f5f5f5; font-weight: 600; text-align: right; text-transform: capitalize;">${params.paymentType.replace("_", " ")}</td></tr>
            <tr><td style="color: #a3a3a3; padding: 8px 0; border-top: 1px solid rgba(255,255,255,0.1);">Amount Paid</td><td style="color: #22C55E; font-weight: 700; text-align: right; border-top: 1px solid rgba(255,255,255,0.1);">Rp ${params.amount.toLocaleString("id-ID")}</td></tr>
          </table>
        </div>

        ${isDown ? '<p style="color: #a3a3a3; margin-bottom: 24px;">Your project is now in progress! You can chat with the admin through your private dashboard.</p>' : '<p style="color: #a3a3a3; margin-bottom: 24px;">Your project is now fully paid. Thank you for your trust! 🎉</p>'}
        <a href="${orderUrl}" style="display: block; text-align: center; background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600;">
          View Order Dashboard →
        </a>
      </div>
      <div style="background: rgba(255,255,255,0.02); padding: 16px 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06);">
        <p style="color: #525252; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Naufal Adib Studio. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: params.to,
    subject: `Invoice & Payment Receipt — Order #${params.orderNumber}`,
    html,
  });
}

/**
 * Send notification to admin when customer chats
 */
export async function sendAdminChatNotification(params: {
  customerName: string;
  orderNumber: number;
  message: string;
  serviceType: string;
}) {
  const adminEmail = process.env.SMTP_USER;
  if (!adminEmail) return;

  const html = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; color: #1a1a1a; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #8b5cf6, #6366f1); padding: 32px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: white;">New Client Message 💬</h1>
      </div>
      <div style="padding: 32px; background: white;">
        <p style="margin-bottom: 24px; color: #334155;"><strong>${params.customerName}</strong> sent a new message regarding Order <strong>#${params.orderNumber}</strong> (${params.serviceType}):</p>
        
        <div style="background: #f8fafc; border-left: 4px solid #8b5cf6; padding: 16px; margin-bottom: 24px; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; color: #1e293b; font-style: italic;">"${params.message}"</p>
        </div>

        <p style="color: #64748b; margin-bottom: 24px; font-size: 14px;">Log in to the admin panel to reply to this message.</p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin" style="display: block; text-align: center; background: #1e1e1e; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600;">
          Open Admin Panel →
        </a>
      </div>
    </div>
    `;

  return sendEmail({
    to: adminEmail,
    subject: `[New Message] Order #${params.orderNumber} - ${params.customerName}`,
    html,
  });
}
