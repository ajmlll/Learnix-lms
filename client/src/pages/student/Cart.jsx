import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Tag, ArrowRight, Star, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import { toast } from 'react-toastify';

export const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(CART_ITEMS);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // percentage

  const handleRemoveItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.info('Course removed from cart.');
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'LEARNIX2026') {
      setAppliedDiscount(20);
      toast.success('🎉 20% Discount Coupon Applied!');
    } else {
      toast.error('Invalid coupon code. Try: LEARNIX2026');
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.course.price, 0);
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const totalPrice = subtotal - discountAmount;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="space-y-1">
        <Badge variant="primary" size="sm">SHOPPING CART</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
          Your Cart ({items.length} {items.length === 1 ? 'Course' : 'Courses'})
        </h1>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="p-4 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={item.course.thumbnail}
                      alt={item.course.title}
                      className="w-24 h-16 rounded-[8px] object-cover shrink-0"
                    />
                    <div className="space-y-1">
                      <Badge variant="primary" size="sm">{item.course.category}</Badge>
                      <h3 className="text-sm font-bold font-heading text-gray-900 leading-snug">
                        {item.course.title}
                      </h3>
                      <p className="text-xs text-gray-500">By {item.course.instructor.name}</p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-extrabold font-mono text-gray-900">${item.course.price}</span>
                      <span className="text-xs text-gray-400 line-through font-mono">${item.course.originalPrice}</span>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Right: Price Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 space-y-6 shadow-soft-lg border-2 border-indigo-100">
              <h2 className="text-base font-bold font-heading text-gray-900 border-b border-gray-100 pb-3">
                Order Summary
              </h2>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">Have a promo code?</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="LEARNIX2026"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    leftIcon={Tag}
                    className="flex-1"
                  />
                  <Button type="submit" variant="secondary" size="md" className="shrink-0">
                    Apply
                  </Button>
                </div>
                {appliedDiscount > 0 && (
                  <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 20% discount applied!
                  </p>
                )}
              </form>

              {/* Cost Calculations */}
              <div className="space-y-2 text-xs text-gray-600 pt-2 border-t border-gray-100 font-mono">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount ({appliedDiscount}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400">
                  <span>Estimated Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100 font-mono">
                  <span>Total Due</span>
                  <span className="text-[#4F46E5]">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={ArrowRight}
                onClick={() => navigate('/student/checkout')}
              >
                Proceed to Checkout
              </Button>

              <div className="flex items-center justify-center gap-1 text-[11px] text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>30-Day Money-Back Guarantee</span>
              </div>
            </Card>
          </div>

        </div>
      ) : (
        /* Empty Cart State */
        <Card className="p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-indigo-50 text-[#4F46E5] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold font-heading text-gray-900">Your Cart is Empty</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Explore our curriculum of top engineering courses and add them to your cart.
          </p>
          <Button variant="primary" size="md" onClick={() => navigate('/courses')}>
            Browse Courses
          </Button>
        </Card>
      )}

    </div>
  );
};

export default Cart;
