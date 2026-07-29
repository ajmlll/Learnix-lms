import React, { useState, useEffect } from 'react';
import { Award, Download, Share2, CheckCircle2, ShieldCheck, ExternalLink, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { toast } from 'react-toastify';

export const Certificates = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const certsList = Object.values(MOCK_CERTIFICATES);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8 font-sans">
        <div className="space-y-3">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 rounded-[12px] border-2 border-emerald-100 bg-white space-y-4 shadow-soft">
              <div className="flex items-start justify-between">
                <Skeleton circle className="w-12 h-12" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="space-y-1">
        <Badge variant="success" size="sm" hasDot>VERIFIED CREDENTIALS</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
          Earned Certificates ({certsList.length})
        </h1>
        <p className="text-xs text-gray-500">
          Official digital credentials awarded upon achieving 100% course completion.
        </p>
      </div>

      {certsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certsList.map((cert) => (
            <Card key={cert.certificateId} className="p-6 space-y-4 border-2 border-emerald-100 shadow-soft-lg">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-[12px] bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold">
                  <Award className="w-7 h-7" aria-hidden="true" />
                </div>
                <Badge variant="success" size="sm">VERIFIED</Badge>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono text-gray-400">ID: {cert.certificateId}</p>
                <h3 className="text-base font-bold font-heading text-gray-900">{cert.courseTitle}</h3>
                <p className="text-xs text-gray-500">Instructor: {cert.instructorName}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-100">
                <span className="font-mono text-emerald-600 font-bold">{cert.grade}</span>
                <span className="text-gray-400 font-mono">Issued {cert.issueDate}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  leftIcon={ExternalLink}
                  onClick={() => navigate('/verify-certificate')}
                >
                  View Credential
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={Download}
                  onClick={() => toast.info(`Downloading PDF for ${cert.certificateId}`)}
                >
                  PDF
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="p-14 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8 text-emerald-500" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-gray-900 font-heading">No Certificates Yet</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
              Complete any enrolled course with a passing score to earn your first verified digital credential.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            leftIcon={BookOpen}
            onClick={() => navigate('/student/my-learning')}
          >
            Continue Learning
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Certificates;
