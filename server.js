const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.static("public"));
app.use(express.json());

const SECRET_KEY = process.env.CHECKOUT_SECRET_KEY;

app.post("/create-payment-sessions", async (_req, res) => {
  // Create a PaymentSession
  const request = await fetch(
    "https://api.sandbox.checkout.com/payment-sessions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 6540,
        currency: "HKD",
        reference: "ORD-123A",
        description: "Payment for Guitars and Amps",
        billing_descriptor: {
          name: "Jia Tsang",
          city: "London",
        },
        processing_channel_id: "pc_vm2u3twm6xauln3kpqcpv2h3ji",
        customer: {
          email: "jia.tsang@example.com",
          name: "Jia Tsang",
        },
        shipping: {
          address: {
            address_line1: "123 High St.",
            address_line2: "Flat 456",
            city: "London",
            zip: "SW1A 1AA",
            country: "HK",
          },
          phone: {
            number: "1234567890",
            country_code: "+44",
          },
        },
        billing: {
          address: {
            address_line1: "123 High St.",
            address_line2: "Flat 456",
            city: "London",
            zip: "SW1A 1AA",
            country: "GB",
          },
          phone: {
            number: "1234567890",
            country_code: "+44",
          },
        },
        risk: {
          enabled: true,
        },
        success_url: "http://localhost:3000/?status=succeeded",
        failure_url: "http://localhost:3000/?status=failed",
        metadata: {},
        items: [
          {
            name: "Guitar",
            quantity: 1,
            unit_price: 1635,
          },
          {
            name: "Amp",
            quantity: 3,
            unit_price: 1635,
          },
        ],
      }),
    }
  );

  const parsedPayload = await request.json();
  console.log({ msg: "Parsed response payload", payload: parsedPayload });

  res.status(request.status).send(parsedPayload);
});

app.listen(3000, () =>
  console.log("Node server listening on port 3000: http://localhost:3000/")
);
