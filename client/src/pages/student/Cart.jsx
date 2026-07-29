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
  const [items, setItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // percentage

  const handleRemoveItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id && item._id !== id));
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

  const subtotal = items.reduce((sum, item) => sum + (item.course?.price || item.price || 0), 0);
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
            {items.map((item) => {
              const course = item.course || item;
              const courseId = course._id || course.id;
              return (
                <Card key={courseId} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-soft">
                  <div className="flex items-center gap-4">
                    <img src={course.thumbnail} alt={course.title} className="w-20 h-14 rounded-[8px] object-cover shrink-0" />
                    <div className="space-y-1">
                      <Badge variant="primary" size="sm">{typeof course.category === 'object' ? course.category?.name : course.category}</Badge>
                      <h3 className="text-sm font-bold font-heading text-gray-900">{course.title}</h3>
                      <p className="text-xs text-gray-500">By {typeof course.instructor === 'object' ? course.instructor?.name : (course.instructor || 'Faculty')}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <span className="text-base font-extrabold font-mono text-gray-900">₹{course.price || 0}</span>
                    <button
                      onClick={() => handleRemoveItem(courseId)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Right: Order Summary Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 space-y-6 shadow-soft-md border-2 border-indigo-50">
              <h2 className="text-base font-bold font-heading text-gray-900 border-b border-gray-100 pb-2">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-mono font-bold text-gray-900">₹{subtotal}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({appliedDiscount}%)</span>
                    <span className="font-mono">-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-extrabold font-heading text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total Due</span>
                  <span className="font-mono text-[#4F46E5]">₹{totalPrice}</span>
                </div>
              </div>

              {/* Coupon Input */}
              <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block text-[11px] font-semibold text-gray-700 font-heading">Have a Coupon Code?</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="LEARNIX2026"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="text-xs font-mono uppercase"
                  />
                  <Button type="submit" variant="secondary" size="md">
                    Apply
                  </Button>
                </div>
              </form>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={ArrowRight}
                onClick={() => navigate('/student/checkout')}
              >
                Proceed to Checkout
              </Button>
            </Card>
          </div>

        </div>
      ) : (
        <Card className="p-14 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7 text-[#4F46E5]" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-gray-900 font-heading">Your Cart is Empty</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Explore our course catalog and add courses to your cart to enroll.
            </p>
          </div>
          <Button variant="primary" size="md" leftIcon={ShoppingBag} onClick={() => navigate('/courses')}>
            Browse Courses
          </Button>
        </Card>
      )}

    </div>
  );
};

export default Cart;
