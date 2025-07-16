import type { CartItem } from "@/lib/types";
import type { ShippingInfo } from "@/app/checkout/page";

export const OrderEmailTemplate = ({
  orderId,
  total,
  shippingInfo,
  items,
  orderLink,
}: {
  orderId: string;
  total: number;
  shippingInfo: ShippingInfo;
  items: CartItem[];
  orderLink: string;
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
      New Order Received: #{orderId.substring(0, 7)}
    </h2>
    <p style={{ color: "#555", lineHeight: "1.6" }}>
      A new order has been placed on ByteFront Commerce.
    </p>
    <hr style={{ border: "1px solid #eee", margin: "20px 0" }} />

    <h3 style={{ color: "#333", marginBottom: "10px" }}>Order Details</h3>
    <p>
      <strong>Order ID:</strong> {orderId}
    </p>
    <p>
      <strong>Total Amount:</strong> ₦{total.toLocaleString()}
    </p>

    <h3 style={{ color: "#333", margin: "20px 0 10px" }}>Items Ordered</h3>
    <ul style={{ listStyle: "none", padding: 0 }}>
      {items.map((item, index) => (
        <li key={index} style={{ marginBottom: "10px" }}>
          <strong>{item.name}</strong> (Qty: {item.quantity}) - ₦
          {(
            (item.discountedPrice ?? item.price) * item.quantity
          ).toLocaleString()}
        </li>
      ))}
    </ul>

    <h3 style={{ color: "#333", margin: "20px 0 10px" }}>
      Shipping Information
    </h3>
    <p>
      <strong>Name:</strong> {shippingInfo.name}
    </p>
    <p>
      <strong>Email:</strong> {shippingInfo.email}
    </p>
    <p>
      <strong>Phone:</strong> {shippingInfo.phone}
    </p>
    <p>
      <strong>Address:</strong> {shippingInfo.address}, {shippingInfo.city},{" "}
      {shippingInfo.state}
    </p>

    <hr style={{ border: "1px solid #eee", margin: "20px 0" }} />
    <p>
      <a href={orderLink} style={{ color: "#007bff", textDecoration: "none" }}>
        View Order Details
      </a>
    </p>
    <p style={{ color: "#777", fontSize: "12px" }}>
      This email was sent from ByteFront Commerce. Please review the order and
      verify the payment receipt.
    </p>
  </div>
);
