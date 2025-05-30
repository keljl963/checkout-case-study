import { NextResponse } from 'next/server';

const SECRET_KEY = process.env.CHECKOUT_SECRET_KEY;

export async function POST(request: Request) {
  if (!SECRET_KEY) {
    console.error("Checkout.com secret key is not configured.");
    return NextResponse.json(
      {
        error: "Server configuration error: Missing secret key.",
        details: "The Checkout.com secret key is not set in the environment variables."
      },
      { status: 500 }
    );
  }

  try {
    const paymentSessionPayload = {
      amount: 999,
      currency: "USD",
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
          name: "Pro Plan",
          quantity: 1,
          unit_price: 999,
        },
      ],
    };

    console.log("Creating payment session with payload:", paymentSessionPayload);

    const checkoutResponse = await fetch(
      "https://api.sandbox.checkout.com/payment-sessions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: SECRET_KEY, // Using the direct key here; ensure it's secured
        },
        body: JSON.stringify(paymentSessionPayload), // Uncommented and use when payload is defined
      }
    );

    const responseData = await checkoutResponse.json();

    if (!checkoutResponse.ok) {
      console.error("Checkout.com API Error:", responseData);
      return NextResponse.json(
        { 
          error: "Failed to create payment session with Checkout.com", 
          details: responseData 
        },
        { status: checkoutResponse.status }
      );
    }

    console.log("Checkout.com API Success:", responseData);
    // The responseData from Checkout.com often contains the session ID and other details
    // that your frontend (app.js) will use.
    return NextResponse.json(responseData, { status: checkoutResponse.status });

  } catch (error) {
    console.error("Error in /create-payment-sessions:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred";
    return NextResponse.json(
      { 
        error: "Failed to create payment session", 
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}
