import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, CheckCircle2, ArrowRight, Download, BookOpen } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { toast } from 'react-toastify';

export const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Billing form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.course?.price || item.price || 0), 0);

  const handleConfirmPurchase = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Payment & Billing Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-6 shadow-soft">
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
                placeholder="Name on card"
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
                  Pay ₹{totalAmount} & Complete Order
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Col: Order Items Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 space-y-4 shadow-soft">
            <h2 className="text-base font-bold font-heading text-gray-900 border-b border-gray-100 pb-2">
              Order Summary ({cartItems.length})
            </h2>

            {cartItems.length > 0 ? (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id || item._id} className="flex items-center gap-3 text-xs">
                    <img src={item.course?.thumbnail || item.thumbnail} alt="thumbnail" className="w-12 h-9 rounded object-cover" />
                    <div className="flex-1 truncate">
                      <p className="font-bold text-gray-900 truncate">{item.course?.title || item.title}</p>
                      <span className="font-mono text-[#4F46E5]">₹{item.course?.price || item.price || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 py-4 text-center">Your order cart is empty.</p>
            )}

            <div className="pt-4 border-t border-gray-200 flex justify-between text-sm font-extrabold font-heading text-gray-900">
              <span>Total Due</span>
              <span className="font-mono text-[#4F46E5]">₹{totalAmount}</span>
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
        title="Payment Successful!"
        size="md"
      >
        <div className="text-center space-y-4 py-2">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900 font-heading">Thank You for Your Order</h3>
            <p className="text-xs text-gray-500">Your enrollment has been activated. You can access your course lessons immediately.</p>
          </div>
          <Button variant="primary" size="md" fullWidth onClick={() => navigate('/student/my-learning')}>
            Go to My Learning
          </Button>
        </div>
      </Modal>

    </div>
  );
};

export default Checkout;
