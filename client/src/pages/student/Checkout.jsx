import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { useCart } from '../../context/CartContext';
import enrollmentService from '../../services/enrollmentService';
import { toast } from 'react-toastify';

export const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems: contextCartItems, clearCart, refetchEnrollments } = useCart();

  // Combine cart items passed via location state or fallback to context
  const cartItems = location.state?.cartItems || contextCartItems || [];
  const totalPrice = location.state?.totalPrice !== undefined
    ? location.state.totalPrice
    : cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [enrolledTitles, setEnrolledTitles] = useState([]);

  // Billing form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');

  const handleConfirmPurchase = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    setIsProcessing(true);
    try {
      // Enroll student in all purchased courses in parallel
      const titles = [];
      await Promise.all(
        cartItems.map(async (course) => {
          const cId = (course._id || course.id)?.toString();
          if (cId) {
            await enrollmentService.enroll(cId);
            titles.push(course.title);
          }
        })
      );

      setEnrolledTitles(titles);
      await refetchEnrollments();
      clearCart();
      setIsSuccessModalOpen(true);
      toast.success('🎉 Purchase successful! Courses added to My Learning.');
    } catch (err) {
      console.error('[Checkout Error]:', err);
      toast.error(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="space-y-4">
        <Badge variant="primary" size="sm">SECURE CHECKOUT</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
          Complete Your Order ({cartItems.length} {cartItems.length === 1 ? 'Course' : 'Courses'})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Payment & Billing Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-6 shadow-soft bg-white">
            <h2 className="text-base font-bold font-heading text-gray-900 border-b border-gray-100 pb-2">
              1. Payment Method
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-[10px] border flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-[#4F46E5] bg-indigo-50/60 text-[#4F46E5] shadow-xs'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Credit / Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-[10px] border flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-[#4F46E5] bg-indigo-50/60 text-[#4F46E5] shadow-xs'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
                <span>UPI / NetBanking</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmPurchase} className="space-y-4 pt-2">
              <Input
                label="Cardholder Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                isRequired
              />

              <Input
                label="Billing Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                isRequired
              />

              <Input
                label="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
                isRequired
              />

              <div className="grid grid-cols-2 gap-4">
                <Input label="Expiration Date" placeholder="MM/YY" isRequired />
                <Input label="Security Code (CVC)" placeholder="123" isRequired />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isProcessing}
                  leftIcon={Lock}
                >
                  Pay ₹{totalPrice} & Complete Order
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Col: Order Items Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 space-y-4 shadow-soft bg-white border border-gray-200">
            <h2 className="text-base font-bold font-heading text-gray-900 border-b border-gray-100 pb-2">
              Order Items ({cartItems.length})
            </h2>

            {cartItems.length > 0 ? (
              <div className="space-y-3 divide-y divide-gray-100">
                {cartItems.map((course) => {
                  const courseId = (course._id || course.id)?.toString();
                  return (
                    <div key={courseId} className="flex items-center gap-3 text-xs pt-2 first:pt-0">
                      <img src={course.thumbnail} alt={course.title} className="w-14 h-10 rounded object-cover shrink-0" />
                      <div className="flex-1 truncate">
                        <p className="font-bold text-gray-900 truncate">{course.title}</p>
                        <span className="font-mono text-[#4F46E5] font-semibold">₹{course.price || 0}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-500 py-4 text-center">Your order cart is empty.</p>
            )}

            <div className="pt-4 border-t border-gray-200 flex justify-between text-sm font-extrabold font-heading text-gray-900">
              <span>Total Due</span>
              <span className="font-mono text-[#4F46E5]">₹{totalPrice}</span>
            </div>
          </Card>
        </div>

      </div>

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          navigate('/student/my-learning');
        }}
        title="Payment & Enrollment Successful!"
        size="md"
      >
        <div className="text-center space-y-4 py-2">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-gray-900 font-heading">Enrolled in {enrolledTitles.length} {enrolledTitles.length === 1 ? 'Course' : 'Courses'}</h3>
            <ul className="text-xs text-gray-600 font-medium space-y-1 bg-gray-50 p-3 rounded-lg border border-gray-100 text-left max-h-36 overflow-y-auto">
              {enrolledTitles.map((title, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{title}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500">Your enrollments are active. You can start learning immediately.</p>
          </div>
          <Button variant="primary" size="md" fullWidth rightIcon={ArrowRight} onClick={() => navigate('/student/my-learning')}>
            Go to My Learning
          </Button>
        </div>
      </Modal>

    </div>
  );
};

export default Checkout;
