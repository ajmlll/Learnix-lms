import React from 'react';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-[#F8F9FC]">
      <Card className="max-w-md w-full text-center space-y-4 p-8 shadow-soft-lg">
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <Badge variant="danger" size="md">403 ACCESS RESTRICTED</Badge>
        <h2 className="text-2xl font-bold font-heading text-gray-900">Permission Denied</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          You do not have the required role permissions to view this protected page. Try switching your active role view from the top navigation bar.
        </p>

        <div className="flex justify-center gap-3 pt-4">
          <Button variant="secondary" leftIcon={ArrowLeft} onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button variant="primary" leftIcon={Home} onClick={() => navigate('/')}>
            Return Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Unauthorized;
