import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, CheckCircle2, ArrowRight, Download, BookOpen } from 'lucide-react';
import { CART_ITEMS } from '../../data/mockData';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { toast } from 'react-toastify';

export const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'paypal' | 'demo'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Billing form state
  const [fullName, setFullName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex@learnix.edu');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');

  const totalAmount = CART_ITEMS.reduce((sum, item) => sum + item.course.price, 0);

  const handleConfirmPurchase = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment gateway delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsProcessing(false);
    setIsSuccessModalOpen(true);
    toast.success('🎉 Purchase successful! Course added to My Learning.');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 font-sans">
      
      {/* Checkout Header & Steps */}
      <div className="space-y-4">
        <Badge variant="primary" size="sm">SECURE CHECKOUT</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
          Complete Your Order
        </h1>

        {/* Step indicator */}
        <div className="flex items-center gap-4 text-xs font-semibold border-b border-gray-200 pb-3">
          <span className="text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> 1. Cart Review
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-[#4F46E5] flex items-center gap-1 font-bold">
            <CreditCard className="w-4 h-4" /> 2. Payment & Billing
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-400">3. Access Course</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Billing Info & Payment Method */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleConfirmPurchase} className="space-y-6">
            
            {/* Billing Information */}
            <Card className="p-6 space-y-4">
              <h2 className="text-base font-bold font-heading text-gray-900">Billing Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  isRequired
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isRequired
                />
              </div>
            </Card>

            {/* Payment Method Selector */}
            <Card className="p-6 space-y-4">
              <h2 className="text-base font-bold font-heading text-gray-900">Select Payment Method</h2>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-[8px] border text-xs font-semibold flex flex-col items-center gap-2 transition-colors cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 rounded-[8px] border text-xs font-semibold flex flex-col items-center gap-2 transition-colors cursor-pointer ${
                    paymentMethod === 'paypal'
                      ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Lock className="w-5 h-5" />
                  <span>PayPal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('demo')}
                  className={`p-3 rounded-[8px] border text-xs font-semibold flex flex-col items-center gap-2 transition-colors cursor-pointer ${
                    paymentMethod === 'demo'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 text-amber-300" />
                  <span>1-Click Demo Pay</span>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-3 pt-2">
                  <Input label="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} isRequired />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Expiration (MM/YY)" placeholder="12/28" isRequired />
                    <Input label="CVC Code" placeholder="888" isRequired />
                  </div>
                </div>
              )}

              {paymentMethod === 'demo' && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-[8px] text-xs text-emerald-800 space-y-1">
                  <p className="font-bold">✨ Instant Demo Payment Enabled</p>
                  <p>Clicking "Confirm Purchase" below will immediately process your order without entering credit card details.</p>
                </div>
              )}
            </Card>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isProcessing}
              rightIcon={Lock}
            >
              Confirm & Complete Purchase (${totalAmount.toFixed(2)})
            </Button>
          </form>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 space-y-4 shadow-soft">
            <h2 className="text-base font-bold font-heading text-gray-900 border-b border-gray-100 pb-3">
              Order Items ({CART_ITEMS.length})
            </h2>

            <div className="space-y-3">
              {CART_ITEMS.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.course.thumbnail} alt={item.course.title} className="w-14 h-10 rounded object-cover" />
                  <div className="flex-1 truncate">
                    <h3 className="text-xs font-bold text-gray-900 truncate">{item.course.title}</h3>
                    <p className="text-[11px] text-[#4F46E5] font-mono font-bold">${item.course.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-1 text-xs font-mono">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-sm pt-2 border-t border-gray-100">
                <span>Total Charge</span>
                <span className="text-[#4F46E5]">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* Success Confirmation Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          navigate('/student/my-learning');
        }}
        title="Order Confirmation #LRNX-9842"
        size="md"
      >
        <div className="text-center space-y-4 py-2">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <Badge variant="success" size="md">PAYMENT SUCCESSFUL</Badge>
          <h2 className="text-xl font-bold font-heading text-gray-900">Thank You for Your Purchase!</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            Your course access has been activated immediately. An email invoice has been sent to <strong className="text-gray-900">{email}</strong>.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <Button variant="outline" leftIcon={Download} onClick={() => toast.info('Invoice PDF downloaded.')}>
              Download Invoice
            </Button>
            <Button variant="primary" leftIcon={BookOpen} onClick={() => navigate('/student/my-learning')}>
              Go to My Learning
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Checkout;
