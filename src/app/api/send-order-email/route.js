import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const {
      orderId,
      totalAmount,
      userEmail,
      customerName,
      paymentReceiptUrl,
      shippingInfo,
      cartItems,
    } = await request.json();

    if (!orderId || !totalAmount || !userEmail) {
      return NextResponse.json(
        { error: "Missing required order details." },
        { status: 400 }
      );
    }

    const companyName = "BYTEFRONT GADGETS";

    // 📨 Email to Admin
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2>${companyName} - New Order</h2>
        </div>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${customerName || "N/A"}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Total Amount:</strong> ₦${Number(totalAmount).toLocaleString()}</p>
        <p><strong>Shipping Info:</strong></p>
        <pre style="background:#f5f5f5; padding:10px; border-radius:6px;">${JSON.stringify(
          shippingInfo,
          null,
          2
        )}</pre>
        <p><strong>Items Ordered:</strong></p>
        <ul>
          ${cartItems
            ?.map(
              (item) =>
                `<li>${item.title} - ₦${item.price} x ${item.quantity}</li>`
            )
            .join("")}
        </ul>
        <p><strong>Payment Receipt:</strong> <a href="${paymentReceiptUrl}" target="_blank">View Receipt</a></p>
      </div>
    `;

    // Email to Customer
    const customerHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2>Order Confirmation</h2>
        </div>
        <p>Dear ${customerName || "Customer"},</p>
        <p>Thank you for your order! Your payment has been received and is being verified.</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Total:</strong> ₦${Number(totalAmount).toLocaleString()}</p>
        <p>We will contact you in less than 30 mins with updates about your delivery.</p>
        <p>– ${companyName} Team</p>
      </div>
    `;

    // Send emails
    await resend.emails.send({
      from: `${companyName} <info@higher.com.ng>`,
      to: "info@higher.com.ng",
      subject: `🛒 New Order Received - ${orderId}`,
      html: adminHtml,
    });

    await resend.emails.send({
      from: `${companyName} <info@higher.com.ng>`,
      to: userEmail,
      subject: "Order Confirmation - BYTEFRONT GADGETS",
      html: customerHtml,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error sending order email:", error);
    return NextResponse.json(
      { error: "Failed to send order emails", details: error.message },
      { status: 500 }
    );
  }
}
