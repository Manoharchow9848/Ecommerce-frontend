"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

function PaymentResultContent() {
  const sp = useSearchParams();
  const orderId = sp.get("orderId");
  const status = sp.get("status");
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">
          Payment {status || "Status"}
        </h1>
        {orderId && <p className="mb-2 text-gray-300">Order ID: {orderId}</p>}
        {status === "SUCCESS" ? (
          <p className="text-green-400">Your order is confirmed 🎉</p>
        ) : status ? (
          <p className="text-red-400">Payment {status}. Please try again.</p>
        ) : (
          <p className="text-gray-400">Waiting for payment status...</p>
        )}
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-20">Loading...</div>}>
      <PaymentResultContent />
    </Suspense>
  );
}
