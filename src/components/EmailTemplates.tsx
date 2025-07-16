export const EmailTemplate = ({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      padding: "20px",
      maxWidth: "600px",
      margin: "0 auto",
    }}
  >
    <h2 style={{ color: "#333" }}>New Contact Message from ByteFront</h2>
    <p style={{ color: "#555", lineHeight: "1.6" }}>
      You have received a new message from the ByteFront contact form.
    </p>
    <hr style={{ border: "1px solid #eee", margin: "20px 0" }} />
    <p>
      <strong>Name:</strong> {name}
    </p>
    <p>
      <strong>Email:</strong> {email}
    </p>
    <p>
      <strong>Message:</strong>
    </p>
    <p
      style={{
        background: "#f9f9f9",
        padding: "15px",
        borderRadius: "5px",
        color: "#333",
      }}
    >
      {message}
    </p>
    <hr style={{ border: "1px solid #eee", margin: "20px 0" }} />
    <p style={{ color: "#777", fontSize: "12px" }}>
      This email was sent from ByteFront's contact form. Please respond directly
      to the sender at {email}.
    </p>
  </div>
);
