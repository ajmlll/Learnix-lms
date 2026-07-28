import React, { useState } from 'react';
import { Sparkles, RefreshCw, Copy, Check, BookOpen, Code, Lightbulb } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { toast } from 'react-toastify';

export const AINotes = () => {
  const [selectedLecture, setSelectedLecture] = useState('m1l1');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsRegenerating(false);
    toast.success('✨ AI summary notes regenerated!');
  };

  const handleCopy = () => {
    setCopied(true);
    toast.success('AI Notes copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="bg-[#0F172A] text-white p-6 rounded-[12px] shadow-soft-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="amber" size="sm" hasDot>AI LEARNING ASSISTANT</Badge>
          <h1 className="text-2xl font-bold font-heading text-white">
            AI-Generated Summary Notes
          </h1>
          <p className="text-xs text-slate-400">
            Instant AI synthesis of video transcripts, key architectural patterns, and code snippets.
          </p>
        </div>

        <Button
          variant="amber"
          size="md"
          isLoading={isRegenerating}
          leftIcon={RefreshCw}
          onClick={handleRegenerate}
        >
          Regenerate Summary
        </Button>
      </div>

      {/* Lecture Selector & Controls */}
      <Card className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <BookOpen className="w-4 h-4 text-[#4F46E5]" />
          <span className="text-xs font-bold text-gray-700 font-heading shrink-0">Select Lecture:</span>
          <select
            value={selectedLecture}
            onChange={(e) => setSelectedLecture(e.target.value)}
            className="w-full text-xs font-semibold bg-[#F8F9FC] border border-gray-200 rounded-[8px] px-3 py-2 outline-none cursor-pointer"
          >
            <option value="m1l1">React 19 Server Actions & Component Architecture</option>
            <option value="m1l2">MongoDB Aggregation Pipeline & Indexing Rules</option>
            <option value="m1l3">Express Middleware & JWT Refresh Tokens</option>
          </select>
        </div>

        <Button variant="outline" size="sm" leftIcon={copied ? Check : Copy} onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy Notes'}
        </Button>
      </Card>

      {/* AI Summary Display Document */}
      <Card className="p-8 space-y-6 bg-white shadow-soft-lg border-2 border-indigo-50">
        
        {/* Document Header */}
        <div className="border-b border-gray-100 pb-4 space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-xs font-bold text-[#4F46E5] uppercase font-mono">SYNTHESIS COMPLETE</span>
          </div>
          <h2 className="text-xl font-bold font-heading text-gray-900">
            React 19 Server Actions & State Management
          </h2>
          <p className="text-xs text-gray-400 font-mono">Generated from MERN Stack Bootcamp 2026 • Module 1</p>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold font-heading text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
            Key Executive Takeaways
          </h3>
          <ul className="space-y-2 text-xs text-gray-600 list-disc pl-5 leading-relaxed">
            <li>React 19 eliminates manual pending flags by introducing <code className="font-mono text-[#4F46E5] font-bold">useActionState</code>.</li>
            <li>Server Actions execute directly on the server without requiring boilerplate Express API endpoints for simple form submissions.</li>
            <li>Use <code className="font-mono text-[#4F46E5] font-bold">useOptimistic</code> to render immediate feedback before the server roundtrip resolves.</li>
          </ul>
        </div>

        {/* Code Snippet Box */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold font-heading text-gray-900 flex items-center gap-2">
            <Code className="w-4 h-4 text-[#4F46E5]" />
            Synthesized Code Pattern
          </h3>
          <div className="p-4 bg-[#0F172A] text-slate-100 rounded-[10px] font-mono text-xs overflow-x-auto space-y-1">
            <p className="text-slate-400">// React 19 Server Action Example</p>
            <p className="text-indigo-400">async function updateUserProfile(previousState, formData) {'{'}</p>
            <p className="pl-4 text-emerald-300">'use server';</p>
            <p className="pl-4 text-slate-200">const name = formData.get('name');</p>
            <p className="pl-4 text-slate-200">const user = await db.users.update({'{'} name {'}'});</p>
            <p className="pl-4 text-amber-300">return {'{'} success: true, user {'}'};</p>
            <p className="text-indigo-400">{'}'}</p>
          </div>
        </div>

      </Card>

    </div>
  );
};

export default AINotes;
