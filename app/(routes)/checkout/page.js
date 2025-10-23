// "use client";
// import React, { useState } from "react";
// import AddressDetails from "./_components/AddressDetails";
// import OrderSummary from "./_components/OrderSummary";
// import PaymentOptions from "./_components/PaymentOption";
// export default function CheckoutPage() {
//   const [step, setStep] = useState("address");
//   const [savedAddress, setSavedAddress] = useState(null);

//   const totalAmount = 100;

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//       <div className="lg:col-span-2">
//         {step === "address" && (
//           <AddressDetails
//             onSave={(addr) => {
//               setSavedAddress(addr);
//               setStep("summary");
//             }}
//           />
//         )}
//         {step === "summary" && (
//           <OrderSummary
//             cart={cart}
//             total={totalAmount}
//             onProceed={() => setStep("payment")}
//           />
//         )}
//         {step === "payment" && (
//           <PaymentOptions
//             onPay={(method) => {
//               console.log("Payment method:", method, "Address:", savedAddress);
//               // integrate Razorpay or COD here
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// }
