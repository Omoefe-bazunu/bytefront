export const AffiliateEmailTemplate = ({
  name,
  referralLink,
}: {
  name: string;
  referralLink: string;
}) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      padding: "20px",
      maxWidth: "600px",
      margin: "0 auto",
    }}
  >
    <h2 style={{ color: "#333" }}>
      Welcome to the ByteFront Affiliate Program!
    </h2>
    <p style={{ color: "#555", lineHeight: "1.6" }}>
      Hello {name},<br />
      Thank you for joining the ByteFront Affiliate Program! You're now part of
      our family, ready to earn commissions by promoting our products.
    </p>
    <hr style={{ border: "1px solid #eee", margin: "20px 0" }} />
    <h3 style={{ color: "#333", marginBottom: "10px" }}>
      Your Unique Referral Link
    </h3>
    <p>
      <a
        href={referralLink}
        style={{ color: "#007bff", textDecoration: "none" }}
      >
        {referralLink}
      </a>
    </p>
    <p style={{ color: "#555", lineHeight: "1.6" }}>
      Share this link with your audience to start earning commissions. Track
      your referrals and earnings in your affiliate dashboard.
    </p>
    <hr style={{ border: "1px solid #eee", margin: "20px 0" }} />
    <p style={{ color: "#777", fontSize: "12px" }}>
      This email was sent from ByteFront Commerce. For support, contact{" "}
      <a href="mailto:info@higher.com.ng" style={{ color: "#007bff" }}>
        info@higher.com.ng
      </a>
      .
    </p>
  </div>
);
