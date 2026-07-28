import React from 'react';
import { DollarSign, Calendar, CreditCard, ArrowUpRight, TrendingUp, Download } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { ENROLLMENT_TRENDS, PAYOUT_HISTORY } from '../../data/mockData';
import { toast } from 'react-toastify';

export const Earnings = () => {
  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="space-y-1">
        <Badge variant="success" size="sm" hasDot>FINANCIAL ANALYTICS</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
          Revenue & Payout Manager
        </h1>
        <p className="text-xs text-gray-500">
          Track sales, gross revenue share, and upcoming direct deposit payouts.
        </p>
      </div>

      {/* Top Row: Next Payout Card & Lifetime Earnings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Next Payout Card */}
        <Card className="p-6 md:col-span-2 bg-gradient-to-r from-[#0F172A] to-slate-900 text-white shadow-soft-lg space-y-4 relative overflow-hidden">
          <div className="flex items-start justify-between z-10 relative">
            <div>
              <p className="text-xs text-slate-400 font-medium">Estimated Next Payout</p>
              <h2 className="text-3xl font-extrabold font-mono text-white mt-1">$3,420.00 USD</h2>
            </div>
            <Badge variant="amber" size="sm">SCHEDULED</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800 z-10 relative">
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" />
              Payout Date: August 1, 2026
            </span>
            <span className="flex items-center gap-1 font-mono">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              Direct Deposit (Bank ****4211)
            </span>
          </div>
        </Card>

        {/* Lifetime Earnings Stat Card */}
        <Card className="p-6 space-y-3 flex flex-col justify-between shadow-soft">
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Lifetime Earnings</p>
            <h3 className="text-2xl font-bold font-mono text-emerald-600 mt-1">$21,390.00</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            leftIcon={Download}
            onClick={() => toast.info('Exporting 1099 Tax Statement (PDF)...')}
          >
            Export Tax Statement
          </Button>
        </Card>

      </div>

      {/* Recharts Area Chart for Gross Monthly Revenue */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
              Gross Monthly Revenue Share ($ USD)
            </h3>
            <p className="text-xs text-gray-500">Instructor revenue share (80% net payout after platform fees)</p>
          </div>
          <Badge variant="amber" size="sm">80% SHARE</Badge>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ENROLLMENT_TRENDS}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', color: '#FFF', fontSize: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Payout History Table */}
      <Card className="p-0 overflow-hidden shadow-soft space-y-0">
        <div className="p-4 bg-[#F8F9FC] border-b border-gray-200">
          <h3 className="text-sm font-bold font-heading text-gray-900">Payout History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-white border-b border-gray-100 text-gray-500 font-heading uppercase text-[11px]">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {PAYOUT_HISTORY.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-4 font-mono font-bold text-gray-900">{p.date}</td>
                  <td className="p-4">{p.method}</td>
                  <td className="p-4 font-mono font-bold text-emerald-600">${p.amount.toFixed(2)}</td>
                  <td className="p-4"><Badge variant="success" size="sm">COMPLETED</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};

export default Earnings;
