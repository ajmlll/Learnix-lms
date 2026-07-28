import React from 'react';
import { Home, ArrowLeft, BookOpen, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 bg-[#F8F9FC] font-sans">
      <Card className="max-w-md w-full text-center space-y-5 p-8 shadow-soft-lg">
        <div className="text-6xl font-extrabold font-mono text-[#4F46E5] tracking-tight">404</div>
        <Badge variant="primary" size="md">PAGE NOT FOUND</Badge>
        <h2 className="text-xl font-bold font-heading text-gray-900">Lost in the Codebase?</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          The page or course resource you are looking for has been moved, renamed, or doesn't exist.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-2 pt-2">
          <Button variant="outline" leftIcon={ArrowLeft} onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button variant="primary" leftIcon={Home} onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
