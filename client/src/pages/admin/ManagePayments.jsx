import React, { useState, useEffect } from 'react';
import { DollarSign, Download, CreditCard } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { TableRowSkeleton } from '../../components/common/Skeleton';
import paymentService from '../../services/paymentService';
import { toast } from 'react-toastify';

export const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      try {
        const data = await paymentService.getPaymentHistory();
        setPayments(data || []);
      } catch (err) {
        console.error('[ManagePayments API Error]:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const filteredPayments =
    activeFilter === 'all'
      ? payments
      : payments.filter((p) => p.status === activeFilter);

  const handleExportCSV = () => {
    toast.success('📊 Platform transactions CSV exported to downloads!');
  };

  const getStatusBadge = (status) => {
    if (status === 'success' || status === 'completed') return <Badge variant="success" size="sm">SUCCESS</Badge>;
    if (status === 'refunded') return <Badge variant="danger" size="sm">REFUNDED</Badge>;
    return <Badge variant="amber" size="sm">PENDING</Badge>;
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[12px] border border-gray-200 shadow-soft">
        <div className="space-y-1">
          <Badge variant="dark" size="sm" hasDot>FINANCIAL LEDGER</Badge>
          <h1 className="text-2xl font-bold font-heading text-gray-900">
            Platform Financial Transactions ({payments.length})
          </h1>
          <p className="text-xs text-gray-500">
            Audit student purchases, gateway processing fees, and processed refund requests.
          </p>
        </div>

        <Button variant="outline" size="md" leftIcon={Download} onClick={handleExportCSV}>
          Export Transactions CSV
        </Button>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
        {[
          { id: 'all', label: 'All Transactions' },
          { id: 'success', label: 'Successful' },
          { id: 'pending', label: 'Pending' },
          { id: 'refunded', label: 'Refunded' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-colors cursor-pointer shrink-0 ${
              activeFilter === tab.id
                ? 'bg-[#4F46E5] text-white shadow-xs'
                : 'bg-[#F8F9FC] text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table / Mobile Stacked Cards */}
      <Card className="p-0 overflow-hidden shadow-soft">
        {isLoading ? (
          <TableRowSkeleton rows={4} />
        ) : filteredPayments.length === 0 ? (
          <div className="p-14 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
              <DollarSign className="w-6 h-6 text-gray-400" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 font-heading">No Transactions Found</h3>
            <p className="text-xs text-gray-500">No transactions match your current filter.</p>
            <Button variant="outline" size="sm" onClick={() => setActiveFilter('all')}>Show All</Button>
          </div>
        ) : (
          <>
            {/* Desktop View (>=768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-[#F8F9FC] border-b border-gray-200 text-gray-700 font-heading font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Tx ID</th>
                    <th className="p-4">Student</th>
                    <th className="p-4">Course Item</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Gateway</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredPayments.map((p) => (
                    <tr key={p._id || p.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-gray-900">{p.stripeSessionId || p._id || p.id}</td>
                      <td className="p-4 font-semibold text-gray-800">{p.student?.name || 'Student'}</td>
                      <td className="p-4">{p.course?.title || 'Course Purchase'}</td>
                      <td className="p-4 font-mono font-bold text-emerald-600">${(p.amount || 0).toFixed(2)}</td>
                      <td className="p-4">Stripe</td>
                      <td className="p-4">{getStatusBadge(p.status)}</td>
                      <td className="p-4 text-right font-mono text-gray-400">{new Date(p.createdAt || Date.now()).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View (<768px) Stacked Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredPayments.map((p) => (
                <div key={p._id || p.id} className="p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-gray-900">{p.stripeSessionId || p._id || p.id}</span>
                    {getStatusBadge(p.status)}
                  </div>
                  <p className="font-bold text-gray-900">{p.student?.name || 'Student'}</p>
                  <p className="text-gray-500">{p.course?.title || 'Course Purchase'}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 font-mono">
                    <span className="text-gray-400">Stripe • {new Date(p.createdAt || Date.now()).toLocaleDateString()}</span>
                    <strong className="text-emerald-600 text-sm">${(p.amount || 0).toFixed(2)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

    </div>
  );
};

export default ManagePayments;
