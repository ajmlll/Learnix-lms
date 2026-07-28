import React, { useState } from 'react';
import { Settings, Save, Shield, Key, DollarSign, CheckCircle2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import { toast } from 'react-toastify';

export const AdminSettings = () => {
  const [platformName, setPlatformName] = useState('Learnix AI LMS Platform');
  const [commissionRate, setCommissionRate] = useState('20');
  const [stripeKey, setStripeKey] = useState('pk_live_51Mxxxxxxxxxxxxxxxx');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSaving(false);
    toast.success('🎉 Admin platform settings saved successfully!');
  };

  return (
    <div className="py-6 space-y-8 font-sans max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="space-y-1">
        <Badge variant="dark" size="sm" hasDot>SYSTEM CONFIGURATION</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
          Platform System Settings
        </h1>
        <p className="text-xs text-gray-500">
          Manage platform revenue commission splits, payment gateways, and system maintenance.
        </p>
      </div>

      <Card className="p-6 space-y-6 shadow-soft">
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <Input
            label="Platform Public Title"
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
            isRequired
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Platform Fee Commission Rate (%)"
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              helperText="Percentage retained by platform per course sale (Instructor receives 100% - rate)."
            />
            <Input
              label="Stripe Live API Publishable Key"
              value={stripeKey}
              onChange={(e) => setStripeKey(e.target.value)}
              type="password"
            />
          </div>

          <div className="p-4 bg-[#F8F9FC] rounded-[10px] border border-gray-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-gray-900 font-heading">Maintenance Mode</h4>
              <p className="text-[11px] text-gray-500">Prevent student enrollments and lock editing during database upgrades.</p>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="w-4 h-4 accent-[#4F46E5] cursor-pointer"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button type="submit" variant="primary" size="md" isLoading={isSaving} leftIcon={Save}>
              Save System Settings
            </Button>
          </div>
        </form>
      </Card>

    </div>
  );
};

export default AdminSettings;
