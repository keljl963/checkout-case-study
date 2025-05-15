/* global CheckoutWebComponents */
(async () => {
  try {
    // Insert your public key here
    const PUBLIC_KEY = process.env.PUBLIC_KEY;

    const response = await fetch("/create-payment-sessions", { 
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating payment session:", errorData);
      document.getElementById("error-message").textContent = "Failed to create payment session. Please try again.";
      return;
    }

    const paymentSession = await response.json();
    console.log("Payment Session", paymentSession);

    const checkout = await CheckoutWebComponents({
      publicKey: PUBLIC_KEY,
      environment: "sandbox",
      locale: "zh-HK",
      paymentSession,
      onReady: () => {
        console.log("onReady");
      },
      onPaymentCompleted: (_component, paymentResponse) => {
        console.log("Create Payment with PaymentId: ", paymentResponse.id);
      },
      onChange: (component) => {
        console.log(
          `onChange() -> isValid: "${component.isValid()}" for "${
            component.type
          }"`,
        );
      },
      onError: (component, error) => {
        console.log("onError", error, "Component", component.type);
      },
    });

    const flowComponent = checkout.create("flow");
    flowComponent.mount(document.getElementById("flow-container"));
  } catch (error) {
    console.error("Unexpected error:", error);
    document.getElementById("error-message").textContent = "An unexpected error occurred. Please try again.";
  }
})();

function triggerToast(id) {
  var element = document.getElementById(id);
  element.classList.add("show");

  setTimeout(function () {
    element.classList.remove("show");
  }, 5000);
}

const urlParams = new URLSearchParams(window.location.search);
const paymentStatus = urlParams.get("status");
const paymentId = urlParams.get("cko-payment-id");

if (paymentStatus === "succeeded") {
  triggerToast("successToast");
}

if (paymentStatus === "failed") {
  triggerToast("failedToast");
}

if (paymentId) {
  console.log("Create Payment with PaymentId: ", paymentId);
}
