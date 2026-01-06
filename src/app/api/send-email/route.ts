import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Send email via Resend
    await resend.emails.send({
      from: "ByteFront <info@higher.com.ng>", // must be a verified domain in Resend
      to: "raniem57@gmail.com", // admin email
      subject: `New Contact Message from ${name}`,
      replyTo: email,
      text: `
        Name: ${name}
        Email: ${email}

        Message:
        ${message}
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Email send failed:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: error.message },
      { status: 500 }
    );
  }
}
