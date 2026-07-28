import React, { useState } from 'react';
import { Search, ShieldCheck, Award, CheckCircle2, Download, Copy, ExternalLink, AlertTriangle } from 'lucide-react';
import { MOCK_CERTIFICATES } from '../../data/mockData';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import { toast } from 'react-toastify';

export const VerifyCertificate = () => {
  const [certId, setCertId] = useState('LRNX-2026-9842');
  const [activeCertificate, setActiveCertificate] = useState(MOCK_CERTIFICATES['LRNX-2026-9842']);
  const [hasSearched, setHasSearched] = useState(true);

  const handleVerify = (e) => {
    e.preventDefault();
    const found = MOCK_CERTIFICATES[certId.trim().toUpperCase()];
    setActiveCertificate(found || null);
    setHasSearched(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Certificate link copied to clipboard!');
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <Badge variant="success" size="sm" hasDot>
          PUBLIC CREDENTIAL VERIFIER
        </Badge>
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
          Verify Learnix Certificate
        </h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Enter a valid Learnix Certificate ID to verify the authenticity of a student's credential.
        </p>
      </div>

      {/* Lookup Form */}
      <Card className="p-6 shadow-soft-md space-y-4">
        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row items-center gap-3">
          <Input
            placeholder="Enter Certificate ID (e.g. LRNX-2026-9842)"
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
            leftIcon={Search}
            className="flex-1"
          />
          <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto shrink-0">
            Verify Credential
          </Button>
        </form>
        <p className="text-[11px] text-gray-400 text-center">
          Demo Valid IDs: <code className="font-mono text-[#4F46E5]">LRNX-2026-9842</code> or <code className="font-mono text-[#4F46E5]">LRNX-2026-4411</code>
        </p>
      </Card>

      {/* Verification Result Card */}
      {hasSearched && activeCertificate ? (
        <Card className="p-8 space-y-6 bg-white border-2 border-emerald-100 shadow-soft-lg relative overflow-hidden">
          
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <Badge variant="success" size="sm">AUTHENTIC CREDENTIAL VERIFIED</Badge>
                <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {activeCertificate.certificateId}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" leftIcon={Copy} onClick={handleCopyLink}>
                Copy Link
              </Button>
              <Button variant="secondary" size="sm" leftIcon={Download} onClick={() => toast.info('Certificate PDF download started')}>
                Download PDF
              </Button>
            </div>
          </div>

          {/* Certificate Credential Display Box */}
          <div className="bg-[#F8F9FC] p-6 rounded-[12px] border border-gray-200 space-y-6 text-center">
            
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-heading">
                THIS CERTIFICATE IS PROUDLY PRESENTED TO
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#4F46E5]">
                {activeCertificate.studentName}
              </h2>
            </div>

            <div className="space-y-1 max-w-lg mx-auto">
              <p className="text-xs text-gray-500">FOR SUCCESSFUL COMPLETION OF THE COURSE</p>
              <h3 className="text-base sm:text-lg font-bold font-heading text-gray-900">
                {activeCertificate.courseTitle}
              </h3>
              <p className="text-xs text-emerald-600 font-semibold font-mono">
                Grade Achieved: {activeCertificate.grade}
              </p>
            </div>

            {/* Verified Skills */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-gray-400 mb-2">VERIFIED SKILLS & COMPETENCIES</p>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {activeCertificate.skills?.map((skill, idx) => (
                  <Badge key={idx} variant="primary" size="sm">{skill}</Badge>
                ))}
              </div>
            </div>

            {/* Bottom Metadata */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">ISSUED BY</p>
                <p className="font-semibold text-gray-800">{activeCertificate.instructorName}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">ISSUE DATE</p>
                <p className="font-semibold text-gray-800">{activeCertificate.issueDate}</p>
              </div>
            </div>

          </div>

        </Card>
      ) : hasSearched ? (
        /* Not Found State */
        <Card className="p-8 text-center space-y-3 bg-red-50/50 border-red-100">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
          <h3 className="text-base font-bold text-gray-900 font-heading">Invalid Certificate ID</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            No verified record matching ID <code className="font-mono text-red-600 font-bold">{certId}</code> was found in the Learnix registry.
          </p>
        </Card>
      ) : null}

    </div>
  );
};

export default VerifyCertificate;
