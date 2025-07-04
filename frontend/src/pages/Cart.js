import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import axios from 'axios';
import { toast } from 'react-toastify';

const Cart = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const changeQuantity = useCartStore((state) => state.changeQuantity);
  const getTotalAmount = useCartStore((state) => state.getTotalAmount);
  const clearCart = useCartStore((state) => state.deleteCart);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    const amount = getTotalAmount();

    const paymentOrder = {
      name: user?.name || 'Guest',
      email: user?.email || 'guest@example.com',
      phone: user?.phone || '9999999999',
      amount,
    };

    try {
      const res = await axios.post('http://localhost:8080/payment/create-order', paymentOrder, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { id: razorpayOrderId } = res.data;

      const options = {
        key: 'rzp_test_yOgHnbUJdG21IQ',
        amount: amount * 100,
        currency: 'INR',
        name: 'Shopify',
        description: 'Order Checkout',
        order_id: razorpayOrderId,
        handler: async function (response) {
          toast.success(`Payment Successful: ${response.razorpay_payment_id}`);

          await axios.post(
            `http://localhost:8080/orders/place/${user?.id}`,
            cart.reduce((map, item) => {
              map[item.id] = item.quantity;
              return map;
            }, {}),
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          clearCart();
          navigate('/products');
        },
        prefill: {
          name: paymentOrder.name,
          email: paymentOrder.email,
          contact: paymentOrder.phone,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment failed:', err);
      toast.error('Something went wrong during payment.');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-white border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-screen text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some items to your cart and come back here.</p>
        <Link to="/" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">Your Shopping Cart</h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-secondary text-white rounded-lg">
          <thead className="border-b border-gray-700">
            <tr>
              <th className="py-4 px-6 text-left">Product</th>
              <th className="py-4 px-6 text-left">Name</th>
              <th className="py-4 px-6 text-left">Price</th>
              <th className="py-4 px-6 text-left">Quantity</th>
              <th className="py-4 px-6 text-left">Total</th>
              <th className="py-4 px-6 text-left">Remove</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-700">
                <td className="py-4 px-6">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="py-4 px-6 font-medium">{item.name}</td>
                <td className="py-4 px-6">₹{item.price}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => changeQuantity(index, -1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full hover:bg-gray-600"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => changeQuantity(index, 1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full hover:bg-gray-600"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="py-4 px-6 font-bold">₹{(item.price * item.quantity).toFixed(2)}</td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => changeQuantity(index, -item.quantity)}
                    className="text-red-500 hover:text-red-400"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-col md:flex-row md:justify-end">
        <div className="md:w-1/3 bg-secondary text-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Items ({cart.length}):</span>
            <span>₹{getTotalAmount().toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="border-t border-gray-700 my-4"></div>
          <div className="flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span>₹{getTotalAmount().toFixed(2)}</span>
          </div>
          <button onClick={handleCheckout} className="w-full mt-6 btn-primary py-3">
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;