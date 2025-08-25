"use client";
import React, { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

const OrdersPage = () => {
  const router = useRouter();
  const {
    isAuthenticated,
    checkAuth,
    orders,
    getOrders,
    isCheckingAuth,
  } = useAuthStore();

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Redirect or fetch orders when auth changes
  useEffect(() => {
    if (!isAuthenticated && !isCheckingAuth) {
      router.push("/login");
    } else if (isAuthenticated) {
      getOrders();
    }
  }, [isAuthenticated, isCheckingAuth]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">My Orders</h1>

      {/* Loading state */}
      {isCheckingAuth && <p className="text-center">Checking authentication...</p>}

      {/* No orders */}
      {!isCheckingAuth && isAuthenticated && orders?.length === 0 && (
        <p className="text-center">You have no orders yet.</p>
      )}

      {/* Orders grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(orders) &&
          orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-700 rounded-xl shadow-lg bg-gray-900 p-4 hover:scale-105 transform transition duration-300"
            >
              <p className="text-sm text-gray-400 mb-2">
                <span className="font-semibold text-gray-300">Order ID:</span>{" "}
                {order._id}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {order.status}
              </p>
              <p>
                <span className="font-semibold">Total:</span> ₹{order.totalAmount}
              </p>

              {/* Products in the order */}
              <div className="mt-4">
                <h2 className="font-medium mb-2">Products:</h2>
                <ul className="space-y-3">
                  {order.products.map((item) => (
                    <li
                      key={item._id}
                      className="flex items-center space-x-3 bg-gray-800 rounded-lg p-2"
                    >
                      {/* Product image */}
                      {item.product?.image && (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}

                      {/* Product details */}
                      <div>
                        <p className="font-semibold">
                          {item.product?.name || "Unknown product"}
                        </p>
                        <p className="text-sm text-gray-400">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OrdersPage;
